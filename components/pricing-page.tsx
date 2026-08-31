'use client';

import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import { ArrowLeft, Check, Crown, LoaderCircle, ShieldCheck, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Brand } from '@/components/brand';
import { useAuth } from '@/components/auth-provider';

export function PricingPage() {
  const { user } = useAuth();
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [mockOpen, setMockOpen] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const priceId = process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID;

  useEffect(() => {
    if (!token) return;
    void initializePaddle({
      token,
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox') as 'sandbox' | 'production',
    }).then(instance => instance && setPaddle(instance));
  }, [token]);

  function checkout() {
    if (paddle && priceId) {
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        ...(user?.email ? { customer: { email: user.email } } : {}),
        settings: { variant: 'one-page', successUrl: `${window.location.origin}/app?upgraded=1` },
      });
    } else setMockOpen(true);
  }

  return (
    <main className="min-h-screen bg-[#fbf9f4] px-5 py-6 text-[#1d211d] lg:px-8">
      <nav className="mx-auto flex max-w-[1160px] items-center justify-between"><Link href="/"><Brand /></Link><Link href="/app" className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft className="size-4" /> Back to app</Link></nav>
      <section className="mx-auto max-w-[1020px] pb-20 pt-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eff5c6] px-4 py-2 text-xs font-bold uppercase tracking-[.13em]"><Sparkles className="size-3.5" /> One plan. Everything included.</span>
        <h1 className="mt-7 text-5xl font-semibold tracking-[-.06em] sm:text-7xl">Turn talk into your<br />superpower.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6e746d]">Start free with 2,000 words. Upgrade when you’re ready for unlimited flow across every app and device.</p>

        <div className="mx-auto mt-14 grid max-w-[880px] gap-5 text-left md:grid-cols-2">
          <article className="rounded-[28px] border border-[#1d211d]/12 bg-white p-7 sm:p-9">
            <p className="text-sm font-bold uppercase tracking-wider text-[#7b817a]">Free</p><p className="mt-4 text-5xl font-semibold tracking-[-.06em]">$0</p><p className="mt-2 text-sm text-[#777c76]">Forever</p>
            <div className="my-7 h-px bg-[#1d211d]/10" /><ul className="space-y-4 text-sm">{['2,000 words each month', 'Web dictation studio', '99+ languages', '7-day history'].map(x => <li className="flex gap-3" key={x}><Check className="size-4 text-[#8d9c22]" />{x}</li>)}</ul>
            <Link href="/auth" className="mt-9 flex h-12 items-center justify-center rounded-xl border border-[#1d211d]/15 font-semibold">Start free</Link>
          </article>
          <article className="relative overflow-hidden rounded-[28px] bg-[#1d211d] p-7 text-white shadow-[0_30px_70px_rgba(30,34,29,.22)] sm:p-9">
            <div className="absolute right-0 top-0 size-44 rounded-full bg-[#e9f784]/15 blur-2xl" />
            <div className="relative flex items-center justify-between"><p className="text-sm font-bold uppercase tracking-wider text-[#e9f784]">Pro</p><span className="rounded-full bg-[#e9f784] px-3 py-1.5 text-xs font-bold text-[#1d211d]">MOST POPULAR</span></div>
            <p className="relative mt-4 text-5xl font-semibold tracking-[-.06em]">$12<span className="text-base font-normal text-white/50"> / mo</span></p><p className="relative mt-2 text-sm text-white/45">Billed monthly. Cancel anytime.</p>
            <div className="relative my-7 h-px bg-white/10" /><ul className="relative space-y-4 text-sm text-white/80">{['Unlimited dictation', 'Desktop apps + global shortcut', 'Custom dictionary', 'Unlimited synced history', 'Priority processing'].map(x => <li className="flex gap-3" key={x}><Check className="size-4 text-[#e9f784]" />{x}</li>)}</ul>
            <button onClick={checkout} className="relative mt-9 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e9f784] font-bold text-[#1d211d] transition-transform hover:-translate-y-0.5"><Crown className="size-4" /> Upgrade to Pro</button>
          </article>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-[#777c76]"><span className="flex items-center gap-2"><ShieldCheck className="size-4" /> Secure Paddle billing</span><span>14-day money-back guarantee</span><span>Prices in USD</span></div>
      </section>

      {mockOpen && <dialog open className="fixed inset-0 z-50 m-0 grid h-screen max-h-none w-screen max-w-none place-items-center bg-[#121511]/65 p-5 backdrop-blur-sm" aria-labelledby="mock-title"><div className="w-full max-w-[470px] rounded-[28px] bg-white p-7 text-[#1d211d] shadow-2xl sm:p-9"><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-[#eff5c6]"><Crown className="size-5" /></span><button onClick={() => setMockOpen(false)} className="grid size-9 place-items-center rounded-full bg-[#f1efe9]" aria-label="Close"><X className="size-4" /></button></div><p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-[#879524]">Paddle sandbox preview</p><h2 id="mock-title" className="mt-2 text-3xl font-semibold tracking-[-.045em]">Upgrade to OpenWhispr Pro</h2><div className="mt-6 flex items-center justify-between rounded-2xl bg-[#f6f4ee] p-4"><div><p className="font-semibold">Pro monthly</p><p className="text-sm text-[#777c76]">Unlimited dictation</p></div><p className="text-xl font-bold">$12.00</p></div><p className="mt-5 text-sm leading-6 text-[#6e746d]">The checkout UI is ready. Add your Paddle client token and price ID to switch this preview to a real one-page Paddle checkout.</p><button onClick={() => { setSimulating(true); setTimeout(() => { setSimulating(false); setMockOpen(false); }, 900); }} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1d211d] font-semibold text-white">{simulating ? <><LoaderCircle className="size-4 animate-spin" /> Simulating checkout</> : 'Preview successful payment'}</button></div></dialog>}
    </main>
  );
}
