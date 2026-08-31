import { Buffer } from 'node:buffer';

const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const MODEL = 'openai/whisper-large-v3-turbo';
const POLISH_MODEL = 'openai/gpt-5-mini';

function audioFormat(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'm4a') return 'mp4';
  if (
    extension &&
    ['mp3', 'mp4', 'wav', 'webm', 'flac', 'ogg'].includes(extension)
  )
    return extension;
  const subtype = file.type.split('/')[1]?.split(';')[0];
  return subtype === 'mpeg'
    ? 'mp3'
    : subtype === 'x-m4a'
      ? 'mp4'
      : subtype || 'webm';
}

async function validateUser(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return false;
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
  });
  return response.ok;
}

async function polishTranscript(
  text: string,
  dictionary: string,
  apiKey: string,
  origin: string,
) {
  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': origin,
          'X-Title': 'Saygo',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_POLISH_MODEL || POLISH_MODEL,
          messages: [
            {
              role: 'system',
              content:
                "You are a precise dictation editor. Preserve the speaker's meaning and tone. Remove filler words and accidental repetitions, repair punctuation and grammar, and apply spoken formatting commands such as new paragraph. Never add greetings, sign-offs, thanks, conclusions, facts, or commentary that the speaker did not say. Return only the final text.",
            },
            {
              role: 'user',
              content: `${dictionary ? `Preferred spellings and vocabulary: ${dictionary}\n\n` : ''}Raw dictation:\n${text}`,
            },
          ],
          temperature: 0.1,
          max_completion_tokens: Math.min(
            1800,
            Math.max(250, Math.ceil(text.length * 0.8)),
          ),
        }),
      },
    );
    if (!response.ok) return text;
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return payload.choices?.[0]?.message?.content?.trim() || text;
  } catch (error) {
    console.error('OpenRouter polish error', error);
    return text;
  }
}

function removeInjectedClosing(text: string) {
  // Short standalone closings are a common speech-model hallucination after
  // silence. Saygo should never append one on the user's behalf.
  return text.replace(/(?:\s|\n)*(?:thank you)[.!]*(?:\s|\n)*$/i, '').trim();
}

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';
  if (!token || !(await validateUser(token))) {
    return Response.json(
      { error: 'Please sign in before transcribing audio.' },
      { status: 401 },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey)
    return Response.json(
      { error: 'Transcription service is not configured.' },
      { status: 503 },
    );

  try {
    const form = await request.formData();
    const audio = form.get('audio');
    const languageField = form.get('language');
    const language = typeof languageField === 'string' ? languageField : 'auto';
    const dictionaryField = form.get('dictionary');
    const dictionary =
      typeof dictionaryField === 'string' ? dictionaryField.slice(0, 1500) : '';
    if (!(audio instanceof File))
      return Response.json(
        { error: 'An audio file is required.' },
        { status: 400 },
      );
    if (audio.size === 0)
      return Response.json(
        { error: 'The audio file is empty.' },
        { status: 400 },
      );
    if (audio.size > MAX_AUDIO_BYTES)
      return Response.json(
        { error: 'Audio files must be smaller than 25 MB.' },
        { status: 413 },
      );

    const data = Buffer.from(await audio.arrayBuffer()).toString('base64');
    const upstream = await fetch(
      'https://openrouter.ai/api/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': request.headers.get('origin') || 'https://saygo.app',
          'X-Title': 'Saygo',
        },
        body: JSON.stringify({
          model: MODEL,
          input_audio: { data, format: audioFormat(audio) },
          ...(language !== 'auto' ? { language } : {}),
          ...(dictionary
            ? { prompt: `Preferred spellings and vocabulary: ${dictionary}` }
            : {}),
        }),
      },
    );

    const payload = (await upstream.json()) as {
      text?: string;
      language?: string;
      error?: { message?: string } | string;
    };
    if (!upstream.ok) {
      const detail =
        typeof payload.error === 'string'
          ? payload.error
          : payload.error?.message;
      console.error('OpenRouter transcription error', upstream.status, detail);
      return Response.json(
        {
          error:
            'The transcription provider could not process this audio. Please try again.',
        },
        { status: upstream.status >= 500 ? 502 : 400 },
      );
    }
    if (!payload.text)
      return Response.json(
        { error: 'No speech was detected in the recording.' },
        { status: 422 },
      );

    const polishedText = await polishTranscript(
      payload.text,
      dictionary,
      apiKey,
      request.headers.get('origin') || 'https://saygo.app',
    );

    return Response.json(
      {
        text: removeInjectedClosing(polishedText),
        rawText: payload.text,
        language:
          payload.language ||
          (language === 'auto' ? 'Auto detected' : language),
        model: 'Saygo S1 Voice Engine',
        polishModel: 'Saygo S1 Polish Engine',
      },
      {
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  } catch (error) {
    console.error('Transcription route error', error);
    return Response.json(
      { error: 'The audio upload could not be processed.' },
      { status: 500 },
    );
  }
}
