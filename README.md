# Saygo

Saygo is an open-source, voice-first dictation and transcription app for the
web, macOS, and Windows. It records speech, transcribes it, applies light
cleanup, respects a personal dictionary, and can insert the result at the
active cursor from a compact desktop widget.

## What works today

- Browser dictation and audio-file transcription
- AI cleanup with a guard against invented greetings and sign-offs
- A personal dictionary for names, acronyms, and specialist vocabulary
- Searchable local history
- macOS and Windows desktop widget with a global hotkey
- Browser-based desktop authentication that returns through `saygo://auth`
- Paddle-ready Pro and Business monthly/annual checkout

Offline downloadable speech models and live meeting capture with speaker
diarization are on the product roadmap; the website labels them accordingly.

## Self-host the web app

Requirements: Node.js 22.13 or newer and a Supabase project.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill in the Supabase and OpenRouter values in `.env.local`, then apply the SQL
migration in `supabase/migrations/` to your Supabase project. Open
`http://localhost:3000`.

For a production build:

```bash
npm run build
npm start
```

## Build the desktop app

Install the current Rust toolchain and the platform prerequisites documented by
Tauri, then run:

```bash
npm run desktop:dev
npm run desktop:build
```

The desktop build loads the hosted `/app` route by default. Change
`src-tauri/tauri.conf.json` if your self-hosted deployment uses another URL,
and add that origin to `src-tauri/capabilities/default.json`.

## Privacy notes

Cloud dictation sends audio to the configured transcription provider. Audio is
not intentionally retained by Saygo after processing. A future local-model mode
is intended to keep audio on-device. Live meeting capture will require both
microphone and macOS system-audio recording permission to hear every speaker.

## License

MIT. See [LICENSE](LICENSE).
