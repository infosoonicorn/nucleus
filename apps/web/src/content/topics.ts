/**
 * Editorial descriptions for topic landing pages at /insights/topic/<tag>.
 *
 * Each entry is a 1-2 sentence framing of why the topic matters and
 * what we tend to cover under it. Reads as the firm's editorial
 * position, not a marketing summary. Unknown tags fall back to a
 * generic line via `getTopicDescription`.
 *
 * Keep entries short. The hero of the topic page is dominated by the
 * article list; the description sets context in two breaths.
 */
export const TOPIC_DESCRIPTIONS: Record<string, string> = {
  'AIF structuring':
    "Category selection, GP/LP economics, and the structural choices that lock a fund's options for its lifetime. The decisions to make in week one of formation.",
  'Cap table':
    'Cap-table hygiene, dilution math across rounds, and the recurring failure modes that surface in diligence — six weeks before a closing.',
  'Capital strategy':
    'How founders should think about capital structure across rounds: the cost of one bad term, the math of two ESOP top-ups, and the trade-offs that are easy to miss on the first pass.',
  'ESOP valuation':
    "Indian ESOP valuation under Rule 11UA, why the 409A playbook doesn't translate, and what a defensible valuation report looks like under tax, Companies Act and FEMA review.",
  'GST refunds':
    'The procedural failures that block legitimate GST refunds — LUT timing, invoice-shipping bill mismatches, FIRC requirements, and the relevant-date math — with the fix for each.',
  'Internal audit':
    "What internal audit actually catches in regulated financial businesses. Control failures that recur across NBFCs, banks and finance functions, and the audit scope that surfaces them.",
  'Investor narrative':
    'Pitch decks, information memoranda, and what investors actually read in the first ten minutes of diligence. Section-by-section construction, with the FAQ pack that closes calls faster.',
  'M&A':
    'Mergers, acquisitions and the moments in a transaction where structural choices outweigh negotiating skill. Buy-side, sell-side, integration, and the decisions that should be made before week one.',
  'Process':
    'How a real sell-side process runs from week one through closing. Board alignment, readiness, buyer outreach, the documents that actually matter, and the failure modes worth pre-empting.',
  'ROC filings':
    "The six secretarial filings that surface in late-stage diligence — PAS-3, MGT-7, DIR-12, MGT-14, CHG-4, BEN-2 — and how to close each gap before you open a data room.",
  'Readiness':
    'The preparation that decides whether a fundraise or a sale goes well. Cap-table cleanup, IM construction, diligence anticipation, the work that happens before any outsider sees a teaser.',
  'Sell-side process':
    'The three weeks of work that decide a sell-side mandate. Board alignment, readiness audit, buyer-list construction. Skipping them turns a six-month process into an expensive education.',
  'Statutory audit':
    "The four asks founders dread at audit time — revenue recognition, related parties, fixed-asset register, lease accounting — and the five-day preparation that makes fieldwork routine.",
  'Term sheet':
    'Liquidation preference, anti-dilution, drag-along, and the small clauses that decide what you actually keep on the way out. What to read carefully, what to push back on.',
  'vCFO':
    "When outsourced controllership beats a CFO hire — Series A through Series B mechanics, scope, cost, and the moment a full-time CFO actually starts earning their salary.",
  'Deal structuring':
    'Earnouts, escrows, working-capital adjustments and the structural choices that make a clean deal at signing become a clean deal at completion. India-specific market conventions.',
  'Buy-side':
    'Building a target list that produces real meetings rather than activity. Strategic logic, capital posture, deal-team availability, and the path-in test that filters list to short list.',
};

const GENERIC_FALLBACK = 'Everything we have published on this topic, newest first.';

export function getTopicDescription(tag: string): string {
  return TOPIC_DESCRIPTIONS[tag] ?? GENERIC_FALLBACK;
}
