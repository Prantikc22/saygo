import {
  ArrowLeft,
  Check,
  Download,
  Globe2,
  Keyboard,
  Share2,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import Link from 'next/link';
import { siApple } from 'simple-icons';
import { Brand } from '@/components/brand';

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
      <path d={siApple.path} />
    </svg>
  );
}

function WindowsMark() {
  return (
    <span className="grid size-6 grid-cols-2 gap-[2px]" aria-hidden="true">
      <span className="bg-[#f25022]" />
      <span className="bg-[#7fba00]" />
      <span className="bg-[#00a4ef]" />
      <span className="bg-[#ffb900]" />
    </span>
  );
}

const releases = [
  {
    name: 'Saygo for macOS',
    meta: 'Apple Silicon · macOS 11 or newer',
    note: 'DMG installer · 3.4 MB',
    href: '/downloads/Saygo-macOS-arm64.dmg',
    icon: AppleMark,
    available: true,
  },
  {
    name: 'Saygo for Windows',
    meta: '64-bit · Windows 10 or newer',
    note: 'Portable EXE · 11 MB',
    href: '/downloads/Saygo-Windows-x64.exe',
    icon: WindowsMark,
    available: true,
  },
];

export function DownloadPage() {
  return (
    <main className="grain min-h-screen overflow-hidden bg-[#fbf9f4] text-[#1d211d]">
      <nav className="relative z-10 mx-auto flex h-20 max-w-[1180px] items-center justify-between px-5 lg:px-8">
        <Link href="/" aria-label="Saygo home">
          <Brand />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold"
        >
          <ArrowLeft className="size-4" /> Back home
        </Link>
      </nav>

      <section className="relative mx-auto max-w-[1180px] px-5 pb-24 pt-14 lg:px-8 lg:pt-24">
        <div className="absolute -left-36 top-10 size-80 rounded-full bg-[#e9f784]/50 blur-3xl" />
        <div className="absolute -right-32 top-56 size-80 rounded-full bg-[#eedcff]/70 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1d211d]/12 bg-white/70 px-3.5 py-2 text-xs font-bold uppercase tracking-[.14em] backdrop-blur">
            <Download className="size-3.5" /> Desktop apps
          </div>
          <h1 className="mt-7 text-[clamp(3.4rem,8vw,6.5rem)] font-semibold leading-[.9] tracking-[-.07em]">
            Dictate in
            <br />
            <span className="italic">every app.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#626961]">
            Install Saygo for a real global shortcut, compact voice overlay, and
            automatic text insertion wherever your cursor is.
          </p>
        </div>

        <div className="relative mx-auto mt-14 grid max-w-[940px] gap-5 md:grid-cols-2">
          {releases.map(({ name, meta, note, href, icon: Icon, available }) => (
            <article
              key={name}
              className={`rounded-[28px] border p-7 shadow-[0_20px_60px_rgba(34,39,33,.08)] ${available ? 'border-[#aeba55] bg-white' : 'border-[#1d211d]/10 bg-white/65'}`}
            >
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-[#1d211d] text-[#e9f784]">
                  <Icon />
                </span>
                {available ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5ba] px-3 py-1.5 text-xs font-bold text-[#5f690d]">
                    <Check className="size-3.5" /> Ready
                  </span>
                ) : (
                  <span className="rounded-full bg-[#eeeae2] px-3 py-1.5 text-xs font-bold text-[#747970]">
                    Building now
                  </span>
                )}
              </div>
              <h2 className="mt-9 text-2xl font-semibold tracking-[-.04em]">
                {name}
              </h2>
              <p className="mt-2 text-sm text-[#6f756e]">{meta}</p>
              <p className="mt-1 text-xs text-[#979b95]">{note}</p>
              {available ? (
                <a
                  download
                  className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#1d211d] font-bold text-white transition-transform hover:-translate-y-0.5"
                  href={href}
                >
                  <Download className="size-4" /> Download{' '}
                  {name.includes('macOS') ? 'installer' : 'app'}
                </a>
              ) : (
                <span className="mt-7 flex h-13 w-full items-center justify-center rounded-xl bg-[#e7e5df] font-bold text-[#898e87]">
                  Windows build in progress
                </span>
              )}
            </article>
          ))}
        </div>

        <section className="relative mx-auto mt-8 max-w-[940px] overflow-hidden rounded-[28px] border border-[#1d211d]/10 bg-[#eedcff] p-6 sm:p-8">
          <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-center">
            <div>
              <span className="grid size-13 place-items-center rounded-2xl bg-[#1d211d] text-white">
                <Smartphone className="size-6" />
              </span>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-.045em]">
                Use it on iPhone—without the App Store.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#675d6c]">
                Saygo is installable as a Home Screen web app. Recording,
                transcription, history, and dictionary work in the standalone
                experience.
              </p>
              <Link
                href="/app?source=ios-install"
                className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-[#1d211d] px-5 text-sm font-bold text-white"
              >
                Open iPhone web app <ArrowLeft className="size-4 rotate-180" />
              </Link>
            </div>
            <ol className="space-y-3">
              {[
                ['1', 'Open this page in Safari'],
                ['2', 'Tap the Share button'],
                ['3', 'Choose “Add to Home Screen”'],
                ['4', 'Turn on “Open as Web App,” then tap Add'],
              ].map(([number, instruction]) => (
                <li
                  key={number}
                  className="flex items-center gap-4 rounded-2xl bg-white/55 p-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white font-mono text-sm font-bold">
                    {number}
                  </span>
                  <span className="text-sm font-semibold">{instruction}</span>
                  {number === '2' && <Share2 className="ml-auto size-4" />}
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-6 border-t border-[#1d211d]/10 pt-5 text-xs leading-5 text-[#6f6574]">
            <strong>iPhone limitation:</strong> iOS web apps cannot register a
            system-wide hotkey or paste into other apps. The Home Screen app
            handles dictation and copying; true keyboard-wide insertion would
            require an iOS keyboard extension distributed as a signed native
            app.
          </p>
        </section>

        <div className="relative mx-auto mt-8 grid max-w-[940px] gap-4 rounded-[24px] border border-[#1d211d]/10 bg-[#1d211d] p-6 text-white sm:grid-cols-3 sm:p-8">
          <div className="flex gap-3">
            <Keyboard className="mt-0.5 size-5 shrink-0 text-[#e9f784]" />
            <div>
              <p className="font-semibold">Your own hotkey</p>
              <p className="mt-1 text-sm leading-6 text-white/50">
                Record any supported shortcut in Settings.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Globe2 className="mt-0.5 size-5 shrink-0 text-[#e9f784]" />
            <div>
              <p className="font-semibold">Web app included</p>
              <p className="mt-1 text-sm leading-6 text-white/50">
                Use the same app without installing anything.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#e9f784]" />
            <div>
              <p className="font-semibold">Private by design</p>
              <p className="mt-1 text-sm leading-6 text-white/50">
                Audio is discarded after transcription.
              </p>
            </div>
          </div>
        </div>

        <p className="relative mx-auto mt-7 max-w-[940px] text-center text-xs leading-5 text-[#898e87]">
          These preview builds are not yet code-signed. macOS or Windows may
          show an unverified developer warning while the signing certificates
          are being prepared.
        </p>
      </section>
    </main>
  );
}
