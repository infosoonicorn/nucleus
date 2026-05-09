import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nucleus Advisors | Website Under Rebuild',
  description: 'Nucleus Advisors is rebuilding its website and will be back soon.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
