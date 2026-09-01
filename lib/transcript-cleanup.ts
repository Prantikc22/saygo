export function removeTranscriptArtifacts(text: string) {
  let cleaned = text
    .replace(/^```(?:text)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
    .replace(/^(?:[-–—•*]\s*)+/, '')
    .trim();

  // Speech models can decode silence as a short closing or a stray line of
  // dialogue. Remove only suffixes attached to a real transcript so a user can
  // still intentionally dictate one of these phrases on its own.
  const suffixes = [
    /(?:\s+|\s*[-–—•]\s*)(?:thank you(?: very much)?|thanks(?: for (?:watching|listening))?)[.!?…]*\s*$/i,
    /\s*[-–—•]\s*(?:what are you saying|did it find me though)[.!?…]*\s*$/i,
  ];
  let previous = '';
  while (cleaned && cleaned !== previous) {
    previous = cleaned;
    for (const suffix of suffixes) cleaned = cleaned.replace(suffix, '').trim();
  }

  return cleaned.replace(/[ \t]+([,.;!?])/g, '$1').trim();
}
