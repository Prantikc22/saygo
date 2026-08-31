'use client';

import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isTauriDesktop, readDesktopCallback } from '@/lib/desktop-auth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !isTauriDesktop()) return;
    let disposed = false;
    let stopListening: (() => void) | undefined;

    async function acceptCallback(rawUrl: string) {
      const credentials = readDesktopCallback(rawUrl);
      if (!credentials || disposed) return;
      const { data, error } = await supabase.auth.setSession({
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken,
      });
      if (error || !data.session || disposed) return;
      setSession(data.session);
      const [{ getCurrentWindow }, { LogicalSize }] = await Promise.all([
        import('@tauri-apps/api/window'),
        import('@tauri-apps/api/dpi'),
      ]);
      const appWindow = getCurrentWindow();
      await appWindow.setSize(new LogicalSize(296, 80));
      await appWindow.show();
      await appWindow.setFocus();
    }

    void import('@tauri-apps/plugin-deep-link')
      .then(async ({ getCurrent, onOpenUrl }) => {
        // Subscribe first so a callback cannot land between the startup URL
        // read and listener registration.
        stopListening = await onOpenUrl((urls) => {
          for (const rawUrl of urls) void acceptCallback(rawUrl);
        });
        const current = await getCurrent();
        if (current) {
          for (const rawUrl of current) await acceptCallback(rawUrl);
        }
      })
      .catch((caught) => {
        console.error(
          'Could not start the desktop sign-in callback listener.',
          caught,
        );
      });

    return () => {
      disposed = true;
      stopListening?.();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      configured: isSupabaseConfigured,
      signOut: async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
