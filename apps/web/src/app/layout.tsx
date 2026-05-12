import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nucleus Advisors | Full-Spectrum Consulting From Incorporation to Listing',
  description:
    'Nucleus Advisors helps businesses from incorporation to listing readiness across investment banking, M&A, risk advisory, tax, assurance, valuations and finance operations.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
