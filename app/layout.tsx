import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import { AuthProvider } from '@/components/auth-provider';
import { PwaRegister } from '@/components/pwa-register';
import './globals.css';

const body = DM_Sans({ variable: '--font-body', subsets: ['latin'] });
const display = Manrope({ variable: '--font-display', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Saygo — Talk. We’ll handle the typing.',
  description: 'Fast, private AI dictation that turns your voice into polished writing in every app.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Saygo', statusBarStyle: 'black-translucent' },
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
  openGraph: {
    title: 'Saygo — Your voice, beautifully written',
    description: 'AI dictation that works wherever you do.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saygo — Your voice, beautifully written',
    description: 'AI dictation that works wherever you do.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider><PwaRegister />
      </body>
    </html>
  );
}
