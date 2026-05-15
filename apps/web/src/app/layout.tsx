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
