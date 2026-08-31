'use client';

import {
  ArrowRight,
  BookOpenText,
  Check,
  Command,
  Download,
  HardDriveDownload,
  Languages,
  LockKeyhole,
  Mic,
  MousePointer2,
  Radio,
  Sparkles,
  Upload,
  UsersRound,
  Video,
  WandSparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import {
  SiAmazon,
  SiApple,
  SiGmail,
  SiLinear,
  SiNotion,
  SiNvidia,
  SiOpenai,
  SiSlack,
  SiWhatsapp,
  SiX,
} from 'react-icons/si';
import { Brand } from '@/components/brand';
import { SpeedComparison } from '@/components/speed-comparison';

const bars = [
  18, 29, 44, 25, 55, 37, 66, 30, 50, 72, 38, 57, 31, 46, 25, 35, 20,
];

const workApps = [
  { name: 'Notion', icon: SiNotion, color: '#111111' },
  { name: 'Slack', icon: SiSlack, color: '#4a154b' },
  { name: 'Gmail', icon: SiGmail, color: '#ea4335' },
  { name: 'Linear', icon: SiLinear, color: '#5e6ad2' },
  { name: 'WhatsApp', icon: SiWhatsapp, color: '#25d366' },
  { name: 'ChatGPT', icon: SiOpenai, color: '#111111' },
];

const companyMarks = [
  { name: 'amazon', icon: SiAmazon },
  { name: 'Notion', icon: SiNotion },
  { name: 'NVIDIA', icon: SiNvidia },
  { name: 'PepsiCo', icon: null },
  { name: 'Apple', icon: SiApple },
];

const stories = [
  {
    name: 'Gabe | ガブ',
    handle: '@gabe__perez',
    copy: 'Loved the polished UI, strong performance, and offline local model for travel.',
  },
  {
    name: 'shai',
    handle: '@shaiunterslak',
    copy: 'Summed up the voice-first experience in two words: absolutely goated.',
  },
  {
    name: 'Keisuke',
    handle: '@_AlwaysAI',
    copy: 'Praised the open-source flexibility to choose local models or API processing.',
  },
  {
    name: 'DJ',
    handle: '@DuaneJRich',
    copy: 'Uses voice-to-text as a faster, higher-throughput interface for working with AI.',
  },
  {
    name: 'MV',
    handle: '@MaximVovshin',
    copy: 'Recommended an open-source voice workflow as a strong alternative to closed dictation tools.',
  },
  {
    name: 'Adrian Nutiu',
    handle: '@AdrianNutiu',
    copy: 'Found local Whisper Base nearly instant and preferred its transcription results.',
  },
  {
    name: 'Anagh',
    handle: '@heyanaghh',
    copy: 'Uses Whisper Turbo and says the voice workflow feels seamless.',
  },
  {
    name: '0xSero',
    handle: '@0xSero',
    copy: 'Paired it with local models and hardware, then preferred speaking over typing.',
  },
  {
    name: 'j3iiifn',
    handle: '@j3iiifn',
    copy: 'Liked how stumbles and mid-sentence rephrasing still became clean, polished text.',
  },
  {
    name: 'anna-sofia',
    handle: '@annasofialesiv',
    copy: 'Said the speech-to-text experience was completely changing how she writes.',
  },
  {
    name: 'Stammy',
    handle: '@Stammy',
    copy: 'Praised fast, context-aware dictation as an especially good fit for vibe coding.',
  },
  {
    name: 'Tom Blomfield',
    handle: '@t_blom',
    copy: 'After months of use, concluded that talking with a computer beats typing.',
  },
  {
    name: 'Grzegorz Kossakowski',
    handle: '@gkossakowski',
    copy: 'Highlighted feeding richer context to an LLM three to four times faster by voice.',
  },
  {
    name: 'Product Hunt',
    handle: '@ProductHunt',
    copy: 'Shared that a full week of forum comments had been written by voice.',
  },
  {
    name: 'John Lindquist',
    handle: '@johnlindquist',
    copy: 'Switched his default dictation workflow after enjoying the real-time experience.',
  },
];

function Waveform({
  active = false,
  dark = false,
}: {
  active?: boolean;
  dark?: boolean;
}) {
  return (
    <div
      className="flex h-12 items-center justify-center gap-[4px]"
      aria-hidden="true"
    >
      {bars.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={`w-[3px] rounded-full ${dark ? 'bg-[#e9f784]' : 'bg-[#1d211d]'} ${active ? 'wave-bar' : 'opacity-70'}`}
          style={{ height, animationDelay: `${index * 55}ms` }}
        />
      ))}
    </div>
  );
}

type FeatureVisualKind =
  | 'transcribe'
  | 'instruct'
  | 'dictionary'
  | 'offline'
  | 'meeting'
  | 'self-host';

function FeatureVisual({ kind }: { kind: FeatureVisualKind }) {
  if (kind === 'transcribe') {
    return (
      <div className="relative h-full overflow-hidden rounded-[22px] bg-[#1d211d] p-5 text-white">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#e9f784] text-[#1d211d]">
            <Upload className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold">team-sync.m4a</p>
            <p className="mt-0.5 text-[10px] text-white/45">
              24:08 · transcribing
            </p>
          </div>
          <span className="ml-auto size-2 rounded-full bg-[#e9f784] feature-status-dot" />
        </div>
        <div
          className="mt-6 flex h-12 items-center gap-[4px]"
          aria-hidden="true"
        >
          {[14, 28, 19, 39, 23, 46, 31, 42, 20, 35, 17, 29, 13, 22, 16].map(
            (height, index) => (
              <span
                key={`${height}-${index}`}
                className="feature-wave-bar w-[3px] rounded-full bg-[#e9f784]"
                style={{ height, animationDelay: `${index * 70}ms` }}
              />
            ),
          )}
        </div>
        <div className="absolute inset-x-5 bottom-5 space-y-2">
          <span className="feature-transcript-line block h-2 w-full rounded-full bg-white/20" />
          <span className="feature-transcript-line block h-2 w-4/5 rounded-full bg-white/20 [animation-delay:220ms]" />
        </div>
      </div>
    );
  }

  if (kind === 'instruct') {
    return (
      <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-[22px] bg-[#edf3c2] p-5">
        <div className="feature-command-orb absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-[#1d211d] text-[#e9f784]">
          <Mic className="size-4" fill="currentColor" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#7c871f]">
          You said
        </p>
        <div className="mt-3 inline-flex w-fit items-center rounded-full border border-[#1d211d]/10 bg-white/70 px-3 py-2 text-xs font-semibold shadow-sm">
          “Turn this into bullets”
        </div>
        <div className="feature-format-result mt-5 space-y-2 text-xs text-[#3f463d]">
          {[
            'Ship the desktop widget',
            'Review the meeting notes',
            'Send the launch update',
          ].map((line) => (
            <p key={line} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#1d211d]" /> {line}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'dictionary') {
    return (
      <div className="relative h-full overflow-hidden rounded-[22px] bg-[#eee1f8] p-5">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#765886]">
          Personal dictionary
        </p>
        <div className="mt-4 rounded-xl border border-[#1d211d]/10 bg-white/75 p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="feature-dictionary-caret h-4 w-0.5 bg-[#1d211d]" />
            <span className="text-sm font-semibold">Qorvia</span>
            <span className="ml-auto rounded-full bg-[#e9f784] px-2 py-1 text-[9px] font-bold uppercase">
              Learned
            </span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['Aarav', 'SaaS', 'PepsiCo'].map((word, index) => (
            <span
              key={word}
              className="feature-word-chip rounded-full border border-[#1d211d]/10 bg-white/55 px-2.5 py-1.5 text-[10px] font-semibold"
              style={{ animationDelay: `${index * 180}ms` }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (kind === 'offline') {
    return (
      <div className="relative h-full overflow-hidden rounded-[22px] bg-[#e9eef7] p-5">
        <div className="flex items-center justify-between">
          <span className="grid size-10 place-items-center rounded-xl bg-white/75">
            <HardDriveDownload className="size-4" />
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#5e6c7d]">
            <span className="size-1.5 rounded-full bg-[#5f7c9b]" /> Local only
          </span>
        </div>
        <div className="mt-5 rounded-xl border border-[#1d211d]/10 bg-white/65 p-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Saygo Local · Small</span>
            <span className="text-[#6c7580]">466 MB</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#1d211d]/10">
            <span className="feature-download-progress block h-full rounded-full bg-[#1d211d]" />
          </div>
        </div>
        <p className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#65717f]">
          <span className="grid size-5 place-items-center rounded-full bg-white/70">
            ✓
          </span>
          Audio stays on this device
        </p>
      </div>
    );
  }

  if (kind === 'meeting') {
    return (
      <div className="relative h-full overflow-hidden rounded-[22px] bg-[#1d211d] p-5 text-white">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Product weekly</p>
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase text-[#e9f784]">
            <Radio className="size-3" /> Live
          </span>
        </div>
        <div className="mt-5 space-y-2.5">
          {[
            ['Maya', '#e9f784', 'We can ship this on Friday.'],
            ['Jon', '#eadcf4', 'I’ll send the final notes.'],
          ].map(([name, color, line], index) => (
            <div
              key={name}
              className="feature-speaker flex items-center gap-3 rounded-xl bg-white/[.07] p-2.5"
              style={{ animationDelay: `${index * 1.7}s` }}
            >
              <span
                className="grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-[#1d211d]"
                style={{ backgroundColor: color }}
              >
                {name[0]}
              </span>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                  {name}
                </p>
                <p className="truncate text-[11px] text-white/85">{line}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-[22px] bg-[#eef4d3] p-5">
      <div className="feature-host-path absolute left-1/2 top-[52px] h-[74px] w-px bg-[#1d211d]/15" />
      <div className="relative flex justify-center">
        <span className="feature-host-node grid h-11 min-w-20 place-items-center rounded-xl bg-[#1d211d] px-3 text-[10px] font-bold uppercase tracking-wider text-[#e9f784]">
          Saygo app
        </span>
      </div>
      <div className="relative mt-12 flex justify-between gap-3">
        {[
          ['API', 'Your server'],
          ['DB', 'Your data'],
        ].map(([label, copy], index) => (
          <div
            key={label}
            className="feature-host-node flex-1 rounded-xl border border-[#1d211d]/10 bg-white/65 p-3 text-center"
            style={{ animationDelay: `${index * 350}ms` }}
          >
            <p className="text-[10px] font-black">{label}</p>
            <p className="mt-1 text-[9px] text-[#697068]">{copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="overflow-hidden bg-[#fbf9f4] text-[#1d211d]">
      <section className="grain relative min-h-[96vh] border-b border-[#1d211d]/10">
        <div className="absolute -left-28 top-48 size-72 rounded-full bg-[#e9f784]/45 blur-3xl" />
        <div className="absolute -right-20 top-20 size-80 rounded-full bg-[#efd6ff]/50 blur-3xl" />

        <nav className="relative z-20 mx-auto flex h-20 max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <a href="#top" aria-label="Saygo home">
            <Brand />
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a className="transition-opacity hover:opacity-55" href="#features">
              Features
            </a>
            <a className="transition-opacity hover:opacity-55" href="#how">
              How it works
            </a>
            <a className="transition-opacity hover:opacity-55" href="#pricing">
              Pricing
            </a>
            <Link
              className="transition-opacity hover:opacity-55"
              href="/download"
            >
              Download
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              className="hidden px-3 py-2 text-sm font-semibold sm:block"
              href="/auth"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1d211d] px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              href="/app"
            >
              Try it free <ArrowRight className="size-4" />
            </Link>
          </div>
        </nav>

        <div
          id="top"
          className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-16 px-5 pb-24 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-32 lg:pt-20"
        >
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#1d211d]/15 bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[.14em] backdrop-blur">
              <span className="size-2 rounded-full bg-[#9cab31]" /> AI dictation
              for every app
            </div>
            <h1 className="max-w-[720px] text-[clamp(3.7rem,7.5vw,7.2rem)] font-semibold leading-[.88] tracking-[-.075em]">
              Your voice,
              <span className="relative block w-fit italic font-medium">
                beautifully written.
                <svg
                  className="absolute -bottom-4 left-0 w-full"
                  viewBox="0 0 520 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 12C128 2 318 2 516 8"
                    stroke="#b5c553"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-10 max-w-xl text-lg leading-8 text-[#565d56] sm:text-xl">
              Speak naturally. Saygo turns rough thoughts into polished writing
              and places it right where your cursor is.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#1d211d] px-7 font-semibold text-white shadow-[0_12px_30px_rgba(29,33,29,.18)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(29,33,29,.25)]"
                href="/download"
              >
                <Download className="size-5" /> Download the app
              </Link>
              <a
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[#1d211d]/15 bg-white/65 px-7 font-semibold transition-colors hover:bg-white"
                href="#how"
              >
                See how it works <ArrowRight className="size-4" />
              </a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#697068]">
              <span className="flex items-center gap-2">
                <Check className="size-4" /> No card required
              </span>
              <span className="flex items-center gap-2">
                <Check className="size-4" /> Mac, Windows & web
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">
            <div className="absolute -right-8 -top-8 hidden rotate-6 rounded-2xl bg-[#e9f784] px-4 py-3 text-sm font-bold shadow-lg sm:block">
              4× faster than typing ✦
            </div>
            <div className="relative rounded-[32px] border border-[#1d211d]/15 bg-[#efede6] p-3 shadow-[0_35px_80px_rgba(35,40,34,.18)]">
              <div className="overflow-hidden rounded-[24px] border border-[#1d211d]/10 bg-white">
                <div className="flex h-11 items-center gap-2 border-b border-[#1d211d]/10 bg-[#f7f6f2] px-4">
                  <span className="size-2.5 rounded-full bg-[#ff8276]" />
                  <span className="size-2.5 rounded-full bg-[#f6c85f]" />
                  <span className="size-2.5 rounded-full bg-[#72c67a]" />
                  <span className="mx-auto -translate-x-7 text-[11px] font-semibold text-[#8a8e87]">
                    Draft · Saygo
                  </span>
                </div>
                <div className="min-h-[420px] p-7 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[.13em] text-[#9a9e97]">
                    New message
                  </p>
                  <p className="mt-5 text-[25px] font-medium leading-[1.45] tracking-[-.03em]">
                    Hey team — quick update on the launch. We’re ahead of
                    schedule and the early feedback has been{' '}
                    <span className="rounded bg-[#e9f784] px-1">
                      really promising.
                    </span>
                  </p>
                  <p className="mt-4 text-[25px] font-medium leading-[1.45] tracking-[-.03em] text-[#8e928b]">
                    I’ll share the final numbers tomorrow...
                  </p>
                  <div className="mt-16 flex items-center justify-between rounded-2xl border border-[#1d211d]/10 bg-[#fbfaf7] px-4 py-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#6e746d]">
                      <Sparkles className="size-4 text-[#8f9e24]" /> Polished
                      automatically
                    </div>
                    <span className="text-xs text-[#959a93]">42 words</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute -bottom-10 left-1/2 flex w-[min(88%,420px)] -translate-x-1/2 items-center gap-4 rounded-[22px] bg-[#1d211d] p-3.5 pr-5 text-white shadow-[0_24px_50px_rgba(20,24,20,.35)]"
              style={{ animation: 'float 5s ease-in-out infinite' }}
            >
              <span className="recording-glow grid size-12 shrink-0 place-items-center rounded-xl bg-[#e9f784] text-[#1d211d]">
                <Mic className="size-5" fill="currentColor" />
              </span>
              <Waveform active dark />
              <span className="ml-auto font-mono text-xs text-white/55">
                00:08
              </span>
            </div>
          </div>
        </div>
      </section>

      <SpeedComparison />

      <section className="border-b border-[#1d211d]/10 bg-white py-8">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-6 px-5 text-sm text-[#7c817a] md:flex-row">
          <p className="font-semibold">Works where your work happens</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {workApps.map(({ name, icon: Icon, color }) => (
              <span
                key={name}
                className="flex items-center gap-2 text-sm font-bold text-[#4c524b]"
              >
                <Icon className="size-5" style={{ color }} aria-hidden="true" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="bg-[#1d211d] px-5 py-24 text-white sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="grid items-end gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.16em] text-[#e9f784]">
                Built for flow
              </p>
              <h2 className="mt-4 max-w-2xl text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-6xl">
                Say it once.
                <br />
                Get it right.
              </h2>
            </div>
            <p className="max-w-lg text-lg leading-8 text-white/55 md:justify-self-end">
              Saygo removes filler words, fixes grammar, and respects the names
              and phrases that matter to you.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article className="group min-h-[350px] rounded-[28px] bg-[#e9f784] p-7 text-[#1d211d] lg:col-span-2">
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#1d211d] text-[#e9f784]">
                  <WandSparkles className="size-5" />
                </span>
                <span className="rounded-full border border-[#1d211d]/20 px-3 py-1.5 text-xs font-bold">
                  AI polish
                </span>
              </div>
              <div className="mt-16 grid gap-7 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div className="rounded-2xl bg-white/45 p-5 text-lg leading-7 text-[#59602b]">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    You say
                  </span>
                  <p className="mt-2">
                    “um hey can we maybe move the meeting to like three?”
                  </p>
                </div>
                <ArrowRight className="hidden size-6 sm:block" />
                <div className="rounded-2xl bg-[#1d211d] p-5 text-lg leading-7 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e9f784]">
                    You write
                  </span>
                  <p className="mt-2">
                    “Could we move the meeting to 3:00 PM?”
                  </p>
                </div>
              </div>
            </article>

            <article className="min-h-[350px] rounded-[28px] border border-white/10 bg-[#292e28] p-7">
              <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-[#e9f784]">
                <Zap className="size-5" />
              </span>
              <p className="mt-14 text-5xl font-semibold tracking-[-.06em]">
                Saygo<span className="text-[#e9f784]"> S1</span>
              </p>
              <h3 className="mt-4 text-xl font-semibold">Voice Engine</h3>
              <p className="mt-2 leading-7 text-white/50">
                One tuned pipeline transcribes, fixes structure, and preserves
                the way you sound.
              </p>
            </article>

            <article className="min-h-[330px] rounded-[28px] border border-white/10 bg-[#292e28] p-7">
              <Languages className="size-9 text-[#e9f784]" />
              <div className="mt-12 flex flex-wrap gap-2">
                {[
                  'English',
                  'हिन्दी',
                  'Español',
                  '日本語',
                  'Français',
                  '+ 94',
                ].map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full bg-white/7 px-3 py-2 text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <h3 className="mt-7 text-xl font-semibold">
                Speak your language
              </h3>
              <p className="mt-2 leading-7 text-white/50">
                Automatic language detection across 99+ languages.
              </p>
            </article>

            <article className="min-h-[330px] overflow-hidden rounded-[28px] bg-[#eedcff] p-7 text-[#1d211d] lg:col-span-2">
              <div className="flex items-start justify-between">
                <LockKeyhole className="size-9" />
                <span className="rounded-full bg-white/55 px-3 py-1.5 text-xs font-bold">
                  Private by design
                </span>
              </div>
              <div className="mt-14 grid gap-6 sm:grid-cols-2 sm:items-end">
                <div>
                  <h3 className="text-3xl font-semibold tracking-[-.04em]">
                    Your words stay yours.
                  </h3>
                  <p className="mt-3 max-w-md leading-7 text-[#5f5866]">
                    Audio is processed for transcription, never sold, and never
                    used to train our models.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#1d211d]/10 bg-white/50 p-5 font-mono text-xs leading-7">
                  <p>audio.received</p>
                  <p>→ encrypted in transit</p>
                  <p>→ transcribed securely</p>
                  <p className="font-bold text-[#6b7a00]">
                    → audio discarded ✓
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="how" className="px-5 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-[#7d8a1f]">
              It’s that simple
            </p>
            <h2 className="mt-4 text-5xl font-semibold tracking-[-.06em] sm:text-6xl">
              From thought to text
              <br />
              in one breath.
            </h2>
          </div>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Command,
                n: '01',
                title: 'Press your shortcut',
                copy: 'Hit your global hotkey from any app. The recorder appears instantly.',
              },
              {
                icon: Mic,
                n: '02',
                title: 'Speak naturally',
                copy: 'Pause, ramble, or change your mind. Saygo cleans up the final result.',
              },
              {
                icon: MousePointer2,
                n: '03',
                title: 'Keep working',
                copy: 'Polished text lands exactly where your cursor is. No copy and paste.',
              },
            ].map(({ icon: Icon, n, title, copy }) => (
              <article
                key={n}
                className="rounded-[26px] border border-[#1d211d]/10 bg-white p-7 shadow-[0_16px_45px_rgba(34,39,33,.05)]"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#f0f6c9]">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-mono text-sm text-[#9da198]">{n}</span>
                </div>
                <h3 className="mt-10 text-2xl font-semibold tracking-[-.035em]">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-[#697068]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="transcription"
        className="border-t border-[#1d211d]/10 bg-[#f3f1ea] px-5 py-24 sm:py-32 lg:px-8"
      >
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.16em] text-[#7d8a1f]">
                Dictation and transcription
              </p>
              <h2 className="mt-4 text-5xl font-semibold leading-[.98] tracking-[-.06em] sm:text-6xl">
                Your voice layer for every kind of work.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#656c65] lg:justify-self-end">
              Dictate into any text box, transcribe recordings, teach Saygo the
              words you use, and give formatting instructions without touching
              the keyboard.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
            {[
              {
                icon: Upload,
                status: 'Available now',
                title: 'Transcribe recordings',
                copy: 'Drop in an audio file from a meeting, interview, voice memo, or lecture and turn it into editable text.',
                visual: 'transcribe' as const,
                layout: 'lg:col-span-5',
              },
              {
                icon: Command,
                status: 'Available now',
                title: 'Give instructions by voice',
                copy: 'Say “new paragraph” or “bullet point” while you dictate. Saygo follows the instruction instead of typing it literally.',
                visual: 'instruct' as const,
                layout: 'lg:col-span-3',
              },
              {
                icon: BookOpenText,
                status: 'Available now',
                title: 'It learns your words',
                copy: 'Add names, product terms, acronyms, and jargon once. Your personal dictionary guides every transcription.',
                visual: 'dictionary' as const,
                layout: 'lg:col-span-4',
              },
              {
                icon: HardDriveDownload,
                status: 'In development',
                title: 'Download an offline model',
                copy: 'Choose a local speech-to-text model for private, internet-free dictation with no audio leaving your device.',
                visual: 'offline' as const,
                layout: 'lg:col-span-4',
              },
              {
                icon: Video,
                status: 'Planned',
                title: 'Live meeting notes',
                copy: 'Auto-detect Zoom, Teams, and FaceTime; capture mic and system audio; then add live speaker labels and optional voice profiles.',
                visual: 'meeting' as const,
                layout: 'lg:col-span-5',
              },
              {
                icon: UsersRound,
                status: 'MIT licensed',
                title: 'Open and self-hostable',
                copy: 'Run the web app and database on your own infrastructure, inspect the code, and adapt the workflow to your team.',
                visual: 'self-host' as const,
                layout: 'lg:col-span-3',
              },
            ].map(({ icon: Icon, status, title, copy, visual, layout }) => (
              <article
                key={title}
                className={`group flex min-h-[420px] flex-col rounded-[28px] border border-[#1d211d]/10 bg-white p-3 shadow-[0_18px_55px_rgba(34,39,33,.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(34,39,33,.1)] ${layout}`}
              >
                <div className="h-[178px] shrink-0">
                  <FeatureVisual kind={visual} />
                </div>
                <div className="flex flex-1 flex-col p-4 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[#e9f784]">
                      <Icon className="size-5" />
                    </span>
                    <span className="rounded-full bg-[#f1f3df] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#68740d]">
                      {status}
                    </span>
                  </div>
                  <h3 className="mt-7 text-2xl font-semibold tracking-[-.035em]">
                    {title}
                  </h3>
                  <p className="mt-3 leading-7 text-[#697068]">{copy}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#858b84]">
            <Radio className="mt-0.5 size-3.5 shrink-0" /> Live meeting capture
            on macOS will require both microphone and system-audio recording
            permission; microphone access alone cannot hear other participants.
          </p>
        </div>
      </section>

      <section className="border-t border-[#1d211d]/10 bg-white px-5 py-24 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-[1120px]">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-[#7d8a1f]">
              Built for modern teams
            </p>
            <h2 className="mt-4 text-5xl font-semibold tracking-[-.055em] sm:text-6xl">
              From the first idea to the biggest stage.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#6e746d]">
              Saygo is designed for the pace and polish expected across the
              world’s most ambitious workplaces.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-7 border-y border-[#1d211d]/10 py-9 sm:gap-x-14">
            {companyMarks.map(({ name, icon: Icon }) => (
              <span
                key={name}
                className="flex items-center gap-2.5 text-xl font-bold tracking-[-.04em] text-[#4d534d] grayscale"
              >
                {Icon ? (
                  <Icon className="size-7" aria-hidden="true" />
                ) : (
                  <span className="font-black tracking-[-.07em]">PEPSICO</span>
                )}
                {Icon && name !== 'Apple' ? name : null}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-3 max-w-3xl text-center text-[11px] leading-5 text-[#92978f]">
            Company marks are shown for context only and do not imply an
            endorsement, partnership, or customer relationship with Saygo.
          </p>

          <div className="mx-auto mt-20 max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-[#7d8a1f]">
              The voice-first shift
            </p>
            <h2 className="mt-4 text-5xl font-semibold tracking-[-.055em] sm:text-6xl">
              People are done waiting on the keyboard.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#6e746d]">
              Fifteen public posts from the wider voice-dictation community,
              summarized from the originals. These are voices from the
              category—not fabricated Saygo endorsements.
            </p>
          </div>
          <div className="mt-12 columns-1 gap-5 md:columns-2 lg:columns-3">
            {stories.map(({ name, handle, copy }) => (
              <article
                key={handle}
                className="mb-5 break-inside-avoid rounded-[26px] border border-[#1d211d]/10 bg-[#fbf9f4] p-7 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-full bg-[#1d211d] font-bold text-[#e9f784]">
                    {name[0]}
                  </span>
                  <SiX className="size-4 text-[#1d211d]" aria-label="X post" />
                </div>
                <p className="mt-6 text-lg font-medium leading-7 tracking-[-.015em]">
                  {copy}
                </p>
                <p className="mt-7 text-sm font-semibold">
                  {name}
                  <span className="mt-0.5 block font-normal text-[#888d86]">
                    {handle}
                  </span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="px-5 pb-24 pt-20 sm:pb-32 sm:pt-28 lg:px-8"
      >
        <div className="mx-auto grid max-w-[1120px] items-center gap-8 rounded-[36px] bg-[#e9f784] p-7 sm:p-12 lg:grid-cols-[1fr_.9fr] lg:p-16">
          <div>
            <span className="rounded-full bg-[#1d211d] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#e9f784]">
              Simple pricing
            </span>
            <h2 className="mt-7 text-5xl font-semibold leading-[1] tracking-[-.06em] sm:text-6xl">
              Start free.
              <br />
              Flow further.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-[#535b30]">
              Start with the web and iPhone home-screen app, then upgrade when
              Saygo becomes the fastest part of your day. Annual plans include
              two months, and Business adds a shared team workspace.
            </p>
          </div>
          <div className="rounded-[26px] bg-[#1d211d] p-7 text-white shadow-2xl sm:p-9">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-bold text-[#e9f784]">SAYGO PRO</p>
                <p className="mt-2 text-5xl font-semibold tracking-[-.05em]">
                  $8
                  <span className="text-base font-normal text-white/50">
                    {' '}
                    / month
                  </span>
                </p>
              </div>
              <Sparkles className="size-7 text-[#e9f784]" />
            </div>
            <div className="my-7 h-px bg-white/10" />
            <ul className="space-y-3 text-sm text-white/75">
              {[
                'Unlimited dictation',
                '99+ languages',
                'Custom dictionary',
                'Desktop global shortcut',
                'Synced history',
              ].map((item) => (
                <li className="flex items-center gap-3" key={item}>
                  <Check className="size-4 text-[#e9f784]" /> {item}
                </li>
              ))}
            </ul>
            <Link
              className="mt-8 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#e9f784] font-bold text-[#1d211d] transition-transform hover:-translate-y-0.5"
              href="/pricing"
            >
              Choose Pro <ArrowRight className="size-4" />
            </Link>
            <p className="mt-3 text-center text-xs text-white/40">
              Paddle checkout · cancel anytime
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-5 pt-10 lg:px-8">
        <div className="grain relative mx-auto max-w-[1240px] overflow-hidden rounded-[38px] bg-[#1d211d] px-6 py-20 text-center text-white sm:px-12 sm:py-28">
          <div className="absolute -left-24 top-0 size-72 rounded-full bg-[#e9f784]/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 size-80 rounded-full bg-[#eedcff]/10 blur-3xl" />
          <div className="relative">
            <Waveform active dark />
            <h2 className="mx-auto mt-7 max-w-4xl text-5xl font-semibold leading-[.95] tracking-[-.065em] sm:text-7xl">
              Talk it out.
              <br />
              <span className="text-[#e9f784]">Saygo writes it down.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/55">
              Install the tiny desktop companion, choose your shortcut, and turn
              every text box into a place you can speak.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#e9f784] px-7 font-bold text-[#1d211d]"
                href="/download"
              >
                <Download className="size-5" /> Download Saygo
              </Link>
              <Link
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 font-bold text-white"
                href="/app"
              >
                Try it in the browser <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="overflow-hidden bg-[#fbf9f4] px-5 pb-0 pt-14 lg:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Brand />
          <div className="flex flex-wrap gap-6 text-sm text-[#686f67]">
            <a href="#features">Features</a>
            <Link href="/pricing">Pricing</Link>
            <Link href="/download">Download</Link>
            <Link href="/privacy">Privacy</Link>
            <a href="mailto:hello@saygo.app">Contact</a>
          </div>
          <p className="text-sm text-[#8e938c]">© 2026 Saygo</p>
        </div>
        <p className="mx-auto mt-7 max-w-[1180px] text-sm text-[#8e938c]">
          MIT licensed · open source · self-hostable
        </p>
        <div className="mx-auto mt-14 max-w-[1500px] select-none text-center text-[clamp(8rem,27vw,27rem)] font-semibold leading-[.67] tracking-[-.095em] text-[#1d211d]">
          saygo
        </div>
      </footer>
    </main>
  );
}
