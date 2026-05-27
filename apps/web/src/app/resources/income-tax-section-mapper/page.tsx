import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageShell } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'Income-tax Act Section Mapper · Nucleus Advisors',
  description:
    'Cross-reference every section of the Income-tax Act, 1961 to the Income-tax Act, 2025. Search by section number or topic, browse by category, see what has been retained, restructured or sunset.',
};

/**
 * Embeds the standalone Section Mapper tool (apps/web/public/tools/...)
 * inside the Nucleus site shell. The tool is a self-contained HTML
 * artefact with its own data, styles and JS — wrapping it in an iframe
 * keeps its scope isolated from the Next.js bundle (no global pollution
 * from inline onclick handlers, no CSS bleed) while letting the site
 * header/footer wrap it for navigation continuity.
 */
export default function IncomeTaxSectionMapperPage() {
  return (
    <PageShell>
      <main className="tool-shell">
        <div className="tool-shell-bar">
          <Link className="tool-shell-back" href="/resources">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>All resources</span>
          </Link>
          <p className="tool-shell-crumb">
            <span className="tool-shell-crumb-pill">Tax · Reference</span>
            <span>Income-tax Act Section Mapper</span>
          </p>
        </div>
        <iframe
          src="/tools/income-tax-section-mapper.html"
          title="Income-tax Act Section Mapper"
          className="tool-shell-frame"
          loading="eager"
        />
      </main>
    </PageShell>
  );
}
