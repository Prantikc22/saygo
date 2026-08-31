'use client';

import { ArrowLeft, ArrowRight, Check, LoaderCircle, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { Brand } from '@/components/brand';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const { user, loading, configured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'magic'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) window.location.href = '/app';
  }, [loading, user]);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (!configured) throw new Error('Supabase environment variables are not configured.');
      if (mode === 'magic') {
        const { error: authError } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (authError) throw authError;
        setMessage('Magic link sent. Check your inbox to continue.');
      } else if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (authError) throw authError;
        if (data.session) window.location.href = '/app';
        else setMessage('Account created. Check your inbox to confirm your email.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        window.location.href = '/app';
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#fbf9f4] lg:grid-cols-[1fr_1.02fr]">
      <section className="relative hidden overflow-hidden bg-[#1d211d] p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -left-40 top-40 size-96 rounded-full bg-[#e9f784]/15 blur-3xl" />
        <div className="absolute -bottom-48 right-0 size-[450px] rounded-full bg-[#eedcff]/15 blur-3xl" />
        <Link href="/" className="relative z-10"><Brand inverse /></Link>
        <div className="relative z-10 my-auto max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[.14em] text-[#e9f784]"><Sparkles className="size-3.5" /> Your voice, upgraded</div>
          <h1 className="mt-7 text-6xl font-semibold leading-[.96] tracking-[-.06em]">Say more.<br />Type less.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/55">Join people reclaiming hours every week with natural, intelligent dictation.</p>
          <div className="mt-10 space-y-4 text-sm text-white/75">
            {['Works in every app', 'Polishes speech automatically', 'Private and secure by design'].map(item => <div className="flex items-center gap-3" key={item}><span className="grid size-6 place-items-center rounded-full bg-[#e9f784] text-[#1d211d]"><Check className="size-3.5" /></span>{item}</div>)}
          </div>
        </div>
        <p className="relative z-10 text-sm text-white/35">“It genuinely feels like thinking out loud.”</p>
      </section>

      <section className="flex min-h-screen flex-col p-5 sm:p-10 lg:p-14">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="lg:hidden"><Brand compact /></Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#697068]"><ArrowLeft className="size-4" /> Back home</Link>
        </div>
        <div className="m-auto w-full max-w-[430px] py-12">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-[#879524]">Welcome to OpenWhispr</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-.055em]">{mode === 'signup' ? 'Create your account' : mode === 'magic' ? 'Sign in without a password' : 'Welcome back'}</h2>
          <p className="mt-3 text-[#747a73]">{mode === 'signup' ? 'Start with 2,000 free words. No card needed.' : 'Your flow is waiting for you.'}</p>

          <form className="mt-9 space-y-5" onSubmit={submit}>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Email address</span><input className="h-13 w-full rounded-xl border border-[#1d211d]/15 bg-white px-4 outline-none transition focus:border-[#85921f] focus:ring-4 focus:ring-[#e9f784]/35" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
            {mode !== 'magic' && <label className="block"><span className="mb-2 block text-sm font-semibold">Password</span><input className="h-13 w-full rounded-xl border border-[#1d211d]/15 bg-white px-4 outline-none transition focus:border-[#85921f] focus:ring-4 focus:ring-[#e9f784]/35" type="password" minLength={6} required autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" /></label>}
            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {message && <output className="block rounded-xl border border-[#bfcd67] bg-[#f4f8d8] px-4 py-3 text-sm text-[#586211]">{message}</output>}
            <button disabled={busy} className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#1d211d] font-semibold text-white transition hover:bg-[#30362f] disabled:opacity-60" type="submit">
              {busy ? <LoaderCircle className="size-5 animate-spin" /> : mode === 'magic' ? <Mail className="size-4" /> : null}
              {mode === 'signup' ? 'Create free account' : mode === 'magic' ? 'Send magic link' : 'Sign in'}
              {!busy && <ArrowRight className="size-4" />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-[#9a9f98]"><span className="h-px flex-1 bg-[#1d211d]/10" /> or <span className="h-px flex-1 bg-[#1d211d]/10" /></div>
          <button onClick={() => { setMode(mode === 'magic' ? 'signin' : 'magic'); setError(''); setMessage(''); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#1d211d]/15 bg-white text-sm font-semibold transition hover:bg-[#f6f4ee]" type="button"><Mail className="size-4" /> {mode === 'magic' ? 'Use email and password' : 'Continue with a magic link'}</button>
          <p className="mt-7 text-center text-sm text-[#747a73]">{mode === 'signup' ? 'Already have an account?' : 'New to OpenWhispr?'} <button className="font-bold text-[#1d211d] underline decoration-[#b4c24e] decoration-2 underline-offset-4" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); setMessage(''); }} type="button">{mode === 'signup' ? 'Sign in' : 'Create an account'}</button></p>
        </div>
        <p className="text-center text-xs leading-5 text-[#92978f]">By continuing, you agree to our Terms and Privacy Policy.</p>
      </section>
    </main>
  );
}
