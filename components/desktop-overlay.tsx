'use client';

import {
  LoaderCircle,
  LogIn,
  Mic,
  Settings,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useEffect, useState, type PointerEvent } from 'react';
import type { User } from '@supabase/supabase-js';
import { openDesktopSignIn } from '@/lib/desktop-auth';
import type { HotkeySetting } from '@/lib/hotkey';

const overlayWave = [18, 34, 24, 48, 30, 58, 37, 52, 27, 44, 21, 38, 25];
const DESKTOP_POSITION_KEY = 'saygo-desktop-position';

type OverlayMode = 'compact' | 'signed-out' | 'attention' | 'settings';

let overlayResizeRequest = 0;

async function currentDesktopWindow() {
  const [
    { getCurrentWindow, currentMonitor },
    { LogicalPosition, LogicalSize, PhysicalPosition },
  ] = await Promise.all([
    import('@tauri-apps/api/window'),
    import('@tauri-apps/api/dpi'),
  ]);
  return {
    appWindow: getCurrentWindow(),
    LogicalPosition,
    LogicalSize,
    PhysicalPosition,
    monitor: await currentMonitor(),
  };
}

export async function showDesktopOverlay(mode: OverlayMode = 'compact') {
  const request = ++overlayResizeRequest;
  const { appWindow, LogicalPosition, LogicalSize, PhysicalPosition, monitor } =
    await currentDesktopWindow();
  if (request !== overlayResizeRequest) return;
  const expanded = mode === 'settings';
  const requestedWidth = expanded
    ? 620
    : mode === 'attention'
      ? 440
      : mode === 'signed-out'
        ? 392
        : 296;
  const requestedHeight = expanded
    ? 720
    : mode === 'attention'
      ? 176
      : mode === 'signed-out'
        ? 146
        : 80;
  const scale = monitor?.scaleFactor || 1;
  const logicalWidth = monitor ? monitor.size.width / scale : requestedWidth;
  const logicalHeight = monitor ? monitor.size.height / scale : requestedHeight;
  const width = expanded
    ? Math.min(requestedWidth, Math.max(320, logicalWidth - 32))
    : requestedWidth;
  const height = expanded
    ? Math.min(requestedHeight, Math.max(420, logicalHeight - 32))
    : requestedHeight;
  await appWindow.setSize(new LogicalSize(width, height));
  if (request !== overlayResizeRequest) return;

  const savedPosition = window.localStorage.getItem(DESKTOP_POSITION_KEY);
  if (!expanded && savedPosition) {
    try {
      const saved = JSON.parse(savedPosition) as { x: number; y: number };
      if (Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
        await appWindow.setPosition(new PhysicalPosition(saved.x, saved.y));
      }
    } catch {
      window.localStorage.removeItem(DESKTOP_POSITION_KEY);
    }
  } else if (monitor) {
    const logicalX = monitor.position.x / scale;
    const logicalY = monitor.position.y / scale;
    await appWindow.setPosition(
      new LogicalPosition(
        expanded
          ? logicalX + (logicalWidth - width) / 2
          : logicalX + logicalWidth - width - 24,
        expanded
          ? logicalY + (logicalHeight - height) / 2
          : logicalY + logicalHeight - height - 34,
      ),
    );
  }
  if (request !== overlayResizeRequest) return;
  await appWindow.show();
  if (expanded) await appWindow.setFocus();
}

export async function hideDesktopOverlay() {
  const { appWindow } = await currentDesktopWindow();
  await appWindow.hide();
}

export function DesktopOverlay({
  user,
  loading,
  recording,
  processing,
  elapsed,
  error,
  hotkey,
  settingsOpen,
  onToggle,
  onSettings,
  onOpenMicrophoneSettings,
  onOpenAccessibilitySettings,
}: {
  user: User | null;
  loading: boolean;
  recording: boolean;
  processing: boolean;
  elapsed: number;
  error: string;
  hotkey: HotkeySetting;
  settingsOpen: boolean;
  onToggle: () => void;
  onSettings: () => void;
  onOpenMicrophoneSettings: () => void;
  onOpenAccessibilitySettings: () => void;
}) {
  const [browserOpened, setBrowserOpened] = useState(false);
  const [signInError, setSignInError] = useState('');

  async function startDragging() {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    await getCurrentWindow().startDragging();
  }

  function startSurfaceDrag(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (
      target.closest(
        'button, a, input, textarea, select, [role="button"], [data-no-drag]',
      )
    )
      return;
    void startDragging();
  }

  useEffect(() => {
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, []);

  useEffect(() => {
    let unlistenClose: (() => void) | undefined;
    let unlistenMove: (() => void) | undefined;
    void import('@tauri-apps/api/window').then(async ({ getCurrentWindow }) => {
      const appWindow = getCurrentWindow();
      unlistenClose = await appWindow.onCloseRequested(async (event) => {
        event.preventDefault();
        await hideDesktopOverlay();
      });
      unlistenMove = await appWindow.onMoved(({ payload }) => {
        window.localStorage.setItem(
          DESKTOP_POSITION_KEY,
          JSON.stringify({ x: payload.x, y: payload.y }),
        );
      });
    });
    return () => {
      unlistenClose?.();
      unlistenMove?.();
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    void showDesktopOverlay(
      settingsOpen
        ? 'settings'
        : user
          ? error
            ? 'attention'
            : 'compact'
          : 'signed-out',
    );
  }, [error, loading, settingsOpen, user]);

  async function signIn() {
    setSignInError('');
    try {
      await openDesktopSignIn();
      setBrowserOpened(true);
    } catch (caught) {
      setSignInError(
        caught instanceof Error
          ? caught.message
          : 'Could not open your browser. Please install the latest Saygo build.',
      );
    }
  }

  const seconds = Math.floor(elapsed % 60)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, '0');

  const needsAttention = Boolean(user && error);
  const compact = Boolean(user && !loading && !needsAttention);

  return (
    <main
      className={`flex h-screen w-screen items-center overflow-hidden bg-transparent text-[#1d211d] ${compact ? 'p-1' : 'p-2'}`}
    >
      <section
        data-tauri-drag-region
        onPointerDown={startSurfaceDrag}
        className={`flex h-full w-full cursor-grab select-none items-center border border-white/70 bg-[#fbfaf6]/96 shadow-[0_18px_60px_rgba(18,22,18,.28)] backdrop-blur-2xl active:cursor-grabbing ${compact ? 'gap-2 rounded-[18px] px-2.5' : 'gap-3.5 rounded-[22px] px-4'}`}
      >
        <button
          onClick={onToggle}
          disabled={processing || loading}
          className={`grid shrink-0 place-items-center transition ${compact ? 'size-10 rounded-[14px]' : 'size-12 rounded-2xl'} ${recording ? 'recording-glow bg-[#1d211d] text-[#e9f784]' : 'bg-[#e9f784] text-[#1d211d]'}`}
          aria-label={recording ? 'Stop dictation' : 'Start dictation'}
        >
          {processing ? (
            <LoaderCircle className="size-6 animate-spin" />
          ) : recording ? (
            <span className="size-4 rounded bg-[#e9f784]" />
          ) : (
            <Mic className="size-5" fill="currentColor" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          {!user && !loading ? (
            <>
              <p className="font-semibold">
                {browserOpened
                  ? 'Finish signing in in your browser'
                  : 'Sign in to start dictating'}
              </p>
              <button
                onClick={() => void signIn()}
                className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-[#6f7c0f]"
              >
                <LogIn className="size-3.5" />{' '}
                {browserOpened ? 'Open browser again' : 'Continue in browser'}
              </button>
              {signInError && (
                <p className="mt-1 max-w-[245px] text-[10px] leading-4 text-[#9a3f38]">
                  {signInError}
                </p>
              )}
            </>
          ) : (
            <>
              <div
                className={`flex items-center ${compact ? 'h-6 gap-[3px]' : 'h-10 gap-[4px]'}`}
                aria-hidden="true"
              >
                {overlayWave.slice(0, compact ? 7 : 13).map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className={`${compact ? 'w-[2px]' : 'w-[3px]'} rounded-full ${recording ? 'wave-bar bg-[#1d211d]' : processing ? 'bg-[#a6b43e]' : 'bg-[#cdd0c7]'}`}
                    style={{
                      height: recording
                        ? compact
                          ? Math.max(8, height * 0.52)
                          : height
                        : Math.max(5, height * (compact ? 0.18 : 0.28)),
                      animationDelay: `${index * 45}ms`,
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <p
                  className={`${needsAttention ? 'text-xs leading-5' : 'truncate text-sm'} font-semibold`}
                >
                  {error ||
                    (processing
                      ? 'Polishing and pasting…'
                      : recording
                        ? 'Listening… press shortcut to stop'
                        : 'Ready in the background')}
                </p>
                {recording && (
                  <span className="font-mono text-xs font-bold text-[#737972]">
                    {minutes}:{seconds}
                  </span>
                )}
              </div>
              {needsAttention &&
                error.toLowerCase().includes('microphone access') && (
                  <button
                    onClick={onOpenMicrophoneSettings}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#1d211d] px-3 py-1.5 text-[11px] font-bold text-white"
                  >
                    <ShieldAlert className="size-3.5" /> Allow in System Settings
                  </button>
                )}
              {needsAttention &&
                error.toLowerCase().includes('accessibility access') && (
                  <button
                    onClick={onOpenAccessibilitySettings}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#1d211d] px-3 py-1.5 text-[11px] font-bold text-white"
                  >
                    <ShieldAlert className="size-3.5" /> Enable automatic paste
                  </button>
                )}
              {!compact && (
                <p className="mt-1 truncate text-[10px] text-[#8b9089]">
                  {hotkey.label} · stays active while Saygo is in the menu bar
                </p>
              )}
            </>
          )}
        </div>
        <div
          className={`flex shrink-0 items-center ${compact ? 'gap-0' : 'flex-col gap-1'}`}
        >
          {user && (
            <button
              onClick={() => {
                onSettings();
              }}
              className={`grid place-items-center rounded-lg hover:bg-[#efede7] ${compact ? 'size-7' : 'size-8'}`}
              aria-label="Open settings and account"
              title="Settings and account"
            >
              <Settings className="size-4" />
            </button>
          )}
          <button
            onClick={() => void hideDesktopOverlay()}
            className={`grid place-items-center rounded-lg hover:bg-[#efede7] ${compact ? 'size-7' : 'size-8'}`}
            aria-label="Hide"
          >
            <X className="size-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
