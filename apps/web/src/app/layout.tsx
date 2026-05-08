import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nucleus Advisors',
  description:
    'Strategic finance, compliance, transaction, and advisory support for founders, funds, and growing businesses.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
