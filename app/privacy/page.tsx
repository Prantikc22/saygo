import Link from 'next/link';
import { Brand } from '@/components/brand';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fbf9f4] px-5 py-7 text-[#1d211d]">
      <nav className="mx-auto max-w-[900px]">
        <Link href="/">
          <Brand />
        </Link>
      </nav>
      <article className="mx-auto max-w-[740px] py-20">
        <p className="text-sm font-bold uppercase tracking-[.14em] text-[#879524]">
          Privacy
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-.06em]">
          Your words are yours.
        </h1>
        <p className="mt-6 text-lg leading-8 text-[#697068]">
          Saygo is designed to process only what is needed to turn speech into
          text. Audio is sent securely for transcription and is not stored by
          the application after processing.
        </p>
        <div className="mt-12 space-y-9">
          {[
            [
              'What we store',
              'Your account details, preferences, dictionary entries, and transcript history when you choose to save it.',
            ],
            [
              'How audio is handled',
              'Recorded audio is transmitted over encrypted connections to our transcription provider, processed, and discarded.',
            ],
            [
              'Your control',
              'You can delete individual transcripts, clear your history, export your data, or delete your account.',
            ],
            [
              'Service providers',
              'Supabase provides authentication and data storage. OpenRouter routes speech transcription. Paddle will provide subscription billing once enabled.',
            ],
          ].map(([title, copy]) => (
            <section key={title}>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 leading-7 text-[#697068]">{copy}</p>
            </section>
          ))}
        </div>
        <p className="mt-12 border-t border-[#1d211d]/10 pt-8 text-sm text-[#8b9089]">
          Last updated: August 31, 2026 · Contact: privacy@saygo.app
        </p>
      </article>
    </main>
  );
}
