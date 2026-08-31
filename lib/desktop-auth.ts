'use client';

import type { Session } from '@supabase/supabase-js';

const DESKTOP_AUTH_NONCE_KEY = 'saygo-desktop-auth-nonce';
const DESKTOP_CALLBACK = 'saygo://auth-callback';
const SAYGO_WEB_ORIGIN = 'https://saygo-ai-dictation.vercel.app';

export function isTauriDesktop() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export async function openDesktopSignIn() {
  const nonce = crypto.randomUUID();
  window.localStorage.setItem(DESKTOP_AUTH_NONCE_KEY, nonce);
  // Always use the public web origin. A Tauri WebView can report a custom
  // scheme origin, which must never be handed to the system browser.
  const signInUrl = new URL('/auth', SAYGO_WEB_ORIGIN);
  signInUrl.searchParams.set('desktop', '1');
  signInUrl.searchParams.set('nonce', nonce);
  const url = signInUrl.toString();

  // Use Tauri's supported system opener first. The Rust command remains as a
  // fallback for older desktop builds so existing installs can still sign in.
  try {
    const { openUrl } = await import('@tauri-apps/plugin-opener');
    await openUrl(url);
  } catch (openerError) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('open_auth_url', { url });
    } catch {
      window.localStorage.removeItem(DESKTOP_AUTH_NONCE_KEY);
      throw openerError;
    }
  }
}

export function returnSessionToDesktop(session: Session, nonce: string) {
  const callback = new URL(DESKTOP_CALLBACK);
  callback.hash = new URLSearchParams({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    nonce,
  }).toString();
  window.location.assign(callback.toString());
}

export function readDesktopCallback(rawUrl: string) {
  const callback = new URL(rawUrl);
  if (callback.protocol !== 'saygo:' || callback.hostname !== 'auth-callback') {
    return null;
  }
  const values = new URLSearchParams(callback.hash.replace(/^#/, ''));
  const accessToken = values.get('access_token');
  const refreshToken = values.get('refresh_token');
  const nonce = values.get('nonce');
  const expectedNonce = window.localStorage.getItem(DESKTOP_AUTH_NONCE_KEY);
  if (!accessToken || !refreshToken || !nonce || nonce !== expectedNonce) {
    return null;
  }
  window.localStorage.removeItem(DESKTOP_AUTH_NONCE_KEY);
  return { accessToken, refreshToken };
}
