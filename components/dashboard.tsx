'use client';

import {
  AudioLines,
  BookOpenText,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Crown,
  FileAudio,
  History,
  Home,
  Keyboard,
  Languages,
  LayoutGrid,
  LoaderCircle,
  LogOut,
  Mic,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  WandSparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Brand } from '@/components/brand';
import { useAuth } from '@/components/auth-provider';
import {
  DesktopOverlay,
  showDesktopOverlay,
} from '@/components/desktop-overlay';
import {
  DictionaryView,
  HistoryView,
  ShortcutsView,
} from '@/components/dashboard-sections';
import { SettingsDialog } from '@/components/settings-dialog';
import {
  defaultHotkey,
  eventMatchesHotkey,
  HOTKEY_STORAGE_KEY,
  type HotkeySetting,
} from '@/lib/hotkey';
import {
  readLocalDictionary,
  readLocalTranscripts,
  writeLocalDictionary,
  writeLocalTranscripts,
} from '@/lib/local-data';
import { isTauriDesktop } from '@/lib/desktop-auth';
import { supabase } from '@/lib/supabase';
import type { Transcript } from '@/lib/types';

const starterTranscripts: Transcript[] = [
  {
    id: 'demo-1',
    text: 'Hey team — quick update on the launch. We’re ahead of schedule and the early feedback has been really promising.',
    duration_seconds: 18,
    language: 'English',
    model: 'Saygo S1 Voice Engine',
    source: 'demo',
    created_at: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-2',
    text: 'Could we move the design review to Thursday afternoon? I’d like one more pass on the onboarding flow first.',
    duration_seconds: 14,
    language: 'English',
    model: 'Saygo S1 Voice Engine',
    source: 'demo',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-3',
    text: 'Remember to include the activation rate and week-one retention in tomorrow’s product update.',
    duration_seconds: 11,
    language: 'English',
    model: 'Saygo S1 Voice Engine',
    source: 'demo',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const wave = [
  16, 25, 37, 22, 43, 30, 54, 31, 48, 63, 34, 52, 27, 43, 21, 36, 24, 44, 29,
  19,
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

function relativeDate(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(delta / 60000);
  if (mins < 60) return mins < 1 ? 'Just now' : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function Dashboard() {
  const { user, session, loading, signOut } = useAuth();
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [transcripts, setTranscripts] =
    useState<Transcript[]>(starterTranscripts);
  const [language, setLanguage] = useState('auto');
  const [search, setSearch] = useState('');
  const [activeNav, setActiveNav] = useState('Home');
  // Detect Tauri during the first client render so the full web dashboard never
  // flashes inside the compact desktop window.
  const [desktopMode] = useState(() => isTauriDesktop());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [hotkey, setHotkey] = useState<HotkeySetting>({
    accelerator: 'CommandOrControl+Shift+Space',
    label: '⌘ / Ctrl + Shift + Space',
    code: 'Space',
    primary: true,
    control: false,
    alt: false,
    shift: true,
  });
  const [dictionary, setDictionary] = useState([
    'Saygo',
    'Prantik',
    'Supabase',
  ]);
  const [newWord, setNewWord] = useState('');
  const recorder = useRef<MediaRecorder | null>(null);
  const nativeRecording = useRef(false);
  const chunks = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  const fileInput = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored =
          window.localStorage.getItem(HOTKEY_STORAGE_KEY) ||
          window.localStorage.getItem('voxquill-hotkey');
        setHotkey(
          stored ? (JSON.parse(stored) as HotkeySetting) : defaultHotkey(),
        );
        const storedLanguage =
          window.localStorage.getItem('saygo-language') ||
          window.localStorage.getItem('voxquill-language') ||
          window.localStorage.getItem('openwhispr-language');
        if (storedLanguage) setLanguage(storedLanguage);
        setTranscripts(readLocalTranscripts(starterTranscripts));
        setDictionary(readLocalDictionary(['Saygo', 'Prantik', 'Supabase']));
      } catch {
        setHotkey(defaultHotkey());
      }
    });
  }, []);

  const updateHotkey = useCallback((next: HotkeySetting) => {
    setHotkey(next);
    window.localStorage.setItem(HOTKEY_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const updateLanguage = useCallback((next: string) => {
    setLanguage(next);
    window.localStorage.setItem('saygo-language', next);
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('transcripts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error: queryError }) => {
        if (data && !queryError) {
          const rows = data as Transcript[];
          setTranscripts(rows);
          writeLocalTranscripts(rows);
        }
      });
    supabase
      .from('dictionary_entries')
      .select('id, phrase')
      .order('phrase')
      .then(({ data, error: queryError }) => {
        if (data && !queryError) {
          const words = data.map((item) => item.phrase);
          setDictionary(words);
          writeLocalDictionary(words);
        }
      });
  }, [user]);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(
      () => setElapsed((Date.now() - startedAt.current) / 1000),
      250,
    );
    return () => window.clearInterval(timer);
  }, [recording]);

  const transcribe = useCallback(
    async (blob: Blob, duration: number, filename = 'recording.webm') => {
      if (!session?.access_token) {
        setError(
          'Sign in to use secure AI transcription. Your recording was not uploaded.',
        );
        return;
      }
      setProcessing(true);
      setError('');
      try {
        const body = new FormData();
        body.append('audio', blob, filename);
        body.append('language', language);
        body.append('dictionary', dictionary.join(', '));
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
          body,
        });
        const payload = (await response.json()) as {
          text?: string;
          error?: string;
          language?: string;
        };
        if (!response.ok || !payload.text)
          throw new Error(payload.error || 'Transcription failed.');
        const text = payload.text.trim();
        setResult(text);
        const record = {
          user_id: user?.id,
          text,
          duration_seconds: Math.max(1, Math.round(duration)),
          language:
            payload.language ||
            (language === 'auto' ? 'Auto detected' : language),
          model: 'Saygo S1 Voice Engine',
          source: 'microphone',
        };
        const { data, error: insertError } = await supabase
          .from('transcripts')
          .insert(record)
          .select()
          .single();
        const local: Transcript =
          data && !insertError
            ? (data as Transcript)
            : {
                ...record,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
              };
        setTranscripts((current) => {
          const next = [
            local,
            ...current.filter((item) => !item.id.startsWith('demo-')),
          ];
          writeLocalTranscripts(next);
          return next;
        });
        if ('__TAURI_INTERNALS__' in window) {
          const { invoke } = await import('@tauri-apps/api/core');
          try {
            const delivery = await invoke<{ pasted: boolean }>('deliver_text', {
              text,
            });
            if (delivery.pasted) {
              setResult('');
            } else {
              setError('Transcribed and copied — press ⌘V to paste.');
            }
          } catch {
            try {
              await navigator.clipboard.writeText(text);
              setError('Transcribed and copied — press ⌘V to paste.');
            } catch {
              setError(
                'Transcription is ready. Open Saygo History to copy it.',
              );
            }
          }
        }
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : 'Could not transcribe this recording.',
        );
      } finally {
        setProcessing(false);
      }
    },
    [dictionary, language, session, user],
  );

  const startRecording = useCallback(async () => {
    if (!user) {
      setError('Create a free account or sign in before your first dictation.');
      return;
    }
    setError('');
    setResult('');
    try {
      if (desktopMode) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('start_native_recording');
        nativeRecording.current = true;
        startedAt.current = Date.now();
        setElapsed(0);
        setRecording(true);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const preferred = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const mediaRecorder = new MediaRecorder(stream, { mimeType: preferred });
      chunks.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size) chunks.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const duration = (Date.now() - startedAt.current) / 1000;
        const blob = new Blob(chunks.current, { type: preferred });
        if (blob.size > 0) void transcribe(blob, duration);
      };
      recorder.current = mediaRecorder;
      startedAt.current = Date.now();
      setElapsed(0);
      setRecording(true);
      mediaRecorder.start(500);
    } catch (caught) {
      const detail = caught instanceof Error ? caught.message : String(caught);
      const denied =
        (caught instanceof Error && caught.name === 'NotAllowedError') ||
        /permission|not allowed|denied|privacy/i.test(detail);
      setError(
        denied
          ? desktopMode
            ? 'Microphone access is off. Allow Saygo in System Settings, then click the mic again.'
            : 'Microphone access was denied. Enable it in your browser or system settings.'
          : detail && detail !== '[object Object]'
            ? `Could not start the microphone: ${detail}`
            : 'No microphone was found. You can upload an audio file instead.',
      );
    }
  }, [desktopMode, transcribe, user]);

  const stopRecording = useCallback(() => {
    if (desktopMode && nativeRecording.current) {
      nativeRecording.current = false;
      setRecording(false);
      void import('@tauri-apps/api/core')
        .then(({ invoke }) =>
          invoke<{ bytes: number[]; durationMs: number }>(
            'stop_native_recording',
          ),
        )
        .then(({ bytes, durationMs }) =>
          transcribe(
            new Blob([new Uint8Array(bytes)], { type: 'audio/wav' }),
            durationMs / 1000,
            'dictation.wav',
          ),
        )
        .catch((caught) => {
          const detail = caught instanceof Error ? caught.message : String(caught);
          setError(
            detail && detail !== '[object Object]'
              ? detail
              : 'Could not finish the recording.',
          );
        });
      return;
    }
    recorder.current?.stop();
    setRecording(false);
  }, [desktopMode, transcribe]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ('__TAURI_INTERNALS__' in window) return;
      if (eventMatchesHotkey(event, hotkey)) {
        event.preventDefault();
        if (processing) return;
        if (recording) stopRecording();
        else void startRecording();
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, [hotkey, processing, recording, startRecording, stopRecording]);

  useEffect(() => {
    if (!('__TAURI_INTERNALS__' in window)) return;
    let disposed = false;
    void import('@tauri-apps/plugin-global-shortcut').then(
      async ({ register, unregister }) => {
        try {
          await unregister(hotkey.accelerator).catch(() => undefined);
          if (disposed) return;
          await register(hotkey.accelerator, (event) => {
            if (event.state !== 'Pressed' || processing) return;
            void showDesktopOverlay('compact');
            if (recording) stopRecording();
            else void startRecording();
          });
        } catch (shortcutError) {
          console.warn('Global shortcut unavailable', shortcutError);
        }
      },
    );
    return () => {
      disposed = true;
      void import('@tauri-apps/plugin-global-shortcut').then(({ unregister }) =>
        unregister(hotkey.accelerator).catch(() => undefined),
      );
    };
  }, [hotkey, processing, recording, startRecording, stopRecording]);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!user) {
      setError('Sign in before uploading audio for transcription.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('Audio files must be smaller than 25 MB.');
      return;
    }
    await transcribe(file, 1, file.name);
    event.target.value = '';
  }

  async function copyResult(text = result) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  async function deleteTranscript(item: Transcript) {
    setTranscripts((current) => {
      const next = current.filter((row) => row.id !== item.id);
      writeLocalTranscripts(next);
      return next;
    });
    if (user && !item.id.startsWith('demo-'))
      await supabase.from('transcripts').delete().eq('id', item.id);
  }

  async function addDictionaryWord() {
    const phrase = newWord.trim();
    if (!phrase || dictionary.includes(phrase)) return;
    setDictionary((current) => {
      const next = [...current, phrase];
      writeLocalDictionary(next);
      return next;
    });
    setNewWord('');
    if (user)
      await supabase
        .from('dictionary_entries')
        .insert({ user_id: user.id, phrase });
  }

  async function removeDictionaryWord(phrase: string) {
    setDictionary((current) => {
      const next = current.filter((word) => word !== phrase);
      writeLocalDictionary(next);
      return next;
    });
    if (user)
      await supabase
        .from('dictionary_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('phrase', phrase);
  }

  async function clearHistory() {
    setTranscripts([]);
    writeLocalTranscripts([]);
    if (user)
      await supabase.from('transcripts').delete().eq('user_id', user.id);
  }

  const filtered = transcripts.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase()),
  );
  const wordCount = transcripts.reduce(
    (total, item) => total + item.text.split(/\s+/).length,
    0,
  );

  if (desktopMode) {
    return (
      <>
        <DesktopOverlay
          user={user}
          loading={loading}
          recording={recording}
          processing={processing}
          elapsed={elapsed}
          error={error}
          hotkey={hotkey}
          settingsOpen={settingsOpen}
          onToggle={() => (recording ? stopRecording() : void startRecording())}
          onSettings={() => setSettingsOpen(true)}
          onOpenMicrophoneSettings={() => {
            void import('@tauri-apps/api/core').then(({ invoke }) =>
              invoke('open_microphone_settings'),
            );
          }}
        />
        <SettingsDialog
          open={settingsOpen}
          desktop
          hotkey={hotkey}
          language={language}
          onLanguageChange={updateLanguage}
          onHotkeyChange={updateHotkey}
          accountEmail={user?.email}
          onSignOut={signOut}
          onClose={() => {
            setSettingsOpen(false);
            void showDesktopOverlay(user ? 'compact' : 'signed-out');
          }}
        />
      </>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#f5f3ed] text-[#1d211d]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col border-r border-[#1d211d]/10 bg-[#1d211d] p-4 text-white lg:flex">
        <Link className="px-2 py-3" href="/">
          <Brand compact inverse />
        </Link>
        <div className="mt-7 space-y-1.5">
          {[
            { label: 'Home', icon: Home },
            { label: 'History', icon: History },
            { label: 'Dictionary', icon: BookOpenText },
            { label: 'Shortcuts', icon: Keyboard },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${activeNav === label ? 'bg-[#e9f784] text-[#1d211d]' : 'text-white/55 hover:bg-white/7 hover:text-white'}`}
            >
              <Icon className="size-[18px]" />
              {label}
            </button>
          ))}
        </div>
        <div className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-white/30">
          Workspace
        </div>
        <button
          onClick={() => setActiveNav('All dictations')}
          className="mt-2 flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-white/55 transition hover:bg-white/7 hover:text-white"
        >
          <LayoutGrid className="size-[18px]" />
          All dictations
        </button>
        <div className="mt-auto rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <Crown className="size-5 text-[#e9f784]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">
              Free plan
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold">1,428 of 2,000 words</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[71%] rounded-full bg-[#e9f784]" />
          </div>
          <Link
            href="/pricing"
            className="mt-4 flex h-9 items-center justify-center rounded-lg bg-white/8 text-xs font-bold transition hover:bg-white/12"
          >
            Upgrade to Pro
          </Link>
        </div>
        <button
          onClick={() => setShowAccount(!showAccount)}
          className="mt-3 flex items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-white/5"
        >
          <span className="grid size-9 place-items-center rounded-full bg-[#efd6ff] font-bold text-[#1d211d]">
            {user?.email?.[0]?.toUpperCase() || 'G'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold">
              {user?.email || 'Guest mode'}
            </span>
            <span className="block text-[10px] text-white/35">
              Account settings
            </span>
          </span>
          <ChevronDown className="size-4 text-white/35" />
        </button>
        {showAccount && (
          <div className="absolute bottom-17 left-4 right-4 rounded-xl border border-white/10 bg-[#292e28] p-2 shadow-xl">
            <Link
              href="/auth"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/8"
            >
              <UserRound className="size-4" />
              Account
            </Link>
            {user && (
              <button
                onClick={() => void signOut()}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-white/8"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            )}
          </div>
        )}
      </aside>

      <div className="min-w-0 flex-1 lg:ml-[244px]">
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-[#1d211d]/8 bg-[#f5f3ed]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="lg:hidden">
            <Brand compact />
          </div>
          <div className="hidden items-center gap-2 text-sm text-[#737972] lg:flex">
            <span>Workspace</span>
            <span>/</span>
            <strong className="text-[#1d211d]">{activeNav}</strong>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8b9089]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-52 rounded-xl border border-[#1d211d]/10 bg-white/70 pl-9 pr-3 text-sm outline-none focus:border-[#a6b43e]"
                placeholder="Search dictations"
              />
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="grid size-10 place-items-center rounded-xl border border-[#1d211d]/10 bg-white/70 transition hover:border-[#9dab32] hover:bg-white"
              aria-label="Open settings"
            >
              <Settings className="size-[18px]" />
            </button>
            {!loading && !user && (
              <Link
                className="flex h-10 items-center rounded-xl bg-[#1d211d] px-4 text-sm font-semibold text-white"
                href="/auth"
              >
                Sign in
              </Link>
            )}
          </div>
        </header>

        <nav
          className="flex gap-2 overflow-x-auto border-b border-[#1d211d]/8 bg-[#f5f3ed] px-5 py-3 lg:hidden"
          aria-label="App sections"
        >
          {['Home', 'History', 'Dictionary', 'Shortcuts'].map((label) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${activeNav === label ? 'bg-[#1d211d] text-white' : 'bg-white text-[#697068]'}`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="mx-auto max-w-[1320px] p-5 sm:p-8">
          {activeNav === 'History' || activeNav === 'All dictations' ? (
            <HistoryView
              transcripts={filtered}
              search={search}
              onSearch={setSearch}
              onCopy={(value) => void copyResult(value)}
              onDelete={(item) => void deleteTranscript(item)}
              onClear={() => void clearHistory()}
            />
          ) : activeNav === 'Dictionary' ? (
            <DictionaryView
              words={dictionary}
              newWord={newWord}
              onNewWord={setNewWord}
              onAdd={() => void addDictionaryWord()}
              onRemove={(word) => void removeDictionaryWord(word)}
            />
          ) : activeNav === 'Shortcuts' ? (
            <ShortcutsView
              hotkey={hotkey}
              desktop={false}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          ) : (
            <>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p
                    suppressHydrationWarning
                    className="text-sm font-semibold text-[#858b83]"
                  >
                    {new Date().toLocaleDateString('en', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <h1 className="mt-1 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">
                    {user
                      ? `Ready when you are${user.email ? `, ${user.email.split('@')[0]}` : ''}.`
                      : 'Ready when you are.'}
                  </h1>
                </div>
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1d211d]/10 bg-white px-3 py-2 text-xs font-semibold text-[#6f756e] transition hover:border-[#a6b43e]"
                >
                  <Keyboard className="size-3.5" />{' '}
                  <kbd className="rounded bg-[#eeeae1] px-1.5 py-0.5 font-mono text-[10px]">
                    {hotkey.label}
                  </kbd>{' '}
                  in this tab
                </button>
              </div>

              <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
                <div className="min-w-0 space-y-6">
                  <section
                    className={`relative overflow-hidden rounded-[28px] border p-6 transition-colors sm:p-9 ${recording ? 'border-[#a9ba39] bg-[#f3f8d9]' : 'border-[#1d211d]/10 bg-white'}`}
                  >
                    <div className="absolute -right-24 -top-28 size-72 rounded-full bg-[#e9f784]/35 blur-3xl" />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[.13em] text-[#879524]">
                          Dictation studio
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-.04em]">
                          {recording
                            ? 'Listening closely…'
                            : processing
                              ? 'Turning speech into text…'
                              : 'What’s on your mind?'}
                        </h2>
                      </div>
                      <div className="flex gap-2">
                        <label className="flex h-9 items-center gap-2 rounded-lg border border-[#1d211d]/10 bg-white/75 px-3 text-xs font-semibold">
                          <Languages className="size-3.5" />
                          <select
                            aria-label="Language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent outline-none"
                          >
                            <option value="auto">Auto detect</option>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="ja">Japanese</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="relative flex min-h-[250px] flex-col items-center justify-center">
                      {processing ? (
                        <>
                          <span className="grid size-20 place-items-center rounded-full bg-[#1d211d] text-[#e9f784]">
                            <LoaderCircle className="size-8 animate-spin" />
                          </span>
                          <p className="mt-5 text-sm font-semibold text-[#6f756e]">
                            Saygo S1 is polishing your words
                          </p>
                        </>
                      ) : (
                        <>
                          <div
                            className="flex h-16 items-center justify-center gap-[5px]"
                            aria-hidden="true"
                          >
                            {wave.map((h, i) => (
                              <span
                                key={`${h}-${i}`}
                                className={`w-1 rounded-full ${recording ? 'wave-bar bg-[#1d211d]' : 'bg-[#d4d6cf]'}`}
                                style={{
                                  height: recording ? h : Math.max(8, h * 0.36),
                                  animationDelay: `${i * 45}ms`,
                                }}
                              />
                            ))}
                          </div>
                          <button
                            onClick={() =>
                              recording
                                ? stopRecording()
                                : void startRecording()
                            }
                            className={`mt-5 grid size-20 place-items-center rounded-full transition-all ${recording ? 'recording-glow bg-[#1d211d] text-[#e9f784]' : 'bg-[#e9f784] text-[#1d211d] shadow-[0_15px_35px_rgba(164,178,55,.28)] hover:scale-105'}`}
                            aria-label={
                              recording ? 'Stop recording' : 'Start recording'
                            }
                          >
                            {recording ? (
                              <span className="size-6 rounded-md bg-[#e9f784]" />
                            ) : (
                              <Mic className="size-8" fill="currentColor" />
                            )}
                          </button>
                          <p className="mt-4 font-mono text-sm font-bold">
                            {recording
                              ? formatTime(elapsed)
                              : 'Tap to start speaking'}
                          </p>
                          {!recording && (
                            <button
                              onClick={() => fileInput.current?.click()}
                              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#777d75] underline underline-offset-4"
                            >
                              <Upload className="size-3.5" />
                              or transcribe a meeting recording
                            </button>
                          )}
                          <input
                            ref={fileInput}
                            className="hidden"
                            type="file"
                            accept="audio/*,.mp3,.mp4,.wav,.webm,.flac,.ogg,.m4a"
                            onChange={upload}
                          />
                        </>
                      )}
                    </div>
                    <div className="relative flex flex-wrap items-center justify-center gap-3 text-[11px] font-medium text-[#858b83]">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="size-3" /> Filler words removed
                      </span>
                      <span className="size-1 rounded-full bg-[#bdc0b9]" />
                      <span className="flex items-center gap-1.5">
                        <WandSparkles className="size-3" /> Grammar polished
                      </span>
                      <span className="size-1 rounded-full bg-[#bdc0b9]" />
                      <span>99+ languages</span>
                    </div>
                  </section>

                  {error && (
                    <div
                      role="alert"
                      className="flex items-start justify-between gap-4 rounded-2xl border border-[#e7b8b2] bg-[#fff0ee] p-4 text-sm text-[#8c3831]"
                    >
                      <p>
                        {error}{' '}
                        {!user && (
                          <Link href="/auth" className="font-bold underline">
                            Sign in
                          </Link>
                        )}
                      </p>
                      <button
                        onClick={() => setError('')}
                        aria-label="Dismiss error"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}

                  {result && (
                    <section className="rounded-[24px] border border-[#aeba55] bg-white p-6 shadow-[0_14px_45px_rgba(60,67,41,.08)]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#7f8b25]">
                          <span className="grid size-7 place-items-center rounded-lg bg-[#eff5c6]">
                            <Check className="size-4" />
                          </span>{' '}
                          Transcription ready
                        </div>
                        <button
                          onClick={() => setResult('')}
                          className="text-[#8b9089]"
                          aria-label="Close result"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <textarea
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                        className="mt-5 min-h-32 w-full resize-y bg-transparent text-lg leading-8 outline-none"
                        aria-label="Transcription result"
                      />
                      <div className="mt-4 flex items-center justify-between border-t border-[#1d211d]/8 pt-4">
                        <p className="text-xs text-[#878c85]">
                          {result.split(/\s+/).filter(Boolean).length} words ·
                          saved to history
                        </p>
                        <button
                          onClick={() => void copyResult()}
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1d211d] px-3 text-xs font-bold text-white"
                        >
                          {copied ? (
                            <Check className="size-3.5" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                          {copied ? 'Copied' : 'Copy text'}
                        </button>
                      </div>
                    </section>
                  )}

                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold tracking-[-.035em]">
                          Recent dictations
                        </h2>
                        <p className="mt-1 text-xs text-[#858b83]">
                          Your latest thoughts, cleaned up and ready
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveNav('History')}
                        className="text-xs font-bold underline underline-offset-4"
                      >
                        View all
                      </button>
                    </div>
                    <div className="space-y-3">
                      {filtered.slice(0, 5).map((item) => (
                        <article
                          key={item.id}
                          className="group rounded-2xl border border-[#1d211d]/9 bg-white p-4 transition hover:border-[#aeba55] sm:p-5"
                        >
                          <div className="flex gap-4">
                            <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-[#f0eee8] text-[#687067]">
                              <AudioLines className="size-[18px]" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-sm leading-6 sm:text-[15px]">
                                {item.text}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[#898e87]">
                                <span>{relativeDate(item.created_at)}</span>
                                <span className="size-1 rounded-full bg-[#c8cbc4]" />
                                <span>{formatTime(item.duration_seconds)}</span>
                                <span className="size-1 rounded-full bg-[#c8cbc4]" />
                                <span>{item.language}</span>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-start gap-1 opacity-60 transition group-hover:opacity-100">
                              <button
                                onClick={() => void copyResult(item.text)}
                                className="grid size-8 place-items-center rounded-lg hover:bg-[#f1efe9]"
                                aria-label="Copy transcript"
                              >
                                <Copy className="size-3.5" />
                              </button>
                              <button
                                onClick={() => void deleteTranscript(item)}
                                className="grid size-8 place-items-center rounded-lg text-[#9a4f49] hover:bg-red-50"
                                aria-label="Delete transcript"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className="space-y-5">
                  <section className="rounded-[24px] border border-[#1d211d]/9 bg-[#1d211d] p-6 text-white">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[.12em] text-white/45">
                        This month
                      </p>
                      <Clock3 className="size-4 text-[#e9f784]" />
                    </div>
                    <p className="mt-5 text-4xl font-semibold tracking-[-.055em]">
                      {wordCount.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-white/45">words dictated</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/6 p-3">
                        <p className="text-lg font-bold">
                          {transcripts.length}
                        </p>
                        <p className="text-[10px] text-white/40">sessions</p>
                      </div>
                      <div className="rounded-xl bg-white/6 p-3">
                        <p className="text-lg font-bold">4.1×</p>
                        <p className="text-[10px] text-white/40">faster</p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-[#1d211d]/9 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">Personal dictionary</p>
                        <p className="mt-1 text-xs text-[#8a8f88]">
                          Names and terms to nail every time
                        </p>
                      </div>
                      <BookOpenText className="size-5 text-[#8d9c22]" />
                    </div>
                    <div className="mt-5 flex gap-2">
                      <input
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') void addDictionaryWord();
                        }}
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)}
                        placeholder="Add a word"
                        className="h-10 min-w-0 flex-1 rounded-lg border border-[#1d211d]/10 bg-[#f8f7f3] px-3 text-sm outline-none focus:border-[#a6b43e]"
                      />
                      <button
                        onClick={() => void addDictionaryWord()}
                        className="grid size-10 place-items-center rounded-lg bg-[#e9f784]"
                        aria-label="Add word"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {dictionary.slice(0, 8).map((word) => (
                        <span
                          key={word}
                          className="rounded-full bg-[#f0eee8] px-3 py-1.5 text-xs font-medium"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="overflow-hidden rounded-[24px] border border-[#1d211d]/9 bg-[#eedcff] p-5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#77677e]">
                      <FileAudio className="size-4" /> Smart tip
                    </div>
                    <p className="mt-4 text-lg font-semibold leading-6 tracking-[-.025em]">
                      Speak punctuation only when you want it.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#675d6c]">
                      Say “new paragraph” or “bullet point” and Saygo will
                      format it for you.
                    </p>
                  </section>
                </aside>
              </div>
            </>
          )}
        </div>
      </div>
      <SettingsDialog
        open={settingsOpen}
        desktop={false}
        hotkey={hotkey}
        language={language}
        onLanguageChange={updateLanguage}
        onHotkeyChange={updateHotkey}
        onClose={() => setSettingsOpen(false)}
      />
    </main>
  );
}
