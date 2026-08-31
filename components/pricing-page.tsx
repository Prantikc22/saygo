'use client';

import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import {
  ArrowLeft,
  Building2,
  Check,
  Crown,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Brand } from '@/components/brand';
import { useAuth } from '@/components/auth-provider';

type Cadence = 'monthly' | 'annual';
type PaidPlan = 'pro' | 'business';

const planFeatures = {
  free: [
    '2,000 words each month',
    'Web dictation studio',
    'Meeting-recording uploads',
    '99+ languages',
    'Personal dictionary',
    'Searchable local history',
  ],
  pro: [
    'Unlimited dictation',
    'Mac + Windows background apps',
    'Custom global hotkey',
    'Text inserted at your cursor',
    'AI cleanup + dictionary spellings',
    'Unlimited synced history',
  ],
  business: [
    'Everything in Pro',
    'Shared team dictionaries',
    'Team workspace and admin controls',
    'Centralized billing',
    'Team privacy controls',
    'Priority support',
  ],
};

function FeatureList({
  items,
  dark = false,
}: {
  items: string[];
  dark?: boolean;
}) {
  return (
    <ul className={`space-y-4 text-sm ${dark ? 'text-white/80' : ''}`}>
      {items.map((item) => (
        <li className="flex gap-3" key={item}>
          <Check
            className={`size-4 shrink-0 ${dark ? 'text-[#e9f784]' : 'text-[#8d9c22]'}`}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function PricingPage() {
  const { user } = useAuth();
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [mockOpen, setMockOpen] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PaidPlan>('pro');
  const [cadence, setCadence] = useState<Cadence>('monthly');
  const [india, setIndia] = useState(false);
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  const priceIds: Record<PaidPlan, Record<Cadence, string | undefined>> = {
    pro: {
      monthly:
        process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID ||
        process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID,
      annual: process.env.NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID,
    },
    business: {
      monthly: process.env.NEXT_PUBLIC_PADDLE_BUSINESS_MONTHLY_PRICE_ID,
      annual: process.env.NEXT_PUBLIC_PADDLE_BUSINESS_ANNUAL_PRICE_ID,
    },
  };

  const prices: Record<PaidPlan, Record<Cadence, string>> = india
    ? {
        pro: { monthly: '₹399', annual: '₹3,990' },
        business: { monthly: '₹799', annual: '₹7,990' },
      }
    : {
        pro: { monthly: '$8', annual: '$80' },
        business: { monthly: '$16', annual: '$160' },
      };

  useEffect(() => {
    queueMicrotask(() =>
      setIndia(navigator.language.toLowerCase().endsWith('-in')),
    );
    if (!token) return;
    void initializePaddle({
      token,
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox') as
        | 'sandbox'
        | 'production',
    }).then((instance) => instance && setPaddle(instance));
  }, [token]);

  function checkout(plan: PaidPlan) {
    setSelectedPlan(plan);
    const priceId = priceIds[plan][cadence];
    if (paddle && priceId) {
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        ...(user?.email ? { customer: { email: user.email } } : {}),
        settings: {
          variant: 'one-page',
          successUrl: `${window.location.origin}/app?upgraded=1`,
        },
      });
    } else {
      setMockOpen(true);
    }
  }

  const activePrice = prices[selectedPlan][cadence];
  const activePlanName =
    selectedPlan === 'pro' ? 'Saygo Pro' : 'Saygo Business';

  return (
    <main className="min-h-screen bg-[#fbf9f4] px-5 py-6 text-[#1d211d] lg:px-8">
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between">
        <Link href="/">
          <Brand />
        </Link>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-sm font-semibold"
        >
          <ArrowLeft className="size-4" /> Back to app
        </Link>
      </nav>

      <section className="mx-auto max-w-[1240px] pb-20 pt-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eff5c6] px-4 py-2 text-xs font-bold uppercase tracking-[.13em]">
          <Sparkles className="size-3.5" /> Monthly or annual. Your choice.
        </span>
        <h1 className="mt-7 text-5xl font-semibold tracking-[-.06em] sm:text-7xl">
          Speak more. Pay less.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6e746d]">
          Start free, unlock unlimited desktop dictation with Pro, or give your
          whole team one shared voice workspace with Business.
        </p>

        <div className="mx-auto mt-9 flex w-fit rounded-full bg-[#e9e7df] p-1 text-sm font-semibold">
          {(['monthly', 'annual'] as Cadence[]).map((option) => (
            <button
              key={option}
              onClick={() => setCadence(option)}
              className={`rounded-full px-5 py-2.5 capitalize transition-colors ${cadence === option ? 'bg-white shadow-sm' : 'text-[#777c76]'}`}
            >
              {option}
              {option === 'annual' && (
                <span className="ml-2 text-xs text-[#7d8a1f]">
                  2 months free
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-9 grid gap-4 text-left sm:grid-cols-2 xl:grid-cols-4">
          <article className="flex rounded-[28px] border border-[#1d211d]/12 bg-white p-7">
            <div className="flex w-full flex-col">
              <p className="text-sm font-bold uppercase tracking-wider text-[#7b817a]">
                Free
              </p>
              <p className="mt-4 text-5xl font-semibold tracking-[-.06em]">
                {india ? '₹0' : '$0'}
              </p>
              <p className="mt-2 text-sm text-[#777c76]">Forever · no card</p>
              <div className="my-7 h-px bg-[#1d211d]/10" />
              <FeatureList items={planFeatures.free} />
              <Link
                href="/auth"
                className="mt-auto flex h-12 items-center justify-center rounded-xl border border-[#1d211d]/15 pt-0 font-semibold"
              >
                Start free
              </Link>
            </div>
          </article>

          <article className="relative flex overflow-hidden rounded-[28px] bg-[#1d211d] p-7 text-white shadow-[0_30px_70px_rgba(30,34,29,.22)]">
            <div className="absolute right-0 top-0 size-44 rounded-full bg-[#e9f784]/15 blur-2xl" />
            <div className="relative flex w-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold uppercase tracking-wider text-[#e9f784]">
                  Pro
                </p>
                <span className="rounded-full bg-[#e9f784] px-2.5 py-1 text-[10px] font-bold text-[#1d211d]">
                  POPULAR
                </span>
              </div>
              <p className="mt-4 text-5xl font-semibold tracking-[-.06em]">
                {prices.pro[cadence]}
                <span className="text-sm font-normal text-white/50">
                  {' '}
                  / {cadence === 'annual' ? 'yr' : 'mo'}
                </span>
              </p>
              <p className="mt-2 text-sm text-white/45">
                {cadence === 'annual'
                  ? 'Two months included.'
                  : 'Cancel anytime.'}
              </p>
              <div className="my-7 h-px bg-white/10" />
              <FeatureList items={planFeatures.pro} dark />
              <button
                onClick={() => checkout('pro')}
                className="mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e9f784] font-bold text-[#1d211d]"
              >
                <Crown className="size-4" /> Choose Pro
              </button>
            </div>
          </article>

          <article className="flex rounded-[28px] border-2 border-[#aabb35] bg-[#f4f7dc] p-7">
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold uppercase tracking-wider text-[#65710d]">
                  Business
                </p>
                <span className="rounded-full bg-[#1d211d] px-2.5 py-1 text-[10px] font-bold text-white">
                  TEAM BETA
                </span>
              </div>
              <p className="mt-4 text-5xl font-semibold tracking-[-.06em]">
                {prices.business[cadence]}
                <span className="text-sm font-normal text-[#777c76]">
                  {' '}
                  / user / {cadence === 'annual' ? 'yr' : 'mo'}
                </span>
              </p>
              <p className="mt-2 text-sm text-[#777c76]">
                {cadence === 'annual'
                  ? 'Two months included.'
                  : 'Billed per seat.'}
              </p>
              <div className="my-7 h-px bg-[#1d211d]/10" />
              <FeatureList items={planFeatures.business} />
              <button
                onClick={() => checkout('business')}
                className="mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1d211d] font-bold text-white"
              >
                <Building2 className="size-4" /> Choose Business
              </button>
            </div>
          </article>

          <article className="flex rounded-[28px] border border-[#1d211d]/12 bg-[#eedcff] p-7">
            <div className="flex w-full flex-col">
              <p className="text-sm font-bold uppercase tracking-wider text-[#665a70]">
                Enterprise
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-[-.05em]">
                Custom
              </p>
              <p className="mt-3 text-sm text-[#6c6471]">
                Security, deployment, and support designed around your company.
              </p>
              <div className="my-7 h-px bg-[#1d211d]/10" />
              <FeatureList
                items={[
                  'Everything in Business',
                  'SSO and directory sync',
                  'Audit and retention controls',
                  'Private deployment options',
                  'Security review support',
                  'Dedicated success contact',
                ]}
              />
              <a
                href="mailto:hello@saygo.app?subject=Saygo%20Enterprise"
                className="mt-auto flex h-12 items-center justify-center rounded-xl border border-[#1d211d]/15 bg-white/45 font-semibold"
              >
                Contact sales
              </a>
            </div>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-[#777c76]">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4" /> Paddle checkout ready
          </span>
          <span>Localized taxes at checkout</span>
          <span>14-day refund window</span>
        </div>
      </section>

      {mockOpen && (
        <dialog
          open
          className="fixed inset-0 z-50 m-0 grid h-screen max-h-none w-screen max-w-none place-items-center bg-[#121511]/65 p-5 backdrop-blur-sm"
          aria-labelledby="mock-title"
        >
          <div className="w-full max-w-[470px] rounded-[28px] bg-white p-7 text-[#1d211d] shadow-2xl sm:p-9">
            <div className="flex items-start justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-[#eff5c6]">
                {selectedPlan === 'pro' ? (
                  <Crown className="size-5" />
                ) : (
                  <Building2 className="size-5" />
                )}
              </span>
              <button
                onClick={() => setMockOpen(false)}
                className="grid size-9 place-items-center rounded-full bg-[#f1efe9]"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-[#879524]">
              Paddle checkout preview
            </p>
            <h2
              id="mock-title"
              className="mt-2 text-3xl font-semibold tracking-[-.045em]"
            >
              Upgrade to {activePlanName}
            </h2>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#f6f4ee] p-4">
              <div>
                <p className="font-semibold capitalize">
                  {selectedPlan} {cadence}
                </p>
                <p className="text-sm text-[#777c76]">
                  {selectedPlan === 'pro'
                    ? 'Unlimited dictation'
                    : 'Team workspace'}
                </p>
              </div>
              <p className="text-xl font-bold">{activePrice}</p>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#6e746d]">
              Add the matching Paddle price ID to accept real payments with
              localized tax and currency. Until then, this safe preview confirms
              the selected plan and cadence.
            </p>
            <button
              onClick={() => {
                setSimulating(true);
                setTimeout(() => {
                  setSimulating(false);
                  setMockOpen(false);
                }, 900);
              }}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1d211d] font-semibold text-white"
            >
              {simulating ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" /> Simulating
                  checkout
                </>
              ) : (
                'Preview successful payment'
              )}
            </button>
          </div>
        </dialog>
      )}
    </main>
  );
}
