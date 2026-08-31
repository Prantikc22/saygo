export type Transcript = {
  id: string;
  user_id?: string;
  text: string;
  duration_seconds: number;
  language: string;
  model: string;
  source?: string;
  created_at: string;
};

export type DictionaryEntry = { id: string; phrase: string; pronunciation?: string };
