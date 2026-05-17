import type { Metadata } from 'next';
import { Caveat } from 'next/font/google';
import { LenisProvider } from '@/components/lenis-provider';
import './globals.css';

// Caveat is used only for the partner-signature on the IB dossier (Process
// section). Subset to latin to keep the bundle tight.
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: 'Nucleus Advisors | Full-Spectrum Consulting From Incorporation to Listing',
  description:
    'Nucleus Advisors helps businesses from incorporation to listing readiness across investment banking, M&A, risk advisory, tax, assurance, valuations and finance operations.',
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/insights/feed.xml', title: 'Nucleus Advisors — Insights' },
      ],
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Nucleus Advisors',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={caveat.variable}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
