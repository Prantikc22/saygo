'use client';

import {
  Check,
  Keyboard,
  LogOut,
  RotateCcw,
  Settings,
  UserRound,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  defaultHotkey,
  hotkeyFromEvent,
  type HotkeySetting,
} from '@/lib/hotkey';

type Props = {
  open: boolean;
  desktop: boolean;
  hotkey: HotkeySetting;
  language: string;
  onLanguageChange: (language: string) => void;
  onHotkeyChange: (hotkey: HotkeySetting) => void;
  accountEmail?: string;
  onSignOut?: () => Promise<void>;
  onClose: () => void;
};

export function SettingsDialog({
  open,
  desktop,
  hotkey,
  language,
  onLanguageChange,
  onHotkeyChange,
  accountEmail,
  onSignOut,
  onClose,
}: Props) {
  const [listening, setListening] = useState(false);
  const [captureError, setCaptureError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!listening || !open) return;
    const capture = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (
        [
          'MetaLeft',
          'MetaRight',
          'ControlLeft',
          'ControlRight',
          'AltLeft',
          'AltRight',
          'ShiftLeft',
          'ShiftRight',
        ].includes(event.code)
      )
        return;
      if (event.code === 'Escape') {
        setListening(false);
        setCaptureError('');
        return;
      }
      const next = hotkeyFromEvent(event);
      if (!next) {
        setCaptureError(
          'Use ⌘/Ctrl, Control, or Alt together with another key.',
        );
        return;
      }
      onHotkeyChange(next);
      setListening(false);
      setCaptureError('');
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1400);
    };
    window.addEventListener('keydown', capture, { capture: true });
    return () =>
      window.removeEventListener('keydown', capture, { capture: true });
  }, [listening, onHotkeyChange, open]);

  const close = () => {
    setListening(false);
    setCaptureError('');
    onClose();
  };

  if (!open) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-50 m-0 grid h-screen max-h-none w-screen max-w-none place-items-center bg-[#111510]/60 p-4 backdrop-blur-sm"
      aria-labelledby="settings-title"
    >
      <button
        className="absolute inset-0 cursor-default"
        onClick={close}
        aria-label="Close settings"
      />
      <section className="relative z-10 w-full max-w-[620px] overflow-hidden rounded-[28px] border border-[#1d211d]/10 bg-[#fbfaf6] text-[#1d211d] shadow-[0_35px_100px_rgba(20,24,20,.35)]">
        <header className="flex items-center justify-between border-b border-[#1d211d]/10 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[#e9f784]">
              <Settings className="size-5" />
            </span>
            <div>
              <h2
                id="settings-title"
                className="text-xl font-semibold tracking-[-.035em]"
              >
                Settings
              </h2>
              <p className="text-xs text-[#7f857d]">
                Changes save automatically on this device
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="grid size-9 place-items-center rounded-full bg-[#eeece6]"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="space-y-7 p-6 sm:p-8">
          <section>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#7e8b20]">
              <Keyboard className="size-4" /> Recording shortcut
            </div>
            <div className="mt-4 rounded-2xl border border-[#1d211d]/10 bg-white p-5">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold">Start or stop dictation</h3>
                  <p className="mt-1 text-sm leading-6 text-[#777d75]">
                    {desktop
                      ? 'Works globally while Saygo is running. You can hide the widget; the menu-bar app keeps the shortcut active.'
                      : 'Works while this browser tab is active.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setListening(true);
                    setCaptureError('');
                  }}
                  className={`flex min-h-12 min-w-44 items-center justify-center rounded-xl border px-4 font-mono text-sm font-bold transition ${listening ? 'border-[#91a019] bg-[#eff6bf] text-[#596200]' : 'border-[#1d211d]/15 bg-[#f7f5ef] hover:border-[#9aaa2b]'}`}
                >
                  {listening ? 'Press your shortcut…' : hotkey.label}
                </button>
              </div>
              {captureError && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {captureError}
                </p>
              )}
              <div className="mt-5 flex items-center justify-between border-t border-[#1d211d]/8 pt-4">
                <button
                  onClick={() => onHotkeyChange(defaultHotkey())}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#70766f]"
                >
                  <RotateCcw className="size-3.5" /> Restore default
                </button>
                {saved && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6f7c0f]">
                    <Check className="size-3.5" /> Shortcut saved
                  </span>
                )}
              </div>
            </div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-[.13em] text-[#7e8b20]">
              Dictation
            </p>
            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[#1d211d]/10 bg-white p-5">
              <span>
                <label
                  htmlFor="default-language"
                  className="block font-semibold"
                >
                  Default language
                </label>
                <span className="mt-1 block text-sm text-[#777d75]">
                  Used for new recordings
                </span>
              </span>
              <select
                id="default-language"
                value={language}
                onChange={(event) => onLanguageChange(event.target.value)}
                className="h-10 rounded-lg border border-[#1d211d]/12 bg-[#f7f5ef] px-3 text-sm font-semibold outline-none"
              >
                <option value="auto">Auto detect</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </section>

          {desktop && accountEmail && onSignOut && (
            <section>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#7e8b20]">
                <UserRound className="size-4" /> Account
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[#1d211d]/10 bg-white p-5">
                <span className="min-w-0">
                  <span className="block font-semibold">Signed in</span>
                  <span className="mt-1 block truncate text-sm text-[#777d75]">
                    {accountEmail}
                  </span>
                </span>
                <button
                  onClick={() => void onSignOut()}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#1d211d]/12 px-4 text-sm font-bold"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              </div>
            </section>
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-[#1d211d]/10 bg-white/55 px-6 py-4 sm:px-8">
          <p className="text-xs text-[#8a8f88]">
            Press Esc while recording a shortcut to cancel.
          </p>
          <button
            onClick={close}
            className="h-10 rounded-xl bg-[#1d211d] px-5 text-sm font-bold text-white"
          >
            Done
          </button>
        </footer>
      </section>
    </dialog>
  );
}
