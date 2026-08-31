'use client';

import {
  AudioLines,
  BookOpenText,
  Check,
  Copy,
  Keyboard,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import type { Transcript } from '@/lib/types';
import type { HotkeySetting } from '@/lib/hotkey';

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function relativeDate(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(delta / 60000);
  if (minutes < 60) return minutes < 1 ? 'Just now' : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function HistoryView({
  transcripts,
  search,
  onSearch,
  onCopy,
  onDelete,
  onClear,
}: {
  transcripts: Transcript[];
  search: string;
  onSearch: (value: string) => void;
  onCopy: (value: string) => void;
  onDelete: (transcript: Transcript) => void;
  onClear: () => void;
}) {
  const filtered = transcripts.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#879524]">Your archive</p>
          <h1 className="mt-1 text-4xl font-semibold tracking-[-.05em]">
            Dictation history
          </h1>
          <p className="mt-2 text-sm text-[#777d75]">
            Search, copy, or remove anything you have dictated.
          </p>
        </div>
        <button
          onClick={onClear}
          disabled={!transcripts.length}
          className="h-10 rounded-xl border border-[#b96961]/25 bg-white px-4 text-sm font-bold text-[#9a4f49] disabled:opacity-40"
        >
          Clear history
        </button>
      </div>
      <div className="relative mt-7">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8b9089]" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="h-12 w-full rounded-2xl border border-[#1d211d]/10 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#a6b43e]"
          placeholder="Search every dictation"
        />
      </div>
      <div className="mt-5 space-y-3">
        {!filtered.length && (
          <div className="rounded-[24px] border border-dashed border-[#1d211d]/15 bg-white/55 p-12 text-center">
            <AudioLines className="mx-auto size-8 text-[#9da198]" />
            <p className="mt-4 font-semibold">No dictations found</p>
            <p className="mt-1 text-sm text-[#858b83]">
              Your next transcription will appear here automatically.
            </p>
          </div>
        )}
        {filtered.map((item) => (
          <article
            key={item.id}
            className="group rounded-2xl border border-[#1d211d]/9 bg-white p-5 transition hover:border-[#aeba55]"
          >
            <div className="flex gap-4">
              <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-[#f0eee8] text-[#687067]">
                <AudioLines className="size-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] leading-7">{item.text}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[#898e87]">
                  <span>{relativeDate(item.created_at)}</span>
                  <span className="size-1 rounded-full bg-[#c8cbc4]" />
                  <span>{formatTime(item.duration_seconds)}</span>
                  <span className="size-1 rounded-full bg-[#c8cbc4]" />
                  <span>{item.language}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-start gap-1">
                <button
                  onClick={() => onCopy(item.text)}
                  className="grid size-9 place-items-center rounded-lg hover:bg-[#f1efe9]"
                  aria-label="Copy transcript"
                >
                  <Copy className="size-4" />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="grid size-9 place-items-center rounded-lg text-[#9a4f49] hover:bg-red-50"
                  aria-label="Delete transcript"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DictionaryView({
  words,
  newWord,
  onNewWord,
  onAdd,
  onRemove,
}: {
  words: string[];
  newWord: string;
  onNewWord: (value: string) => void;
  onAdd: () => void;
  onRemove: (word: string) => void;
}) {
  return (
    <section>
      <div>
        <p className="text-sm font-semibold text-[#879524]">Vocabulary</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-[-.05em]">
          Personal dictionary
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777d75]">
          Add names, products, acronyms, and specialist terms. They are sent as
          context with every transcription so Saygo spells them correctly.
        </p>
      </div>
      <div className="mt-8 rounded-[28px] border border-[#1d211d]/10 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            onKeyDown={(event) => {
              if (event.key === 'Enter') onAdd();
            }}
            value={newWord}
            onChange={(event) => onNewWord(event.target.value)}
            className="h-12 min-w-0 flex-1 rounded-xl border border-[#1d211d]/12 bg-[#f8f7f3] px-4 outline-none focus:border-[#a6b43e]"
            placeholder="Add a name or phrase…"
          />
          <button
            onClick={onAdd}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1d211d] px-5 text-sm font-bold text-white"
          >
            <Plus className="size-4" /> Add term
          </button>
        </div>
        <div className="mt-7 flex flex-wrap gap-2.5">
          {words.map((word) => (
            <span
              key={word}
              className="inline-flex items-center gap-2 rounded-full bg-[#f0f5c8] px-4 py-2 text-sm font-semibold text-[#4e5811]"
            >
              {word}
              <button
                onClick={() => onRemove(word)}
                aria-label={`Remove ${word}`}
                className="grid size-5 place-items-center rounded-full hover:bg-[#dce69b]"
              >
                <Trash2 className="size-3" />
              </button>
            </span>
          ))}
        </div>
        {!words.length && (
          <div className="mt-7 rounded-2xl border border-dashed border-[#1d211d]/15 p-10 text-center">
            <BookOpenText className="mx-auto size-8 text-[#9da198]" />
            <p className="mt-3 font-semibold">Your dictionary is empty</p>
            <p className="mt-1 text-sm text-[#858b83]">
              Add the first term above.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function ShortcutsView({
  hotkey,
  desktop,
  onOpenSettings,
}: {
  hotkey: HotkeySetting;
  desktop: boolean;
  onOpenSettings: () => void;
}) {
  return (
    <section>
      <div>
        <p className="text-sm font-semibold text-[#879524]">
          Hands-free control
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-[-.05em]">
          Recording shortcut
        </h1>
        <p className="mt-2 text-sm text-[#777d75]">
          Set the combination that starts and stops dictation.
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-[1fr_.8fr]">
        <article className="rounded-[28px] border border-[#1d211d]/10 bg-white p-7 sm:p-9">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#e9f784]">
            <Keyboard className="size-5" />
          </span>
          <h2 className="mt-7 text-2xl font-semibold tracking-[-.04em]">
            Your current shortcut
          </h2>
          <button
            onClick={onOpenSettings}
            className="mt-6 flex min-h-16 w-full items-center justify-center rounded-2xl border border-[#9dab32] bg-[#f4f8d7] px-4 font-mono text-lg font-bold"
          >
            {hotkey.label}
          </button>
          <button
            onClick={onOpenSettings}
            className="mt-4 h-11 w-full rounded-xl bg-[#1d211d] text-sm font-bold text-white"
          >
            Change shortcut
          </button>
        </article>
        <article className="rounded-[28px] bg-[#1d211d] p-7 text-white sm:p-9">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-xs font-bold text-[#e9f784]">
            <Check className="size-3.5" />{' '}
            {desktop ? 'Global shortcut active' : 'Browser shortcut active'}
          </div>
          <h2 className="mt-7 text-2xl font-semibold tracking-[-.04em]">
            {desktop ? 'Works over every app.' : 'Works in this browser tab.'}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/55">
            {desktop
              ? 'Keep Saygo in the background. Press the shortcut wherever your cursor is, dictate, then the text is pasted for you.'
              : 'Install the desktop app for system-wide dictation and automatic cursor insertion.'}
          </p>
        </article>
      </div>
    </section>
  );
}
