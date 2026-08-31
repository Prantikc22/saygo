import type { Transcript } from '@/lib/types';

export const TRANSCRIPTS_STORAGE_KEY = 'saygo-transcripts';
export const DICTIONARY_STORAGE_KEY = 'saygo-dictionary';

export function readLocalTranscripts(fallback: Transcript[]) {
  try {
    const stored = window.localStorage.getItem(TRANSCRIPTS_STORAGE_KEY) || window.localStorage.getItem('voxquill-transcripts');
    return stored ? JSON.parse(stored) as Transcript[] : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocalTranscripts(transcripts: Transcript[]) {
  window.localStorage.setItem(TRANSCRIPTS_STORAGE_KEY, JSON.stringify(transcripts));
}

export function readLocalDictionary(fallback: string[]) {
  try {
    const stored = window.localStorage.getItem(DICTIONARY_STORAGE_KEY) || window.localStorage.getItem('voxquill-dictionary');
    return stored ? JSON.parse(stored) as string[] : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocalDictionary(words: string[]) {
  window.localStorage.setItem(DICTIONARY_STORAGE_KEY, JSON.stringify(words));
}
