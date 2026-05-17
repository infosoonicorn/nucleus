/**
 * Insights articles. Drafts authored by Nucleus partners; each entry is held
 * behind a reviewer-status gate so unreviewed drafts can render in development
 * (`pnpm --filter web dev`) but never reach production until partner sign-off.
 *
 * The voice rules — courtesy of the humanizer skill we keep in our head:
 *  - First person plural where the firm speaks ("we"). Second person when
 *    talking to a founder ("you").
 *  - Concrete numbers and named situations beat generalisations.
 *  - No "delve", "robust", "nuanced", "crucial", "multifaceted".
 *  - No three-element parallel constructions used as rhetorical filler.
 *  - Allow short sentences. Allow one-line paragraphs.
 *  - Honest, sometimes inconvenient. Promotional only where earned by data.
 */

import { getTeamMemberBySlug, type TeamMember } from './team';

type ArticleBase = {
  slug: string;
  title: string;
  excerpt: string;             // one or two lines for the card preview
  body: string;                // long-form. Plain paragraphs separated by blank lines.
  authorSlug: string;          // points to a team member slug in team.ts — single source of truth
  publishedOn: string;         // YYYY-MM-DD
  readMinutes: number;         // estimated read time
  tag: string;                 // single primary tag for chip
  serviceSlugs: string[];      // which service pages this article shows up on
  thumbnailSrc?: string;       // optional path under apps/web/public, e.g. '/article-thumbs/<slug>.jpg'
  thumbnailHook?: string;      // short bait line (≤7 words) rendered onto the thumbnail; see docs/article-thumbnail-hook-guide.md
  thumbnailHookEmphasis?: string; // optional single word from thumbnailHook to render in Nucleus red (forward-looking; not yet applied by autofill)
  featured?: boolean;          // when true, eligible for the 'Start here' slot on /insights
  seriesKey?: string;          // kebab-case series identifier — articles with the same key cluster
  seriesTitle?: string;        // display title for the series, e.g. 'The sell-side process'
  seriesOrder?: number;        // 1-indexed position of this article within the series
  references?: readonly { label: string; href: string }[];
                               // primary-source citations rendered as a References block at the end
  updatedOn?: string;          // YYYY-MM-DD; meta row shows "Updated <date>" when set
};

/**
 * Whether an article was published in the last `days` days. Drives the
 * "New" badge on hub + service-page cards so the publication feels
 * current. Default 21 days.
 */
export function isRecentArticle(article: Article, days = 21): boolean {
  const published = new Date(`${article.publishedOn}T00:00:00Z`).getTime();
  if (Number.isNaN(published)) return false;
  const ageMs = Date.now() - published;
  return ageMs >= 0 && ageMs <= days * 24 * 60 * 60 * 1000;
}

/**
 * Most recent publication date across all visible articles. Drives the
 * "Latest: <date>" cadence indicator on the /insights hero. Returns
 * null if no visible articles exist.
 */
export function getLatestPublishedOn(opts?: { allowDrafts?: boolean }): string | null {
  const allowDrafts = opts?.allowDrafts ?? false;
  const visible = articles.filter((a) => allowDrafts || a.reviewerStatus === 'approved');
  if (visible.length === 0) return null;
  return visible.reduce(
    (max, a) => (a.publishedOn.localeCompare(max) > 0 ? a.publishedOn : max),
    visible[0].publishedOn,
  );
}

/**
 * Count words in an article body for the "N words" display in the
 * meta row. Strips markdown markers (## headings, **bold**, > quote
 * prefix, ::: callout fences) so the count reflects readable prose
 * only, not author shortcuts.
 */
export function getArticleWordCount(article: Article): number {
  return article.body
    .replace(/\*\*([^*]+)\*\*/g, '$1')      // bold
    .replace(/^#+\s*/gm, '')                // headings
    .replace(/^>\s*/gm, '')                  // pull-quote prefix
    .replace(/^:::(note|insight|watch)\s+/gm, '') // callout opener
    .replace(/:::\s*$/gm, '')                // callout closer
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * All articles sharing a seriesKey, ordered by seriesOrder. Used by
 * the SeriesBanner in the article reader to surface sibling parts.
 */
export function getSeriesArticles(seriesKey: string, opts?: { allowDrafts?: boolean }): Article[] {
  const allowDrafts = opts?.allowDrafts ?? false;
  return articles
    .filter((a) => a.seriesKey === seriesKey && (allowDrafts ? true : a.reviewerStatus === 'approved'))
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
}

export type Article =
  | (ArticleBase & { reviewerStatus: 'approved'; reviewerApprovedAt: string })
  | (ArticleBase & { reviewerStatus: 'pending'; reviewerApprovedAt?: never });

/**
 * Resolve an article's author to the canonical TeamMember record.
 * Throws if the article references a team slug that doesn't exist —
 * lint-articles catches this in CI, but the runtime throw means a
 * silent mismatch can never reach a rendered page.
 *
 * When a `/team` page is built, it reads from the same `team.ts`
 * registry, so any change there (new headshot, updated role, new
 * LinkedIn URL) automatically reflects on every article by that
 * partner. Authors maintain one record, not two.
 */
export function getArticleAuthor(article: Article): TeamMember {
  const member = getTeamMemberBySlug(article.authorSlug);
  if (!member) {
    throw new Error(
      `Article "${article.slug}" references unknown author slug "${article.authorSlug}". ` +
        `Add the partner to apps/web/src/content/team.ts or fix the authorSlug.`,
    );
  }
  return member;
}

export const articles: Article[] = [
  {
    slug: 'math-of-dilution',
    title: 'The math of dilution: what a $5M raise actually costs you over 18 months',
    excerpt:
      'Round size is the headline number. The cost is what your slice looks like after the next two rounds, an ESOP top-up, and a liquidation preference you forgot to read.',
    body: [
      "Founders think about dilution one round at a time. Investors think about it three rounds out.",
      "Take a clean example. You raise $5M at a $20M post-money valuation. The fund takes 25% of the company. Your team — let's say it was 80% before this round — is now sitting at 60%. That's the headline. You knew that going in.",
      "Now move 18 months. The investor wants you to top up the ESOP pool to 12% before the next round opens. That comes entirely out of the founders' and existing investors' share, not the new money. You drop to roughly 55%. You raise a Series B at $40M post-money, and the lead takes 20%. You're now at 44%. The Series A investor has been pulled down to 20%. Your team's psychology shifts somewhere in there — usually around the second top-up.",
      "Now the liquidation preference. The Series A had a 1x non-participating preference. The Series B asked for 1x non-participating too. On a $200M sale, you do not feel it. On a $40M sale, you absolutely do. The investors get their money back first; you and the team divide what's left. Most founders only learn this on the way out.",
      "What we do in the readiness assessment is run this math at engagement. Not the optimistic version — the realistic one. Two rounds out, an ESOP top-up at each, a market-standard preference stack, and what the exit looks like in the bottom half of likely outcomes. We do not show this to investors. We show it to you. The point is that you walk into the term sheet conversation knowing what you are agreeing to two rounds from now, not just at the closing.",
      "Some of what we run sees founders push back on the headline valuation in favour of cleaner terms — a 1x non-participating preference instead of 1.5x, no anti-dilution carve-outs, an ESOP top-up timed after the round instead of before. The headline number is what gets press-released. The terms are what you live with.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2025-12-23',
    readMinutes: 5,
    tag: 'Term sheet',
    serviceSlugs: ['investment-banking'],
    thumbnailSrc: '/article-thumbs/math-of-dilution.jpg',
    thumbnailHook: "Eighty percent becomes forty-four.",
    thumbnailHookEmphasis: 'forty-four',
    reviewerStatus: 'pending',
  },
  {
    slug: 'how-investors-read-im',
    title: 'How investors really read your information memorandum — and what they skip',
    excerpt:
      'The deck gets you the meeting. The IM is read by analysts on a Saturday morning with a checklist. Most founders write IMs as if they will be read like a deck. They are not.',
    body: [
      "An information memorandum is not a long deck. It serves a different reader. A deck is read by a partner who already half-believes. An IM is read by an analyst who is allergic to risk.",
      "Here's the order analysts actually read it in. Executive summary — three minutes. Financial snapshot — they go straight to the model tab open in another window and tie out the numbers. Customer concentration — they want to see the top-five customer dependency. Key-person risk — who walks and the business is in trouble. Cap-table and history of dilution — they want to see what previous rounds looked like, what the cap-table has gone through, and how much has been signed away in side letters. Then they go back to the top and read the rest.",
      "Most founder-written IMs spend forty pages on the market opportunity and three on the financial model assumptions. Investors give the market opportunity ninety seconds. They give the model assumptions thirty minutes. Worse: founders often hide the awkward parts deep in the document, expecting they will not be read. They are read first.",
      "What we build, structurally, looks like this. Section 1: 90-second read of what the company does, why now, and what the round funds. Section 2: financial summary with three statements. Section 3: customer and revenue concentration with two years of cohort retention. Section 4: cap-table and ownership history. Section 5: key people and what their roles are. Section 6: the FAQ pack — every awkward question, answered in advance, so the diligence call ends in 45 minutes instead of three hours.",
      "The hardest section is the FAQ pack. We sit with the founder for half a day and write every question an investor will ask. Why is gross margin so low. Why does CAC look like that. Why did the previous CFO leave. Why is your largest customer also your largest shareholder. The questions are the awkward ones. The answers are honest, with the underlying numbers shown.",
      "Founders sometimes resist this. They worry that surfacing every concern up front kills the deal. The opposite is true. The investor was going to find it anyway in week three of diligence, in a far more damaging way. Showing it on page eight of the IM with the data already laid out turns a possible deal-killer into a non-event. That's the whole job of the IM.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2025-12-29',
    readMinutes: 6,
    tag: 'Investor narrative',
    serviceSlugs: ['investment-banking'],
    thumbnailSrc: '/article-thumbs/how-investors-read-im.jpg',
    thumbnailHook: "Forty pages they won't read.",
    thumbnailHookEmphasis: 'read',
    reviewerStatus: 'pending',
  },
  {
    slug: 'cap-table-hygiene',
    title: 'Cap-table hygiene: the six mistakes we see in first-time founder docs',
    excerpt:
      'A messy cap-table does not kill a round. It slows it. Cleanup costs you four weeks of diligence-driven discovery you could have avoided in two days.',
    body: [
      "We have looked at roughly 200 founder cap-tables in the last three years. Six mistakes show up over and over.",
      "First — undocumented common-stock issuances. A co-founder left two years ago, their share was supposed to come back to the company, but the buyback paperwork was never filed. Their name still sits on the cap-table. Investor diligence flags it. We spend three weeks chasing the ex-co-founder for a signed transfer.",
      "Second — ESOP grants that were promised but never papered. The CFO has been told she has 1% but there is no signed grant agreement and no board resolution. She believes she has it. Legally she does not. When the round closes and dilution is recalculated, she finds out she has less than she thought. Goodwill damage compounds quickly.",
      "Third — convertible notes that were never converted. The angel round was done on a SAFE or a convertible note three years ago. The conversion event was supposed to be the Series A. Nobody actually filed the conversion. The notes are still outstanding. Now the Series B investor wants them off the cap-table before they invest.",
      "Fourth — preferred shareholder consents that the founder forgot existed. Most preferred-stock agreements require the preferred-shareholder's consent to issue new shares above a certain threshold. The founder skipped this for a small bridge round. The investor finds out in diligence. The bridge has to be unwound and re-papered.",
      "Fifth — shareholder agreements that conflict with each other. A founder signed an SHA with the Series A investor and a separate angel-round letter agreement with two angels. The two documents have inconsistent transfer-restriction terms. The Series B investor's lawyer reads both and flags the inconsistency. Now you have to renegotiate one of them.",
      "Sixth — and the most common — wrong arithmetic in the cap-table spreadsheet itself. The total adds to 100.4%. The fully-diluted column does not match the issued column. The ESOP pool size differs across three tabs of the model. We see this in 30% of cap-tables we audit.",
      "The fix for all six is the same — run a cap-table audit before you go to market. Half a day with the company secretary and a focused partner. Pull every issuance back to a board resolution. Reconcile against ROC filings. Build a single source-of-truth cap-table that ties out at every column. Audit-cost: low. Time saved in diligence: four to six weeks. We have never seen the math come out the other way.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-01-06',
    readMinutes: 5,
    tag: 'Cap table',
    serviceSlugs: ['investment-banking'],
    thumbnailSrc: '/article-thumbs/cap-table-hygiene.jpg',
    thumbnailHook: "Your cap table adds to 100.4.",
    thumbnailHookEmphasis: '100.4',
    reviewerStatus: 'pending',
  },
  {
    slug: 'term-sheet-line-by-line',
    title: 'Term sheet line-by-line: liquidation preference, anti-dilution, drag-along, tag-along',
    excerpt:
      'A term sheet is two pages. Two of those pages decide who gets what when the company is sold. Read them like that, not like a price quote.',
    body: [
      "Most founders see the term sheet and look first at the valuation. Then they look at the round size. Then maybe they ask their lawyer what the rest means. By then it is too late to push back without looking unprepared.",
      "Here is the order we read it in.",
      "Liquidation preference. The number that decides what happens on an exit. A 1x non-participating preference means the investor gets their money back OR their pro-rata share, whichever is bigger. A 1x participating preference means they get their money back AND their pro-rata share — double-dipping. A 2x or 3x preference is rare in growth-stage India deals but shows up in distress rounds. If the term sheet has a participating preference, push back. Hard.",
      "Anti-dilution. The clause that protects investors if you raise a future round at a lower price (a 'down round'). The market-standard form is broad-based weighted-average — a partial adjustment that reflects how much new dilutive issuance happens. The aggressive form is full-ratchet, which adjusts the investor's price all the way down to the new round's price, regardless of size. Full-ratchet was common in 2014–2017. Avoid it.",
      "Drag-along. The clause that lets a majority of preferred shareholders force a sale on the rest. Reasonable in principle — you do not want a 2% holder blocking a $200M exit. The question is the threshold. Pure majority is too low; 75% of preferred and a majority of common is the comfortable range. Insist on a minimum value protection — drag-along only kicks in above a defined exit value.",
      "Tag-along. The mirror image — if a major shareholder sells, minority shareholders can 'tag along' on the same terms. This is founder-friendly and you want it generous.",
      "Pre-emptive rights. The right of existing investors to participate in future rounds. Pro-rata is standard. Over-pro-rata (i.e., taking more than their existing percentage) is a negotiation point — investors will often ask, and you can usually negotiate it out.",
      "Board composition. How many seats, who appoints them, who chairs. The right structure for an early Series A is two investors, two founders, one independent. Investor-majority boards at Series A are a red flag and reflect either a distressed company or a weak negotiating position.",
      "Vesting and reverse-vesting. The investor will usually ask the founders to put their shares on a four-year vesting schedule starting at the closing. This is reasonable. The version to push back on is one-year cliff with no credit for time already served.",
      "Information rights. Quarterly financials, annual budget approval, audited statements. Standard. The thing to watch is veto rights on operating decisions — the term sheet should list these explicitly. If a founder needs investor consent to hire a single engineer, that is a problem.",
      "Read the term sheet in this order. Spend ten minutes on each of these clauses, not on the valuation. The valuation is a number you negotiate up by 15% with a good story. The clauses are what determine the next five years of how this company runs.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-01-11',
    readMinutes: 8,
    tag: 'Term sheet',
    serviceSlugs: ['investment-banking'],
    thumbnailSrc: '/article-thumbs/term-sheet-line-by-line.jpg',
    thumbnailHook: "The clause you didn't read.",
    thumbnailHookEmphasis: "didn't",
    reviewerStatus: 'pending',
  },
  {
    slug: 'anti-dilution-clauses-explained',
    title: 'Anti-dilution clauses explained: weighted-average vs full-ratchet, and why it matters',
    excerpt:
      "Anti-dilution is an asymmetric clause. It only triggers in a down round. That's exactly why founders should care about it before the round closes.",
    body: [
      "Anti-dilution protection is a clause every term sheet has. It only activates if the company raises a future round at a lower price per share than the current round. Founders sign it without much thought because it feels theoretical — surely we won't raise a down round, right? Most won't. Many do, especially when market sentiment turns. And when it triggers, the difference between the two forms of anti-dilution is the difference between annoying and catastrophic.",
      "Broad-based weighted-average. This is the founder-friendly form. The investor's conversion price gets adjusted based on a formula that weighs the size of the new dilutive issuance against the existing share base. The bigger the down round, the bigger the adjustment. The smaller, the smaller. In a 20% down round of typical size, the investor's effective ownership might bump up by half a percent — meaningful but not catastrophic.",
      "Narrow-based weighted-average. Same formula, different denominator. Excludes common stock and options from the share count. Adjusts more aggressively than broad-based. Sits in the middle of the spectrum.",
      "Full-ratchet. The investor-aggressive form. If you raise the next round at a lower price per share, the investor's conversion price is reset all the way down to that new price — regardless of how big or small the down round is. The size of the new issuance is irrelevant. A tiny down round triggers the same adjustment as a massive one. Effect: investors get a lot more shares, founders are diluted disproportionately, and the cap-table arithmetic gets ugly fast.",
      "Here's the math on a real-ish example. You raised $10M at $40M post (25% to the investor) with a 1x non-participating preference and full-ratchet anti-dilution. Eighteen months later, market sentiment cooled and you raise a $5M bridge at $20M post. Without anti-dilution, the bridge investor takes 25%. With full-ratchet, the previous investor's conversion price halves; their pre-bridge ownership effectively doubles. Founder dilution: roughly double what the cap-table on the bridge term sheet shows. The bridge investor's deal is still the same. The previous investor's deal is much better.",
      "What to negotiate for: broad-based weighted-average, with a carve-out for issuances under a small-issuance threshold and for ESOP top-ups. Most institutional VCs accept this without much push-back. Crossover or growth funds occasionally push for narrow-based or full-ratchet — fight that, every time.",
      "What to watch: anti-dilution can be paired with a 'pay-to-play' clause that forces existing investors to participate in the down round or lose their preferred preferences. This is founder-friendly and worth asking for if you can.",
      "One more thing. Anti-dilution is reset on every subsequent up round — once you raise above the protected price, the protection drops away. So the practical risk window is the period between the round being signed and the next up round closing. In a healthy company, that's twelve to eighteen months. In a stressed one, it's the year the clause matters most.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-01-17',
    readMinutes: 6,
    tag: 'Term sheet',
    serviceSlugs: ['investment-banking'],
    thumbnailSrc: '/article-thumbs/anti-dilution-clauses-explained.jpg',
    thumbnailHook: "Full-ratchet doubles the damage.",
    thumbnailHookEmphasis: 'doubles',
    reviewerStatus: 'pending',
  },
  {
    slug: '14-day-pitch-to-term-sheet-myth',
    title: 'The 14-day pitch-to-term-sheet myth: what actually goes into a fast close',
    excerpt:
      "Fast closes happen. They are not magic. The work that makes them possible happens in the eight weeks before the first pitch, not the two weeks after.",
    body: [
      "We see a version of this story regularly. A founder gets pre-emptive interest from an investor they have known for two years. The investor moves fast. From the first formal pitch to a signed term sheet is eleven days. The founder talks about it as if the speed was the magic.",
      "The speed wasn't the magic. The eight weeks before the pitch were the magic.",
      "Here's what the founder had, going into that pitch. A working financial model that tied out across three statements. An IM that anticipated the investor's diligence questions. A clean data room with audited financials, ROC filings, board resolutions, customer contracts, employment agreements, ESOP grants, and cap-table reconciliation. A pre-built reference list with a dozen happy customers ready to take the diligence call. A board pre-aligned on the round shape and prepared to vote.",
      "When the investor's diligence team walked in, they did not find missing documents, version-mismatched spreadsheets, or awkward questions buried under tabs. They found a company that had thought through the questions and laid out the answers. The diligence took five days because there was nothing to discover that the founder had not already disclosed.",
      "Founders who are NOT ready get the opposite experience. Pre-emptive interest comes in. The founder spends three weeks pulling together a basic model. Diligence opens and immediately finds three documents missing, two cap-table inconsistencies, and a customer concentration question that needs new analysis. The investor's enthusiasm cools. The window closes. The round ends up taking five months at a worse valuation, if it happens at all.",
      "The pattern is consistent enough that we have built our entire readiness practice around it. Before you go to market, the work is — a clean model, an investor-ready IM, a populated data room, a reference list, board alignment, and a tight set of answers to the standard awkward questions. When that work is done in advance, a fast close becomes possible.",
      "What founders should not do is treat the readiness work as something to do AFTER the first pitch lands. By then, you are racing the clock against your own investor's diligence team. The math does not favour you.",
      "Plan for eight weeks of build before the pitch. Plan for two to ten weeks from the first pitch to the term sheet, depending on how the conversation goes. Plan for six to ten weeks of diligence and SHA negotiation after. That is the realistic timeline for a clean round. Anything faster usually had eight weeks of unseen preparation behind it.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-01-23',
    readMinutes: 5,
    tag: 'Process',
    serviceSlugs: ['investment-banking'],
    thumbnailSrc: '/article-thumbs/14-day-pitch-to-term-sheet-myth.jpg',
    thumbnailHook: "Two weeks is a fairy tale.",
    thumbnailHookEmphasis: 'fairy tale',
    reviewerStatus: 'pending',
  },
  {
    slug: 'fundraise-readiness-audit',
    title: 'Fundraise readiness audit: nine things a partner-led review actually finds',
    excerpt:
      'Most founders think they are ready six weeks before they are. A formal audit gives you a punch-list and a realistic timeline.',
    body: [
      "We run readiness audits as the first thing in most engagements. Half a day with the founder, half a day with the CFO, half a day inside the books. The pattern is consistent enough that I can tell you what we usually find.",
      "One. Cap-table inconsistencies. A reconciliation between the cap-table spreadsheet, the ROC filings, and the signed board resolutions almost always surfaces at least one discrepancy. Sometimes a small one, sometimes a $200K-of-shares one. Either way, it has to be fixed before diligence.",
      "Two. Outstanding share grants or notes. ESOPs promised but not papered. SAFEs or convertible notes that should have converted at the last round but were forgotten. These show up in three out of four audits.",
      "Three. Audited financials that don't quite reconcile with the management accounts. The auditors made restatement adjustments at year-end that nobody told the FP&A team about. The model in the IM uses one set of numbers; the audited financials show another.",
      "Four. Customer concentration that the founder has been quietly worried about. Top customer is 40% of revenue. Founder has been hoping to dilute that before going to market. Audit forces the conversation: either dilute it now, or have a clean story for why investors should accept it.",
      "Five. Key-person risk that the cap-table doesn't capture. The technical co-founder has been threatening to leave for six months. The replacement is hired but not yet productive. Investors will ask. The honest answer requires a plan, not a denial.",
      "Six. Governance gaps. Board meeting minutes haven't been signed. Annual general meetings missed. ROC compliance behind by two filings. None of these are deal-killers but each one delays diligence by a week.",
      "Seven. Customer contracts that contain change-of-control clauses. A material customer can terminate the contract if the company's controlling shareholders change. In a Series A, this rarely triggers; in a Series C or an M&A scenario, it absolutely does. We start tracking these early.",
      "Eight. Side-letter agreements that the founder forgot about. Angel from the seed round was promised informational rights or veto rights via a side letter. The Series A investor's lawyer pulls every related-party document and finds it. Now the side letter has to be amended.",
      "Nine. Tax positions that look comfortable to the founder but uncomfortable to a diligence team. Aggressive depreciation, a related-party transaction that wasn't at arm's length, an undisclosed customer rebate booked above the gross-margin line. We flag these so the founder makes an informed call: disclose and explain, or restructure before going to market.",
      "The audit takes two days of focused work. The fixes take anywhere from two weeks to two months depending on what surfaces. The point is to find these things before the investor's lawyer does, when the conversation is still about whether to invest, not whether to renegotiate the price.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-01-28',
    readMinutes: 7,
    tag: 'Readiness',
    serviceSlugs: ['investment-banking'],
    thumbnailSrc: '/article-thumbs/fundraise-readiness-audit.jpg',
    thumbnailHook: "Nine cracks before diligence finds them.",
    thumbnailHookEmphasis: 'Nine',
    reviewerStatus: 'pending',
  },
  {
    slug: 'strategic-exit-vs-pe-buyout',
    title: 'Strategic exit vs. PE buyout: which conversation are you actually in?',
    excerpt:
      'They look similar from the founder side. They are not. The buyer cares about different things, pays in different shapes, and the post-deal life looks different.',
    body: [
      "A founder comes to us saying they have interest from a buyer. Half the time they describe a strategic exit. Half the time they describe a PE buyout. The two are often confused because the early conversation looks similar — a senior person from a large firm asking what your company does, what your numbers look like, what would it take to do a deal.",
      "Beyond the first meeting, they diverge sharply. Worth knowing which one you are in.",
      "Strategic buyers buy because the company fits inside a larger product or distribution story they care about. A SaaS company gets acquired by a larger SaaS company that wants the customer base. A specialty manufacturer gets acquired by a competitor consolidating regional market share. The math on the buy is partly the standalone value and partly the synergy value — what's it worth to the acquirer's existing business.",
      "Strategic buyers typically pay higher headline prices than financial buyers because they can rationalize cost synergies and revenue synergies into the valuation. They often pay in stock or a stock/cash mix because they want the founder to stay engaged through integration. The deal closes faster — typically four to six months from term sheet to close — because both sides know what they want.",
      "PE buyers buy because they think they can grow the company over five to seven years and sell it for a multiple of what they paid. The math on the buy is almost entirely about the standalone trajectory and the buyer's ability to apply operational leverage. There are no synergies to price in. The valuation is therefore tighter, the term sheet has more covenants, and the close takes longer — six to nine months is typical, with extensive diligence and a robust SHA negotiation.",
      "Post-deal life looks different too. Strategic exit: usually integration into the buyer's operating structure within twelve to eighteen months. Founders often stay for an earn-out period of one to three years and then move on. Mid-level team often gets absorbed; senior team is mixed. The brand may disappear within two years.",
      "PE buyout: the company stays standalone but with the PE firm in the chair. Operational leverage gets applied — new CFO, often new sales head. The KPIs change. The board changes. The founder is usually expected to stay for the full hold period (five to seven years) or until a transition CEO is in place. Higher headline cash component because the structure doesn't have the integration upside that justifies stock.",
      "Which one to pursue depends on what you actually want next. A founder who is done with the operating job and wants liquidity should probably take the strategic conversation. A founder who is excited to run the next stage with someone professionalising the company should take the PE conversation. We have seen wrong choices made on both sides — the founder who took the strategic deal and regretted being absorbed; the founder who took the PE deal and burned out a year later because the new operating cadence wasn't what they had imagined.",
      "What we do at the start of these engagements is a one-day clarifier. Founder articulates what they want next year, three years from now, and five years from now. We talk through what each deal type looks like in each of those windows. The right deal then becomes clearer. The wrong deal usually becomes obvious.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-02-01',
    readMinutes: 7,
    tag: 'M&A',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'esop-economics-for-founders',
    title: 'ESOP economics for founders: when to top up, how to model the dilution',
    excerpt:
      'ESOP is the most consequential cap-table line item that founders pay the least attention to. The top-up math at each round is where founders give away half a point at a time without noticing.',
    body: [
      "ESOPs are a topic where founders' instincts mostly serve them well. Generous grants for senior hires, fair grants for engineers, vesting on a standard four-year cliff. Where the math goes off is in how the pool gets refilled and when.",
      "The standard convention is that the ESOP pool size should be enough to cover the company's hiring through the next round. So if you are raising Series A and plan to hire 30 people over the next 18 months — including a CFO, a head of sales, and senior engineering hires — you size the pool accordingly. The pool sits on the cap-table as 'unallocated', and grants get carved out of it as hires happen.",
      "Here's where founders give away value. The investor in a Series A typically asks for the pool to be 'topped up' to the target size BEFORE the round closes. This is called a pre-money top-up. The economic effect: the top-up dilutes the founders and existing shareholders entirely, with no contribution from the new investor. The post-money valuation is calculated against a cap-table that already includes the larger pool.",
      "What this means practically: if your pool was at 8% and the investor asks for a top-up to 12%, that 4% comes entirely from the founders and existing investors. On a $25M post-money round, that's $1M of value transferred from founders to the (new and old) common-stock pool. The investor's percentage is unaffected.",
      "The negotiable point is whether the top-up is pre-money or post-money. Post-money top-up means the dilution is shared across the new investor too — and proportionally, that's a lot fairer to the founders. Most institutional investors will push for pre-money; some will accept post-money or a 50-50 split if you negotiate it.",
      "How to think about pool size: model what you actually need over the next 18 months. Senior hires get larger grants (1-3% range for C-level, 0.5-1.5% for VPs). Mid-level engineering hires might get 0.1-0.3%. Senior individual contributors get 0.2-0.5%. Add it up. Add 30% buffer for unplanned hires. That's your real pool need.",
      "Investors will usually quote a higher pool size than this analysis suggests. Their reasoning is reasonable — they don't want to be diluted by a top-up six months after the round closes. The pushback is to model the actual hiring plan and back the pool into it. A 10% pool is often defensible against a 15% ask.",
      "One more thing — refresh grants. Most ESOP plans contemplate refresh grants for tenured employees, typically every two to three years, in addition to the initial grant. These come out of the pool too, but they don't show up in initial cap-table modeling. Plan for them. A 30-person team three years in will absorb 2-3% of pool refresh, easily.",
      "ESOP economics is the cleanest place where partner-led readiness work pays for itself. The right pool size, the right top-up timing, the right grant structure — the dilution swing between an inexperienced founder negotiation and a partner-supported one is usually 1-3 percentage points of founder ownership. On a typical Indian Series A, that's $2-5M of value.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-02-06',
    readMinutes: 7,
    tag: 'Cap table',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'case-for-outside-banker',
    title: 'The case for hiring an outside banker — even when you have a great cap table',
    excerpt:
      "Founders with strong investor networks ask why they should pay a banker at all. The honest answer is not about access. It is about leverage and time.",
    body: [
      "The pushback we hear most often is some version of 'I know my investors, they know me, why do I need a banker'. It is a fair question. For some founders, the answer is they do not. For many, the answer is more textured than that.",
      "Take access first. Founders with strong networks usually have warm relationships with 5-15 investors. A banker working an active mandate runs outreach to 80-150 investors per round, segments them by fit, and surfaces the 10-20 that are actually in market for your stage and sector right now. The first number is your circle. The second is the addressable universe. Different things.",
      "Now take leverage. When you negotiate directly with one or two investors you have known for years, the conversation is constrained by the relationship. You will accept a slightly worse term sheet from the friendly investor than from a stranger because relationship maintenance has its own cost. A banker doing the same negotiation has no relationship to maintain — and can push harder on price, on preferences, on board composition, without it affecting the founder's relationship with the investor afterward. The investor pushes back at the banker, not the founder.",
      "Now take time. Running a real fundraise is roughly a four-month full-time job. Model, deck, IM, outreach, intro coordination, diligence Q&A, term sheet conversations, SHA negotiation. A founder running this themselves spends three months on it and is barely running the company during that period. Customer churn, ops issues, key hires — all suffer. The investors notice. The numbers reflect it. By the time the round closes, the company is in a weaker position than when the process started.",
      "A banker absorbs the operational load. The founder still pitches — investors want to meet the founder — but the rest of the work happens in the background. The company keeps running. Customer cohorts hold. The team isn't distracted by a process they cannot see. The numbers on the round-end snapshot are the numbers from a healthy company, not from a company that spent the last quarter raising.",
      "Three categories of founder should NOT hire a banker. Founders raising under $3M from existing investors — economics of a process don't work. Founders running a strategic, non-cash deal where the buyer is well-defined and the conversation is already structured. Founders who actively want to run the operational side of the fundraise themselves and have the bandwidth to do it well.",
      "The categories of founder who should: anyone raising primary or secondary above $5M; anyone selling the business; anyone whose round needs to be structured creatively (carve-outs, secondary, structured equity); anyone running a process with more than three or four interested parties.",
      "What we tell founders in the first scoping call is this: a banker is a $X cost, structured as retainer plus success fee. The question is whether the value we add — a wider investor map, a tighter term sheet, an unblocked founder for four months, a partner-supported diligence process — exceeds $X. For most founders raising above $5M, yes. For some, no. We tell people which group they are in honestly. No mandate is also a real answer.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-02-13',
    readMinutes: 6,
    tag: 'Capital strategy',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'safe-vs-ccps-india',
    title: 'SAFE vs CCPS in Indian early-stage rounds: which one actually fits',
    excerpt:
      'Founders ask for SAFEs because they read about them. Indian counsel quietly redrafts them as CCPS because FEMA and the Companies Act leave no other option. The mechanics matter — and so does the cap-table outcome.',
    body: [
      "Roughly one in three early-stage founders we sit down with opens with the same line. They want to do a SAFE. They've read about Y Combinator's instrument, talked to a peer who closed one in Delaware, and they like the idea of a five-page document and a ten-day close. They are about to be told by their lawyer that what they are signing is actually a CCPS. The translation happens quickly, often without much explanation, and the founder ends up with an instrument that looks similar on the cover page and behaves quite differently underneath.",
      "Worth understanding why.",
      "## Why SAFEs don't really fit India",
      "A SAFE — Simple Agreement for Future Equity — is, in its US form, neither debt nor equity. It is a contractual right to receive shares at the next priced round. No interest accrues. No maturity date. The investor wires money today, the company issues preferred shares later, and in the meantime the SAFE sits on the cap-table as a contingent claim.",
      "Indian law does not have a clean shelf for this kind of instrument. Two frictions surface immediately.",
      "**FEMA pricing guidelines.** If the SAFE investor is non-resident — which most early SAFE investors are — RBI's pricing rules under the FEMA Non-Debt Instruments Rules apply. Foreign capital coming into an Indian company has to convert into a permitted instrument at a price that is at or above the fair value determined under prescribed methods. A SAFE that promises shares at an undefined future price doesn't satisfy this. The instrument has to either be denominated as a convertible from day one, with a defined conversion mechanic, or it sits in a legal grey zone that no Big Four advisor will sign off on.",
      "**Companies Act, 2013 — Section 42 and 62.** Private placements of securities in India require a defined instrument, a board resolution authorising the issue, a return of allotment filed with the ROC within 15 days, and pricing that ties back to a valuation report from a registered valuer. A SAFE that doesn't allot shares at signing fails this on multiple counts. To make it work, Indian counsel typically restructures the instrument as a **Compulsorily Convertible Preference Share** — CCPS — issued at a defined price with a defined conversion ratio that adjusts at the next round.",
      "The economic intent of the SAFE survives. The legal form changes. The founder signs what looks like a SAFE on the term sheet and a CCPS subscription agreement at closing. Most don't notice the difference until something goes wrong.",
      "## What a CCPS actually is",
      "A CCPS is a preference share that must convert into equity by a defined trigger — either a next round, an IPO, or a longest-stop date typically set at 19 or 20 years from issuance. Three mechanics matter.",
      "**Conversion ratio.** The CCPS converts into a defined number of equity shares. The ratio is set at the next priced round, usually with a valuation cap and a discount that mirror SAFE economics. If the cap is ₹100 crore and the discount is 20%, the conversion price is the lower of (a) the next-round price per share applied to a ₹100 crore pre-money, or (b) the next-round price discounted by 20%. The CCPS holder ends up with whichever count of equity shares this calculation produces.",
      "**Dividend optionality.** Indian CCPS instruments must specify a dividend rate — even if nominal. Most early-stage CCPS carry a 0.0001% coupon that is functionally a placeholder. The Companies Act requires the rate be defined; founders sometimes wave it through without realising they've technically agreed to a preferential dividend that, in a year of profitability, the company is obligated to declare before any equity dividend.",
      "**Anti-dilution.** Most CCPS subscription agreements carry a broad-based weighted-average anti-dilution clause. SAFEs in the US version usually don't — the YC post-money SAFE adjusts only via the valuation cap. When Indian counsel converts the SAFE to a CCPS, the anti-dilution clause is often inserted as standard boilerplate. Founders rarely push back. They should.",
      "## The valuation-cap trap",
      "The single biggest pattern we see is founders signing a CCPS with a valuation cap they treat as a SAFE-style cap and discovering at the next round that the math is meaningfully different.",
      "Here's a concrete example. Founder raises ₹4 crore on a CCPS with a ₹40 crore valuation cap and a 20% discount. Twelve months later, Series A closes at a ₹120 crore pre-money valuation. The founder expects the CCPS holder to convert at the ₹40 crore cap — implying the holder owns roughly 10% post-conversion.",
      "What actually happens depends on how the CCPS subscription agreement defines the conversion mechanic. If it's a pre-money cap (US-style YC SAFE before the 2018 redraft), the holder converts at the cap price, but the share count is calculated against the pre-money cap-table. The dilution from the Series A then falls partly on the CCPS holder too. They end up with closer to 8% post-Series A.",
      "If it's a post-money cap (post-2018 YC SAFE), the holder is protected from Series A dilution. They convert into a defined percentage of the post-money cap-table — closer to 10% — and the founders absorb the dilution.",
      "Indian CCPS subscription agreements are written by lawyers who default to whatever boilerplate sits in their templates. Some are pre-money. Some are post-money. Some are ambiguous in a way that gets litigated at the Series A. The founder signed without checking. The CCPS holder's lawyer reads the document at conversion and asserts the interpretation that benefits their client.",
      "> The valuation cap is not just a ceiling. It is a definition of which side of the cap-table absorbs the next round's dilution. Read it like that.",
      "## When a SAFE still works",
      "There are narrow scenarios where a true SAFE is the right instrument.",
      "**Foreign holding company structures.** If the company has a Delaware or Singapore parent that owns the Indian operating subsidiary, the SAFE can be issued at the parent level under that jurisdiction's law. The Indian operating company is unaffected. This is the standard structure for Indian founders building global products who set up a Delaware C-corp on day one. The SAFE is genuinely a SAFE, governed by Delaware law, with Y Combinator's standard form.",
      "**Mauritius or Singapore investor routing.** A non-resident investor coming through a Mauritius or Singapore vehicle, investing into an Indian company, still hits FEMA pricing rules. The SAFE doesn't help here. The conversion to CCPS is unavoidable. We see founders assume the offshore routing changes the answer; it doesn't.",
      "**Internal bridge from existing shareholders.** Existing Indian shareholders putting in a small bridge that will convert at the next round can sometimes use a convertible note structure — issued under Section 62(3) — that approximates SAFE economics without the foreign-investor friction. This is the closest Indian-law-native analogue to a SAFE for resident capital.",
      "## A cleaner mental model",
      "Stop thinking about SAFE versus CCPS. Think about three questions, in order.",
      "First — where does the money come from. Resident Indian capital, non-resident capital, or a mix. The answer narrows the instrument set immediately.",
      "Second — what's the conversion mechanic. Pre-money cap, post-money cap, or a fixed conversion price. Each has different cap-table consequences at the next round.",
      "Third — what protections does the investor get between signing and conversion. Anti-dilution, information rights, transfer restrictions, pro-rata. These get drafted into the CCPS subscription agreement and most founders never read them.",
      ":::insight A SAFE that lands in India and gets converted to a CCPS without these three questions answered ends up as a worse-than-SAFE instrument — same close speed, more boilerplate protections for the investor, and a cap-table that nobody quite understands. Get the conversion right at signing, not at the next round. :::",
      "## A worked cap-table example",
      "Walk this through with the numbers visible. Pre-CCPS cap-table: founders 100%. Company raises ₹4 crore on a CCPS with a ₹40 crore valuation cap and a 20% discount. The CCPS sits on the cap-table as a contingent instrument; no equity dilution happens at signing, though the instrument is recorded under preference share capital.",
      "Twelve months later, Series A closes. Headline: ₹30 crore raised at ₹120 crore pre-money, ₹150 crore post-money. New investor takes 20% of the post-money cap-table.",
      "CCPS conversion mechanic kicks in. Two possible prices: (a) cap-implied price, calculated as ₹40 crore divided by the fully-diluted share count at conversion; (b) discounted next-round price, calculated as the Series A price per share multiplied by 0.80. Whichever is lower binds.",
      "In a healthy up round, the cap-implied price is almost always lower. The CCPS holder converts at the cap, taking a share count equivalent to roughly 10% of the pre-Series A cap-table (₹4 crore at ₹40 crore implied valuation = 10%). The Series A then dilutes everyone, including the converted CCPS holder, by the new 20% taken by the lead.",
      "Post-Series A cap-table: founders roughly 72%, CCPS holder roughly 8%, Series A lead 20%. The CCPS holder's effective ownership after the Series A dilution is lower than the 10% the cap implied — because the cap was pre-money relative to Series A.",
      "If the same CCPS had been written with a post-money cap mechanic — the holder converts into a fixed 10% of the post-Series A cap-table — the founder dilution would have been higher. Founders roughly 70%, CCPS 10%, Series A 20%. The 2 percentage-point swing on the founder slice is exactly the dilution the CCPS holder is protected from under the post-money structure.",
      "Neither is right or wrong. Both are defensible. The point is to choose deliberately, document the choice, and model the cap-table under both interpretations before signing.",
      "## What we run with founders at engagement",
      "Two-hour working session. Pull the draft term sheet, the SAFE template the founder thinks they're signing, and the subscription agreement Indian counsel is drafting. Walk through each clause and compare. Identify where the economic intent diverges. Where it does, redraft the subscription agreement before signing — not after.",
      "Most founders save 1–3 percentage points of ownership at the next round through this exercise. Nobody who has done it has called it wasted time.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-02-20',
    readMinutes: 9,
    tag: 'Convertibles',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
    references: [
      {
        label: 'Companies Act, 2013 — Section 42 (Private placement)',
        href: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html',
      },
      {
        label: 'FEMA Non-Debt Instruments Rules, 2019',
        href: 'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=11723',
      },
      {
        label: 'Companies Act, 2013 — Section 62 (Further issue of share capital)',
        href: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html',
      },
    ],
  },
  {
    slug: 'pre-money-vs-post-money-confusion',
    title: 'Pre-money vs post-money: the 2-3% equity that quietly costs founders the round',
    excerpt:
      'Founders agree to a pre-money number, sign a term sheet, and discover at closing that the ESOP top-up was carved out of their slice — not the round. Two or three percentage points later, the lesson is expensive.',
    body: [
      "The valuation conversation in a term sheet has two numbers. Pre-money and post-money. Most founders treat them as interchangeable shorthand for 'the price'. Investors do not. The gap between the two is exactly the new money coming in — and the rules for how the ESOP pool, the founders, and the new investor share that gap is where 2-3 percentage points of founder ownership go missing, every round.",
      "Worth slowing down on.",
      "## The investor's math",
      "An investor running their model thinks in post-money percentages. They have a check size — say ₹40 crore. They want a defined ownership stake — say 20%. The post-money valuation is the check size divided by the target ownership: ₹40 crore / 0.20 = ₹200 crore post-money. The pre-money falls out: ₹200 crore minus ₹40 crore = ₹160 crore.",
      "From the investor's side, the conversation is about post-money. Every other clause in the term sheet — liquidation preference, anti-dilution, pro-rata — is sized off the post-money number. They are buying 20% of the company at closing. Everything else follows from that.",
      "## The founder's instinct",
      "A founder hears 'pre-money valuation of ₹160 crore' and thinks: the company is worth ₹160 crore today, the investor is adding ₹40 crore, my share of the new ₹200 crore is whatever percentage I owned before, applied to the new cap-table.",
      "That's the right starting point. The problem is the **ESOP top-up**.",
      "## Where the 2-3% disappears",
      "Almost every Series A and Series B term sheet contains a clause that says something like: 'Prior to closing, the company shall expand its ESOP pool such that the fully-diluted post-closing cap-table reflects an unallocated pool of [10% / 12% / 15%].'",
      "Read carefully. The pool expansion happens **before closing**. The post-money cap-table includes the new, larger pool. The new investor's 20% is calculated against a cap-table that already reflects the expansion.",
      "Effect on the founders: the dilution from the pool top-up is borne entirely by the existing shareholders. The new investor takes their 20%; the ESOP pool is now bigger; the founders' slice has been reduced by exactly the increase in pool size, with no contribution from the new money.",
      "### A clean example",
      "Pre-round cap-table — founders 80%, ESOP pool 8% (fully allocated), Series Seed investor 12%. Founders are negotiating a Series A. Term sheet: ₹40 crore at ₹200 crore post-money, with the pool topped up to 12%.",
      "Naive founder math: post-money cap-table is investor 20%, ESOP 12%, founders and seed split the remaining 68% in roughly the same ratio as before — founders end up at about 59%.",
      "Actual math: the pool top-up of 4 percentage points (from 8% to 12%) comes off the pre-money cap-table before the investor's 20% is sized. The founders and seed investor are diluted from 92% combined to 88%. Then the new investor takes 20%, leaving the rest at 80%. Founders end up at roughly **56%**.",
      "Difference: about **3 percentage points**, or ₹6 crore of value at the closing valuation.",
      "## Pre-money pool top-up vs post-money",
      "The clean fix is to negotiate the pool top-up as a **post-money** event rather than a pre-money one. Mechanically, this means the pool expansion is sized off the post-money cap-table, and the dilution is shared between the new investor and the existing shareholders in proportion to their respective stakes.",
      "Same example, post-money pool top-up: the pool goes from 8% to 12%, taking 4 percentage points off the post-money cap-table. The new investor's 20% is diluted to roughly 19.2%. The founders' share of the dilution is correspondingly smaller. Founders end up at roughly **58%** — still down from 59%, but the gap to the naive estimate is much smaller.",
      "Most institutional investors will push for pre-money top-up because it's the market standard and because it protects their headline ownership stake. The founder pushback we typically advise is a 50-50 split — pool top-up dilution shared half pre-money, half post-money. This is achievable in most rounds where the founder has a reasonable BATNA and a competent banker in the room.",
      "## The fully-diluted question",
      "The single sentence every founder should know how to ask, when an investor quotes a valuation:",
      "> Is that fully diluted, including the new ESOP top-up, on a post-money basis?",
      "The answer changes the math. If the investor says yes — fully diluted including top-up, post-money — then the headline number is honest, and the founder can model the dilution accurately. If the answer is pre-money including top-up, the founder needs to back out the implicit value transfer and either negotiate it explicitly or push back on the headline number to compensate.",
      "The investors who answer this question clearly are the ones worth working with. The investors who hedge — who say 'standard terms' or 'we'll figure it out at closing' — are usually planning to win the ambiguity later. We have watched the same conversation play out enough times that the pattern is unmistakable.",
      "## What good investors will tell you up front",
      "Worth noting the inverse signal. Investors who proactively walk through the pool top-up math at the term sheet meeting — explaining that the top-up is pre-money, showing the founder the dilution implication, and offering a half-split as a goodwill gesture — are usually the better long-term partners. They're telling you what they're doing because they expect you to live with the consequences for the next five years, and they'd rather have an aligned founder than a surprised one.",
      "This is a useful screen at term sheet stage. The investor who explains the math is signalling something about how they'll behave in board meetings, in reserves discussions, in down-round conversations. The investor who hopes you won't ask is signalling something too.",
      "We have walked away from terms with 'better' headline valuations because the investor's behaviour during the pool top-up conversation revealed a pattern we didn't want to live with. Not every founder has the luxury of choosing. But when there's choice in the room, the pool top-up conversation is one of the cleanest signals available.",
      "## The other place this confusion shows up",
      "Bridge rounds and convertibles. When a CCPS converts at the next round, the conversion price depends on whether the cap is pre-money or post-money. Same vocabulary, similar trap. We wrote about this in the SAFE-vs-CCPS piece — same underlying issue, different instrument.",
      "And secondary tranches. When part of a round is secondary (existing shareholders selling), the secondary doesn't go into the post-money calculation, but it dilutes the founder's ownership without being matched by new capital coming into the company. Founders sometimes treat the secondary tranche as 'investor money in' for valuation purposes. It isn't. The primary tranche sets the post-money; the secondary is a side trade.",
      ":::insight The 2-3% swing is almost always recoverable if you ask the right question at term sheet, in the right order. The order is: (1) is the headline pre-money or post-money? (2) is the pool top-up pre-money or post-money? (3) does the term sheet's fully-diluted reference include unissued options? Without these three answers, the closing cap-table is going to surprise you. :::",
      "## Why this gets harder at Series B",
      "The pool top-up game compounds across rounds. At Series A, the typical top-up is 4-5 percentage points. At Series B, the investor usually wants the pool refilled to roughly the same target — sometimes 10%, sometimes 12% — to support the next 18 months of hiring. The amount of the top-up depends on how much of the pool was issued during the Series A period.",
      "If the company hired aggressively post-Series A and the pool is nearly depleted, the Series B top-up could be another 6-8 percentage points. If hiring was lean, the top-up might be 2-3 points. Either way, the same pre-money vs post-money negotiation repeats.",
      "What founders sometimes forget: the cumulative effect of pre-money top-ups across two rounds can easily be 5-7 percentage points of founder dilution that wouldn't have happened under a post-money structure. By Series C, the founder is meaningfully diluted by a mechanism they never deliberately agreed to.",
      "We track this in the cap-table audit we run before any round. Show the founder the pool dilution they've already absorbed from prior rounds, alongside the dilution they're about to absorb. The combined number is usually the moment the conversation gets serious.",
      "## What we do in the room",
      "Before any term sheet gets signed, we build the founder a side-by-side model. One column shows the cap-table the investor is proposing. The second shows the same valuation with a post-money pool top-up. The third shows a 50-50 split. The fourth shows what the founder thought they were signing, based on the naive reading.",
      "The four columns are usually 2-4 percentage points apart on founder ownership. Showing them in one view changes the conversation in the negotiation. The investor is no longer talking to a founder who thinks 20% means 20%. They are talking to a founder who has already modelled three structures and is asking which one the investor wants to defend.",
      "That single shift in the conversation is worth the entire banker engagement, in most rounds we run.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-03-02',
    readMinutes: 9,
    tag: 'Cap table',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'bridge-rounds-save-or-signal-trouble',
    title: 'Bridge rounds: the convertible that saves you, or signals you ran out of runway',
    excerpt:
      'A bridge done right gives you the eight months you needed to hit the metric that prices the next round. A bridge done wrong tells every investor in town the previous round was mis-sized. The difference is in how it gets structured, not in how much it raises.',
    body: [
      "A bridge round is the most misunderstood instrument in the early-stage toolkit. Half the founders who close one describe it as a victory — they bought time, they hit the milestone, they priced the next round at a higher number than they would have otherwise. The other half describe the same instrument as the moment the wheels started to come off — investors smelled weakness, the next round took eighteen months instead of six, and the eventual price was a flat round at best.",
      "Same instrument. Different outcomes. The variable is preparation.",
      "## What a bridge actually is",
      "A bridge round is a convertible financing — usually structured as CCPS or a convertible note — designed to extend the company's runway between two priced rounds. The capital comes in now; the shares are issued at the next priced round, at a discount or a cap to that round's price.",
      "The economic logic is simple. The company doesn't have the metric yet to justify the price it wants for the Series B (or C, or Series A depending on stage). It needs another 6–9 months of operating runway to hit that metric. Going to market now at the current numbers gets a flat round or worse. A bridge gives the company that time, with the bridge investors getting a preferred price for taking the early risk.",
      "## The two flavours",
      "Two structures dominate.",
      "**Discount-based.** The bridge investor converts at a defined percentage discount to the next round's price per share. Twenty percent is market standard; we sometimes see 15% on a tight bridge or 25-30% on a longer or riskier one.",
      "**Cap-based.** The bridge investor converts at the lower of (a) the next round's price, or (b) a price per share implied by a defined valuation cap. The cap is usually set at the company's current implied valuation or slightly above, on the theory that the bridge investor should at minimum get the price the company is worth today, with upside if the next round prices higher.",
      "Most bridges combine both. **Cap and discount**, whichever is lower. The bridge investor's effective conversion price is the more favourable of the two mechanisms. Founders often agree to this without modelling out which of the two will bind — and usually, the cap binds, because the discount only matters if the next round prices below the cap implied price.",
      "## When a bridge works",
      "We have run bridges that closed in three weeks, with existing investors taking 70% of the round and a small new check from a strategic angel completing it. Those bridges saved companies. The pattern is consistent.",
      "**Defined milestone.** The bridge is sized to a specific revenue or KPI target that will price the next round. Not 'more growth'. A specific number — ARR of ₹X crore, monthly active users of Y, a marquee customer signed. The investors know what the milestone is. The founder knows it. The board knows it. The bridge round is sized to give the company enough runway to hit that target with margin.",
      "**Existing investors lead.** When existing investors put in at least half the bridge, the signal to the market is positive. The people closest to the company chose to commit more capital. New investors at the next round read this as confidence.",
      "**Tight pricing.** Cap set at or modestly above the previous round's price. Discount in the 15–20% range. Not a punitive structure designed to extract maximum value from the company's vulnerability — a structure that reflects that the existing investors believe the next round will price meaningfully higher.",
      "**Short conversion window.** Bridge investors expect the next round to happen within 6–9 months. If the conversion window stretches to 18 months or longer, the bridge starts to look less like a bridge and more like a permanent overhang on the cap-table.",
      "## When a bridge signals trouble",
      "The other version. Same instrument, different surrounding fact pattern.",
      "**No defined milestone.** The bridge is sized to 'extend runway'. When a new investor at the next round asks what specifically the bridge was meant to achieve, the founder cannot answer cleanly. The signal: the company doesn't have a clear path to the next round. It's buying time, not building toward a milestone.",
      "**Existing investors don't participate or participate token amounts.** This is the loudest possible signal. The investors who know the company best are not putting in more money. New investors at the next round read this as a lack of conviction, and they're usually right.",
      "**Aggressive pricing.** Cap set below the previous round's price. Or a large discount (25%+) combined with a low cap. The bridge investors are extracting protection because they believe the next round may price flat or down. This protection comes off the founder's slice.",
      "**Long or undefined conversion window.** Bridge has a 24-month longest-stop date with no defined trigger event. The bridge investors aren't expecting a clean next round; they're hedging.",
      "## The bridge-to-nowhere",
      "There is a specific failure mode worth naming. The company raises a bridge, burns through it over 12 months, hits some but not all of the planned milestones, and then needs another bridge. The second bridge is harder to raise — existing investors have already extended once, and the metrics haven't moved enough to justify a priced round.",
      "The second bridge usually has worse terms than the first. Lower cap, higher discount, often with new structural protections (super pro-rata, ratchet, drag-along reservations) that the founder accepts because they have no other option.",
      "By the time a third bridge is needed, the company is in a managed wind-down or a forced sale. We have watched this trajectory play out half a dozen times. The first bridge looked fine. The second was the warning. The third was the failure.",
      "> The question on a bridge is never 'can we raise it'. It's 'do we know what we're raising it for, and do we believe the milestone is achievable within the runway it provides'. If the answer to either is unclear, the bridge will not save the company. It will just delay the conversation.",
      "## Pricing the next round on bridge conversion",
      "An underrated complexity. When the bridge converts at the next round, the conversion mechanic interacts with the next round's anti-dilution clause in ways that surprise founders.",
      "Example. Bridge of ₹10 crore at a ₹100 crore cap, 20% discount. Next round closes 9 months later at ₹150 crore pre-money. Bridge converts at the cap (since the cap-implied price is lower than the discounted next-round price). Bridge investor's effective ownership: roughly 9% post-conversion before the new round.",
      "The new investor's anti-dilution clause, if it's broad-based weighted-average, treats the bridge conversion as part of the dilutive issuance. This means the existing pre-bridge shareholders (founders, seed investors, Series A investors) absorb the bridge's dilution. The new investor's 20% is calculated against a cap-table that already includes the converted bridge.",
      "If the founder didn't model this in the bridge term sheet — and most don't — the result is a Series B (or Series C) cap-table that has 3-5 percentage points less founder ownership than the founder expected.",
      "## Who should take a bridge from existing investors",
      "Existing investors leading a bridge is the right pattern when they have meaningful reserves earmarked for the company. Most institutional funds size their reserves at 1.5x to 2x of the initial check, specifically to support bridge and follow-on rounds. If the fund has reserves and the company is on a defensible trajectory, the bridge is a natural extension of their commitment.",
      "Existing investors leading a bridge is the wrong pattern when they're putting in money to protect their existing position rather than because they believe in the trajectory. This is sometimes called 'good money after bad' — the investor doesn't want to mark down the position, so they extend the runway to delay the markdown. It's a defensive move, not a growth move.",
      "Founders often can't tell the difference in the moment. The conversation looks similar from the company's side. The way to distinguish: ask the lead investor to commit to participate in the next priced round at a defined minimum amount. If they will, the bridge is a growth play. If they won't, it's defensive.",
      ":::watch Bridges are not bad. Bridges done without a clear milestone, without existing-investor leadership, or without a modelled view of how they convert at the next round are almost always bad. The instrument is neutral. The preparation is what determines the outcome. :::",
      "## What we do at engagement",
      "Two things, before any bridge term sheet gets signed. First, build the next-round model with the bridge converted, under three scenarios — flat next round, modest up round, strong up round. Show the founder the cap-table in each. Second, run the conversation with existing investors first. Their willingness to lead or participate is the single best signal we have for whether the bridge will work.",
      "If the existing investors won't lead, we usually advise the founder to skip the bridge and either (a) cut burn aggressively to extend runway organically, or (b) go straight to a priced round at the current numbers, even if the price is disappointing. A flat priced round is almost always cleaner than a defensive bridge.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-03-06',
    readMinutes: 10,
    tag: 'Bridge round',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'pro-rata-rights-series-b',
    title: 'Pro-rata rights at Series B: what they actually mean when the round opens',
    excerpt:
      'The Series A investor signed a pro-rata clause two years ago. The Series B lead wants the full round. Whose right wins, and what the founder should actually push for, depends on details most founders never read.',
    body: [
      "Pro-rata rights are one of the most consequential and least negotiated terms in an early-stage SHA. Founders sign them at Series A because they look like a polite courtesy — the existing investor gets a right to maintain their percentage. Two years later, at Series B, the same clause becomes the variable that decides how big the round is, who leads it, and how much new dilution the founders take.",
      "Worth understanding what the clause actually does.",
      "## The mechanic",
      "A pro-rata right is the right of an existing investor to participate in a future priced round to the extent necessary to maintain their existing fully-diluted percentage. If the Series A investor owns 18% post-Series A, and the Series B round is ₹100 crore, the pro-rata holder has the right to invest ₹18 crore of that ₹100 crore, on the same terms as the lead investor.",
      "The right is asymmetric. The investor can exercise it or waive it. They don't have to invest. If they waive, the full ₹100 crore is available for the Series B lead and other new investors. If they exercise, the round size available for new investors is reduced by the pro-rata amount.",
      "## Why the Series B lead wants the pro-rata waived",
      "When a Series B lead is negotiating the round, they typically want to take as much of the round as possible. There are several reasons.",
      "**Concentration economics.** A Series B fund running a $30M check size into a $50M round wants to take the lead position with a meaningful percentage. If the Series A investor exercises full pro-rata, the round needs to be larger (which dilutes the company more) or the new investor's check needs to be smaller (which is uneconomic for the fund).",
      "**Information rights and board influence.** The Series B lead expects a board seat and the standard information rights. If the Series A investor exercises pro-rata, they retain their existing rights too — meaning two preferred holders with overlapping protections. Most Series B leads prefer a cleaner cap-table where their position is the dominant new preferred class.",
      "**Reserve preservation.** The Series B fund has its own reserve allocation for the next round (Series C). If they have to lead a smaller round at Series B to accommodate Series A pro-rata, they have less optionality at Series C. Funds value optionality.",
      "## Why the Series A investor fights to keep it",
      "From the Series A side, pro-rata is one of the most valuable rights in the SHA. The reasons mirror the Series B lead's.",
      "**Maintaining ownership in the winners.** Most early-stage funds make their returns on a small number of breakout investments. Pro-rata at later rounds is how they double down on those winners without competing for allocation against new investors. If the company is doing well at Series B, the Series A investor wants their full pro-rata allocation. Waiving it means accepting dilution exactly when they don't want to.",
      "**Signal to LPs.** Funds that demonstrate they can exercise pro-rata in their portfolio's later rounds look better to their own LPs. It signals conviction and reserve discipline. Waiving pro-rata in a hot round looks like the fund either ran out of reserves or didn't believe in the company.",
      "**Board dynamics.** The Series A investor's board seat is usually tied to a minimum ownership threshold. Significant dilution at Series B without a pro-rata exercise can drop them below that threshold, costing them the seat.",
      "## The founder's view",
      "Founders often treat pro-rata as a fixed feature of the cap-table and don't think about how it affects round dynamics. They should.",
      "The total dilution to founders at Series B is largely fixed by the size of the new investor's check and the post-money valuation. Whether the Series A investor exercises pro-rata or not doesn't change founder dilution. What it changes is the **composition** of the round — how much is new money from new investors versus follow-on money from existing investors.",
      "Where this matters is in round size discipline. If the Series A investor commits to exercise full pro-rata, the company can structure a larger round at the same valuation, because there's pre-committed capital from a known investor. If the Series A investor is wavering, the company has to negotiate the round size against the Series B lead's appetite for the whole thing.",
      "### A practical example",
      "Company is targeting a ₹100 crore Series B at ₹500 crore pre-money. Series A investor owns 18% and has full pro-rata. Series B lead wants to write a ₹80 crore check at minimum.",
      "Option 1: Series A waives pro-rata. Round is ₹100 crore, Series B lead takes ₹80 crore (16% post-money), other new investors take ₹20 crore (4%). Founders dilute 20% in aggregate. Series A drops from 18% to 15%.",
      "Option 2: Series A exercises full pro-rata. Round needs to be ₹120 crore to give Series B lead ₹80 crore and Series A their ₹22 crore. Founders dilute roughly 20% in aggregate. Series A maintains 18%.",
      "Option 3: Series A exercises half pro-rata. Round is ₹110 crore. Series B lead ₹80 crore, Series A ₹11 crore, new investors ₹19 crore. Founders dilute about 20%. Series A drops to 16.5%.",
      "Founder dilution is roughly the same across all three. The cap-table composition is different. The dynamics around who has board seats and information rights are different. The fund returns for the Series A are very different.",
      "## Super pro-rata",
      "Some Series A investors negotiate a **super pro-rata** right — the right to invest more than their pro-rata percentage in a future round. The mechanic varies. Sometimes it's a defined right to take an additional 5-10 percentage points beyond pro-rata. Sometimes it's a right of first offer on any portion of the round that other investors don't take up.",
      "Super pro-rata is rare in standard Indian Series A deals but shows up in Series B and Series C where the company is clearly accelerating and the investor wants to load up their position. It's also seen in growth-stage rounds where the lead investor has reserve capacity and conviction.",
      "From the founder's view, super pro-rata makes future rounds harder to structure. It compresses the room for new investors and concentrates the cap-table further. We typically advise founders to push back hard on super pro-rata at Series A and accept it only at Series B or later, when the company has more leverage and a clearer growth trajectory.",
      "## Pro-rata vs right-of-first-refusal",
      "Two clauses that get confused.",
      "**Pro-rata** is a primary-issuance right. It lets the investor participate in **new** share issuances by the company at the next round. The mechanic is straightforward — at the next priced round, the existing investor has the right to take their pro-rata percentage of the new issuance on the same terms as the lead.",
      "**Right-of-first-refusal (ROFR)** is a secondary-market right. It applies when an existing shareholder wants to **transfer** shares to a third party. The ROFR holder has the right to match the third-party offer and acquire the shares themselves. This matters for founder secondary sales, employee share transfers, and angel exits.",
      "Both are common in early-stage SHAs. They have different triggers and different effects. Confusing them — or worse, accepting boilerplate language that conflates them — produces edge cases that surface only when a transfer or a new round happens.",
      "## Who actually exercises pro-rata",
      "In a hot round, most existing investors exercise full pro-rata. The signal value alone makes it worth doing. In a less hot round, exercise patterns are more variable.",
      "Funds that have raised a new vintage and have fresh reserves are more likely to exercise. Funds that are at the end of their reserve allocation are less likely. Funds that have already taken a markup on the position in their internal valuation are less likely to want to add to it at the new round's price.",
      "We sometimes see existing investors negotiate a **partial exercise** — taking half their pro-rata allocation, for instance — to preserve some reserves and demonstrate continued conviction without fully committing. This is a reasonable compromise in many situations.",
      ":::insight Pro-rata isn't just a clause. It's a coordination problem between three parties — existing investors who want to maintain position, new investors who want to lead the round, and founders who want a clean cap-table and a well-resourced company. The founder's job is to facilitate that coordination, not to leave it to be negotiated in the last week before closing. :::",
      "## What we do at the round",
      "Two weeks before going to market, we run a pro-rata canvass with every existing preferred holder. Ask them directly — will they exercise full pro-rata, partial, or waive. Get the answer in writing. Use it to structure the round size and the targeted new-investor allocation.",
      "If the existing investors say full pro-rata, we plan a larger round. If they say partial, we plan accordingly. If most are waiving, we know the new investors have to absorb the full check and we adjust the round size and the new-investor pitch accordingly.",
      "Doing this work upfront, before the term sheet conversation with the Series B lead, gives the founder a coherent answer to the lead's first question. 'How much of this round is pre-committed?' is a question every Series B lead asks. The founder who can answer with specifics wins the round on better terms. The founder who has to figure it out as they go loses leverage from the first meeting.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-03-12',
    readMinutes: 10,
    tag: 'Term sheet',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'founder-vesting-and-re-vesting',
    title: 'Founder vesting: why VCs ask for re-vesting at Series A, and how to negotiate',
    excerpt:
      'You started the company four years ago. The investor is offering a Series A term sheet that requires you to put your already-earned shares back on a four-year vesting schedule. Why this happens, and what good negotiation actually looks like.',
    body: [
      "Founder vesting is the term sheet clause that produces the strongest emotional reaction in any negotiation we run. The investor's lawyer drafts standard language — four-year vesting, one-year cliff, starting at the closing of the round. The founder reads it and the obvious question lands: I've been working on this company for three years. Why are you putting my shares back on a schedule like I just joined?",
      "It's a reasonable question. The answer requires understanding what the clause actually protects against, why it's standard market practice, and where the actual negotiation room is.",
      "## What vesting protects against",
      "The investor's concern is straightforward. If a founder leaves the company shortly after the round closes, they walk away with a meaningful percentage of the cap-table that they're no longer earning. The remaining founders and the company are diluted by an absent shareholder, which is awkward at best and crippling at worst.",
      "Vesting is the mechanism that links continued shareholding to continued service. If the founder leaves, the unvested portion of their shares is repurchased by the company at a nominal price (usually par value or the original issue price). The vested portion stays with the founder.",
      "Without vesting, a co-founder leaving in year two of a five-year journey takes their full equity stake with them. With vesting on a four-year schedule, they leave with about 25-50% of their stake, depending on the cliff structure.",
      "## Why VCs ask for it at Series A — even when founders have tenure",
      "Most Indian founders don't put themselves on a formal vesting schedule at incorporation. The founders' shares are issued as ordinary equity at par value, with no transfer restrictions or vesting overlay. The founders treat each other on trust — if someone leaves, they'll work it out.",
      "This works fine when there's no outside capital. The moment there's institutional capital, the calculus changes. The investor is funding the company on the assumption that the founders will be there to execute. They want a contractual mechanism to enforce that, not a verbal commitment between the founders.",
      "Hence the standard ask at Series A: founders' shares get put on a four-year vesting schedule, with a one-year cliff. If a founder leaves before year one, they vest zero shares (the cliff bites). After year one, vesting accelerates monthly or quarterly until the full four years are complete.",
      "**Re-vesting** is what makes this controversial. Even if a founder has already been at the company for three years, the four-year vesting clock typically resets at the round closing. The founder's pre-existing tenure doesn't automatically count.",
      "## How to negotiate",
      "The clause is negotiable. The starting point matters less than the structure of the conversation.",
      "### Credit for past tenure",
      "The most common founder ask is credit for time already served. If you've been at the company for three years pre-Series A, you ask for three years of vesting credit, which means the four-year schedule has effectively one year remaining post-closing.",
      "Investors push back on full tenure credit because it removes the lock-in entirely. The compromise we typically negotiate is **partial tenure credit** — for example, 50% of past tenure counts toward the vesting schedule. Three years of past tenure becomes 1.5 years of credit, leaving 2.5 years of forward vesting post-closing.",
      "The specific numbers vary by round dynamics and founder leverage. We have negotiated 100% credit (rare, requires strong leverage), 50% credit (common), and 0% credit (frequent at hot rounds where the founder accepts the standard schedule to preserve other terms).",
      "### Reducing the cliff",
      "The one-year cliff is the most uncomfortable feature for tenured founders. Three years in, asked to put your equity at risk of zeroing out if you leave in the next twelve months, feels punitive.",
      "Negotiate the cliff down or out. Six-month cliff is achievable in many rounds. No cliff at all is achievable in some, particularly when paired with partial tenure credit.",
      "### Acceleration on change of control",
      "Acceleration is the founder-friendly counterweight to vesting. It governs what happens to the unvested portion of founder shares if the company is acquired before the vesting schedule completes.",
      "**Single-trigger** acceleration: 100% of unvested shares vest immediately upon a change of control (acquisition). This is founder-friendly. The acquirer cannot use the threat of termination to extract value from the founder post-acquisition.",
      "**Double-trigger** acceleration: 100% of unvested shares vest upon a change of control **only if** the founder is terminated without cause or resigns for good reason within a defined window (usually 12-18 months) post-acquisition. The acquirer can retain the founder under reasonable terms; if they terminate, the founder accelerates.",
      "Double-trigger is the market standard for institutional rounds. Single-trigger is achievable but less common; it's most often won by founders with strong negotiating positions or by founders raising from less price-sensitive strategic investors.",
      "The clause that founders sometimes miss is the **definition of 'good reason'** in the double-trigger language. Good reason should include material reduction in title or scope, material reduction in compensation, relocation beyond a defined distance, and breach of the founder's employment agreement. Getting this list right is the difference between a meaningful protection and a hollow one.",
      "## A concrete example",
      "Founder has been at the company four years. Pre-Series A cap-table: founders 70% (split between two co-founders), seed investors 22%, ESOP pool 8%.",
      "Series A term sheet: ₹50 crore at ₹200 crore post-money. Investor takes 25%. Founders dilute to roughly 52% combined.",
      "Vesting clause as drafted: four-year forward vesting from closing, one-year cliff, double-trigger acceleration.",
      "Negotiated outcome: 50% credit for past tenure (so 2 years of effective credit), six-month cliff, double-trigger acceleration with a tightly defined 'good reason' clause. Effective vesting schedule: two years of forward vesting from closing, with the first six months as a cliff.",
      "This is achievable in most well-run Series A processes. The negotiation takes one term-sheet round-trip and adds maybe a week to the closing timeline. The economic value to the founder, if they were to leave the company in year three post-closing, is the difference between vested ownership of 65% of the founder's slice (under the original draft) and 100% (under the negotiated version). For a 26% founder slice, that's about 9 percentage points of the cap-table — meaningful capital.",
      "## What about the tax implications",
      "Two areas matter.",
      "**Vesting buybacks.** If a founder leaves before fully vesting, the unvested shares are repurchased by the company. The repurchase price is usually nominal — par value or the original issue price. The departing founder may have a tax event if there's any gain between the issue price and the repurchase price (rare in practice).",
      "More importantly, the company has to fund the repurchase. If the cap-table has been issued at par value and the buyback is at par, the cash outlay is minimal. If the founder's shares were issued at a higher price (uncommon for founders, more common for early hires), the buyback can be a meaningful cash event for the company.",
      "**ESOP-style mechanics for vested-but-unexercised options.** This applies more to early hires than founders directly, but it's worth flagging — the language in the founder vesting agreement should clarify whether vested shares are held outright or held subject to repurchase under defined circumstances (e.g., termination for cause). Most well-drafted agreements distinguish clearly between unvested (repurchaseable at par) and vested (held outright); poorly drafted ones blur the line.",
      "**Section 17(2)(vi) perquisite tax.** This applies when ESOPs are exercised by employees, not directly to founder vesting. But founders sometimes structure a portion of their equity as ESOP grants for liquidity or tax planning reasons. If they do, the perquisite tax under Section 17(2)(vi) of the Income Tax Act applies on exercise — the difference between the fair market value at exercise and the exercise price is taxed as salary income. Indian founders working from India should model this carefully; founders working from a jurisdiction with different tax treatment (UAE, Singapore) should plan for the timing of exercise relative to their residency status.",
      "## When the conversation gets harder",
      "Three scenarios make the vesting negotiation more contentious.",
      "**Co-founder split.** If two co-founders have meaningfully different roles or different upside expectations, the vesting conversation can expose tension. One co-founder may want full tenure credit; the other may be open to standard vesting. The investor's lawyer will typically draft a single vesting clause that applies to both. We have run negotiations where the two co-founders ended up with different terms — defensible if there's a clear functional rationale (e.g., one is leaving the operating role at a defined point) but not always easy to land.",
      "**Recent co-founder hire.** If a co-founder joined within the last year, the question is whether they should be on the same vesting schedule as the longer-tenured co-founder. Standard practice is to vest each founder from their actual start date, with appropriate adjustments. This is uncontroversial but needs to be drafted explicitly.",
      "**Founder with prior equity in another role.** Some founders come to the company with consultancy equity, board equity, or advisory equity from prior roles that has already vested. None of this counts toward the new vesting clock; each role has its own schedule. Worth being clear about which equity is subject to which agreement.",
      "> The founder vesting conversation is one of the few negotiations where the right answer is to engage with the investor's underlying concern rather than push back on the headline ask. The concern — that founders need a continued service link to their equity — is legitimate. The mechanism is negotiable. Show that you understand the concern, and the negotiation room opens up.",
      "## What we do at engagement",
      "Three things, in the first week of any Series A engagement where vesting is on the table.",
      "First, audit the founders' existing equity arrangements. Original allotment dates, any vesting agreements that already exist, any side letters or co-founder agreements that may constrain the conversation.",
      "Second, build the vesting scenarios with the founders. Show them what their effective ownership looks like under (a) standard four-year forward vesting, (b) 50% tenure credit, (c) 100% tenure credit, (d) the negotiated version we expect to land. Show them what happens if they were to leave the company at the 12-month, 24-month, and 36-month marks under each scenario.",
      "Third, sequence the negotiation. Vesting is rarely the only term that needs to move in a Series A term sheet. We typically batch the vesting conversation with the ESOP pool top-up and the liquidation preference. The investor has limited goodwill to spend; using it on the highest-impact terms produces the best outcome for the founder.",
      ":::insight Founder vesting is the term sheet clause where the gap between the standard draft and the negotiated outcome is most consequential for the founder personally — not just for the cap-table. Treat it accordingly. :::",
    ].join('\n\n'),
    authorSlug: 'samarth-pandey',
    publishedOn: '2026-05-17',
    readMinutes: 10,
    tag: 'Founder economics',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
    references: [
      {
        label: 'Income Tax Act, 1961 — Section 17(2)(vi) (ESOP perquisite)',
        href: 'https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx',
      },
      {
        label: 'Companies Act, 2013 — Section 62(1)(b) (ESOP issuance)',
        href: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // M&A Advisory — single demo article (1 of 1)
  // Bar-setter for the rest of the editorial run. Once approved, the
  // remaining 9 M&A articles (and 70 across other service lines) get
  // drafted to this shape: ~1500 words, ## section headers, ### sub-
  // sections, **bold** inline emphasis, no em-dashes, paired thumbnail.
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'first-30-days-of-a-sell-side-process',
    title: 'The first 30 days of a sell-side process: what actually happens',
    excerpt:
      'Most sellers think the process starts when buyers see the teaser. It starts three weeks earlier, in the room where we agree what we are willing to sell, to whom, and what kills the deal.',
    body: [
      "Most founders preparing for a sale process believe the work starts when the teaser is sent out. They picture an outreach calendar, buyer responses, indicative offers landing on a Monday. The teaser feels like the starting gun.",
      "By the time the teaser goes out, the deal is already largely decided. Price range, buyer list, what the seller will and will not accept, the diligence vulnerabilities, the board dynamics. All of it sits in place before any outsider sees a document. The first three weeks of a sell-side process are where the deal is actually built.",
      "Skip them, and the next six months become an expensive education in why preparation matters.",

      "## Why the first 30 days set the deal",
      "Two things make the early window disproportionately important.",
      "First, sell-side processes work on momentum. From the moment a buyer sees a teaser, the clock starts running on their interest. Every diligence question, every data-room gap, every internal disagreement that surfaces externally signals weakness. Buyers price weakness. They also walk away from it.",
      "Second, almost every failure mode in a sell-side process is a failure of upfront preparation, not a failure during the negotiation. Buyer pulls out after diligence because of a customer concentration that was not disclosed cleanly. Board blocks a clean offer because the directors were never aligned on what acceptable looked like. Earnout structure becomes contentious because the seller never thought through what they would accept on consideration timing.",
      "The first 30 days remove these failure modes before they cost the seller anything. They are not about going to market. They are about deciding whether to.",

      "## Week one: alignment in the room",
      "The first week is the alignment week. We run two conversations in parallel, deliberately separated.",
      "The first is with the founders. What outcome do they actually want. Maximum cash. Continued operating role. Brand preservation. Team retention. The non-negotiables they have not articulated even to themselves.",
      "The second is with the board, separately. What does the board mandate as acceptable. The lowest price they will sign. The structures they will and will not consider. The timeline pressures they have not shared with the founders.",
      "The gap between the founder list and the board list is almost always wider than either side expects. A founder wants a strategic acquirer who will preserve the brand. The board wants the highest cash bid. A founder wants a meaningful continuing role. The board wants a clean exit and no contingent consideration. These differences are real. They will not resolve themselves once a process is live.",

      "### The gap memo",
      "By the end of week one we deliver a written gap memo to the board and the founders, jointly. It lists the founder priorities, the board mandate, and the differences. We then run a working session where the gap is closed point by point.",
      "Sometimes the gap closes by the founders adjusting expectations. Sometimes by the board widening its mandate. Sometimes the gap does not close, and the right answer is not to run a process now. That last outcome is rare but it happens. It is always cheaper to discover at week one than at week twelve.",

      "## Week two: the readiness audit",
      "The second week is the readiness audit. We pull together every document a buyer is going to ask for in the first 60 days of diligence and we index it against a standard buy-side checklist.",
      "Seven categories matter most for early diligence: three years of audited financials with the auditor's full file, the live cap table with every share issuance and transfer documented, all shareholder agreements and side letters, employment contracts for the senior team, key customer and vendor contracts with assignment clauses flagged, IP registrations and assignments, and the related-party transaction register.",
      "Every company has gaps. The job of the readiness audit is to surface them now, when there is time to fix them quietly, rather than have them surface in week ten of buyer diligence under time pressure.",

      "### The two gaps we see most often",
      "**Stock-option exercises without proper board approvals on file.** ESOPs get granted, options get exercised, share certificates get issued, but the underlying board resolutions, grant letters, cashless-exercise mechanics, and ROC allotment filings are incomplete. A buyer's lawyer will ask for the full audit trail. If it does not exist, the cap table itself becomes contested. Fixing this in week two is documentation work. Fixing it in week ten is an expensive workaround.",
      "**Inter-company transactions that never went through formal RPT process.** Loans between sister entities, services billed without proper agreements, common-cost allocations done without board approval. Routine in growing companies, and flagged by buy-side counsel almost without exception. The fix is to paper them properly. None of it is hard. It just takes time.",

      "### What ready actually means",
      "By the end of week two the audit produces a document that says, in plain language, what is in good shape, what is being fixed, and what cannot be fixed and will need to be disclosed honestly. The third category is the most important. Every sell-side process has things that will not look good in diligence. Pretending otherwise loses the deal. Disclosing them up front, in the right register, controls the narrative.",

      "## Week three: the buyer universe",
      "The third week is buyer scoping. This is where most sellers, working alone or with the wrong advisor, lose months of momentum.",
      "The temptation is to build a long list. Forty names looks comprehensive. The seller feels covered. The advisor looks busy. Forty names produces three real meetings. The other thirty-seven are cold approaches that never get returned, or warm approaches without strategic fit. By the time the conversion problem is visible, two months have passed.",

      "### Building the short list",
      "Three filters get us to the working list. **Strategic logic:** does an acquisition of this kind solve a problem the buyer has been visibly working around through partnerships, organic builds, or acqui-hires. **Capital posture:** has the buyer done at least one transaction at this scale in the last twenty-four months, or is there public capital allocation guidance suggesting it can. **Deal-team availability:** is there an M&A bandwidth signal, recent corp-dev hires, or are they likely to be too distracted internally.",
      "Most sectors yield eight to twelve real candidates after applying these three filters. We add four to six as a watchlist for opportunistic outreach. That gives a working universe of around fifteen names. Manageable, real, defensible if a board member asks why a specific name is or is not on it.",

      "### The path-in test",
      "Each candidate has to have a path in. Not LinkedIn warmth. A specific named introducer: a former colleague at a portfolio company, an investor on both sides, a banker who worked the most recent deal, a board member with a personal connection. If we cannot name the path in writing, the candidate stays on the watchlist, not the active list.",
      "Twelve targets done this way produces a different shape of dialogue. The first meeting comes through someone the target already trusts. Conversion from first meeting to NDA runs above fifty percent. From NDA to indicative offer, roughly one in three. Twelve becomes eight meetings, four NDAs, one to two indicative offers. A process you can actually run to a decision.",

      "## What good looks like by day 30",
      "By day twenty-one the seller has a board-aligned outcome map, a diligence-ready data room, and a buyer universe of around fifteen named candidates with personal paths into each.",
      "Days twenty-one through twenty-eight are document week. Teaser draft, CIM outline, NDA template, process letter, initial Q&A pack. All ready to go.",
      "Day thirty is the kickoff. Outreach begins. First meetings within ten days. NDAs in week six. Indicative offers in week ten.",

      "## Common mistakes in the early window",
      "**Skipping the gap conversation in week one.** Founders and the board both believe they are aligned. The first hostile board comment lands three months in, after the seller has rejected a clean offer. Force the gap conversation in writing, with the advisor in the room, before any buyer is contacted.",
      "**Treating the readiness audit as a documentation exercise.** A buy-side counsel does not just want documents, they want a coherent story about how decisions were made. The audit needs to surface the narrative around the documents, not just the documents.",
      "**Diluting the buyer list to look thorough.** A list of fifty buyers tells the board the advisor is being comprehensive. It also produces a fragmented process that does not converge. Discipline at the buyer-list stage is the single highest-leverage decision in a sell-side process.",

      "## Worth the three weeks",
      "Sellers occasionally push back on the upfront three weeks. The argument is always some version of: we know what we want, let us just get to market.",
      "Three months later the founder is on the phone telling us a clean offer from a strategic acquirer is being blocked by a board member who wanted a private equity buyout. The board member's view was reasonable, but no one had aligned the board on a single mandate before the process started. The deal does not close. The seller restarts eighteen months later, with a market that has moved on.",
      "Worth the upfront three weeks every time.",
    ].join('\n\n'),
    authorSlug: 'pravesh-goel',
    publishedOn: '2026-05-12',
    readMinutes: 8,
    tag: 'Sell-side process',
    serviceSlugs: ['ma-advisory'],
    thumbnailHook: "Week one is paperwork.",
    thumbnailHookEmphasis: 'paperwork',
    reviewerStatus: 'pending',
  },
  {
    slug: 'five-control-failures-nbfc-internal-audit',
    title: "What internal audit actually catches in an NBFC: five recurring control failures",
    excerpt:
      "Ashish Gupta has audited NBFCs across lending, microfinance, and housing finance for 13 years. The same five control failures appear in almost every engagement. Here is what they are and what the cost looks like.",
    body: [
      "Internal audit in an NBFC carries a specific weight that does not apply in the same way to most other financial institutions. The RBI's scale-based regulation framework has raised the compliance floor sharply, and the consequences of a control failure are not just regulatory. A poorly controlled NBFC can misstate its credit-loss trajectory, misrepresent portfolio quality to lenders, and accumulate operational risk that only surfaces under stress. At that point, the audit committee is asking why nobody caught it earlier.",
      "We have run internal audits across NBFCs in retail lending, microfinance, housing finance, and equipment financing over the last 13 years. The issues that keep appearing are not exotic. They are not the kind of failure that requires sophisticated forensics to uncover. They are the kind that a well-structured internal audit catches in the first two weeks, if the audit scope is actually calibrated to the business.",
      "Five of them come up, in some form, in almost every engagement.",
      "## Credit appraisal that exists on paper but not in practice",
      "Most NBFCs have a credit policy. It specifies income verification requirements, LTV limits, customer segment eligibility, and deviation approval processes. What internal audit often finds is that the policy is followed in the application file and not in the actual appraisal decision.",
      "In one mid-size retail lending NBFC we audited, the credit policy required income verification via two independent sources for self-employed borrowers above a certain ticket size. In a sample of 60 files we pulled, 31 had income verification based on a single bank statement, with a credit manager's handwritten note saying the customer's income had been 'verified telephonically'. The handwritten note was being treated as the second independent source.",
      "The downstream effect was not visible yet in the NPA numbers because the portfolio was young. But the NPA projection for that segment, done against the verified-vs.-unverified split, showed a statistically different delinquency pattern. The deviation had been running for at least 14 months without being picked up by any internal function.",
      "The pattern we see most often: the credit policy is tight enough that branches cannot meet their disbursement targets if they follow it strictly. The informal workarounds accumulate. Nobody explicitly approves them, but nobody flags them either. By the time they reach audit, they are embedded.",
      "## Loan documentation gaps that the system does not catch",
      "Every NBFC has a loan origination system. Most LOS platforms have a checklist function, often configured as a mandatory field gate before disbursement can be authorised. The assumption is that if the disbursement goes through, the documentation is complete.",
      "The assumption is frequently wrong.",
      "**Document checklist gates are often configured as tick-box fields rather than file-verification fields.** The branch executive marks the document as received; the system accepts it; the disbursement proceeds. Whether the document was actually received, whether it is legible, whether it matches the customer record, is not verified by the system. That verification is supposed to happen in a post-disbursement review. In practice, the post-disbursement review is a reporting exercise, not an exception-handling exercise.",
      "In one microfinance NBFC audit, we found that 19% of the files sampled had a KYC document marked as received that was either a photocopy of a photocopy (illegible), a document for a different customer, or a document that had expired before the loan was booked. The LOS had green-lit all of them.",
      "The practical risk is not just regulatory. An unsupported KYC document becomes a problem in recovery proceedings. A property document with a chain-of-title gap becomes a problem at the time of enforcement. These are not abstract compliance issues. They are operational liabilities.",
      "### Why post-disbursement review fails",
      "The post-disbursement review is almost universally under-resourced relative to the volume it is supposed to cover. In most NBFCs we have audited, one operations officer is reviewing 400 to 600 files per month on top of their normal branch duties. At that volume, the review becomes a count of documents received, not an assessment of quality. Internal audit's job is to quantify the gap between what the review is supposed to catch and what it actually catches.",
      "## Collections reporting that smooths over real portfolio stress",
      "Bucket migration analysis is one of the sharper early-warning tools available in NBFC portfolio management. It tracks how accounts move between DPD buckets, and a deterioration in the forward-roll rate (the proportion of accounts that move from a worse bucket to an even worse one, rather than being resolved) is a leading indicator of systemic stress.",
      "What internal audit repeatedly finds is that the collections MIS does not distinguish clearly between genuine cures and tactical cures. A tactical cure is a payment received from a borrower specifically to prevent the account from crossing a DPD threshold, often facilitated by the collections field team offering restructuring, rescheduling, or in some cases simply collecting cash without posting it to the system before month-end.",
      "**Tactical cures inflate the apparent portfolio quality** because accounts show as current at the reporting date. The forward-roll rate looks acceptable. The NPA number is clean. The stress is real but deferred.",
      "In a housing finance NBFC audit, we reconstructed the bucket movement data for a 12-month period and identified a cohort of accounts that had touched DPD 30+ at least once but were showing as regular at each month-end reporting date. The cohort was 8.2% of the portfolio by value. The actual credit-loss trajectory of that cohort, modelled against the collections history, was meaningfully different from the rest of the portfolio. The audit committee had not seen this view of the data. The standard MIS showed current portfolio quality; it did not show the history of the accounts that were currently in the current bucket.",
      "This is not always a deliberate misrepresentation. It is often a consequence of MIS design: reports are built for month-end snapshots, and mid-month movement is not tracked or archived. But the effect on the board's picture of portfolio quality is the same.",
      "## Related-party and co-lending arrangements without arm's-length documentation",
      "NBFCs frequently operate with co-lending arrangements, business correspondent relationships, or co-origination structures involving entities with common promoter ownership or board overlap. RBI has tightened the disclosure and approval requirements for these arrangements substantially, but the operational compliance has not kept pace with the policy commitments.",
      "The failures we see are not typically of the outright undisclosed variety. They are softer: a co-lending partner that is a promoter-linked NBFC, with an approved board resolution and a signed agreement, but where the pricing terms, the first-loss default guarantee structure, and the portfolio selection criteria have been modified informally since the agreement was signed. The original agreement is on file. The current operating practice does not match it.",
      "**The gap between the documented arrangement and the actual operating practice is where audit risk concentrates.** If a regulator pulls the files, the documented terms look compliant. The actual economics are different. Internal audit has to bridge that gap, which requires interviewing the treasury and collections teams, not just reading the agreements.",
      "In one equipment finance NBFC, the co-lending arrangement with a promoter-linked entity had been modified three times at the operational level over 18 months. None of the modifications had gone to the board for approval, because they were framed internally as 'operational adjustments' rather than material changes to the arrangement. The audit committee had approved the original structure. They had not approved what was actually running.",
      "## IT access controls that have not been reviewed since implementation",
      "The fifth failure is the one that surprises audit committees the most, because it tends to be clean on paper. Most NBFCs have an IT access control policy. It specifies role-based access, segregation of duties, maker-checker requirements, and periodic access reviews. The policy is usually well-drafted. The implementation is often years out of date.",
      "The specific pattern we see: the access matrix was designed and implemented when the LOS or the core banking system went live. Staff have changed roles, been promoted, joined, and left. The access matrix has not been updated to reflect any of it. Former employees have active system credentials in a significant portion of the NBFCs we audit. Employees who have moved from branch operations to collections still have disbursement authorisation rights. A credit manager who was promoted to zonal manager has retained their own individual maker credentials along with the approver credentials they acquired on promotion.",
      "**Segregation of duties violations in financial systems are not theoretical.** They create the conditions for fraud and for undetected error. In a stressed collections environment, the combination of disbursement access and collections posting access in a single user's credentials is a specific and serious operational risk.",
      "The fix is a structured user access review, typically a three-to-four-week exercise depending on system complexity, followed by access revocation, role realignment, and a quarterly review cadence going forward. Most NBFCs know they need to do this. Most have not done it in the last 18 months.",
      "## What these five failures have in common",
      "They are all detectable with a well-scoped audit. None of them require forensic investigation. None of them are hidden by sophisticated concealment. They persist because the audit scope is often designed around the regulatory checklist rather than around the actual operating model, and because the internal audit function is under-resourced relative to the portfolio growth the NBFC has experienced.",
      "The RBI's revised framework for NBFCs has raised the bar on what audit committees are expected to know. The gap between that expectation and what the current internal audit function is actually surfacing is where engagement starts. When we run an NBFC audit, the five areas above are where we begin, because in 13 years, they have never all been clean at once.",
    ].join('\n\n'),
    authorSlug: 'ashish-gupta',
    publishedOn: '2026-05-17',
    readMinutes: 9,
    tag: "Internal audit",
    serviceSlugs: ['risk-advisory'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'gst-refund-procedural-failures',
    title: "GST refunds that get blocked: the procedural failures that delay claims",
    excerpt:
      "Most GST refund delays are not disputes about eligibility. They are documentation failures that the department is entitled to reject. Each one has a fix, if you know where to look.",
    body: [
      "An exporter waits six months for a GST refund that should have arrived in sixty days. A SaaS firm supplying to overseas clients has three quarters of accumulated input-tax credit sitting in the electronic credit ledger with no refund in sight. A manufacturer who applied before the last date of the relevant period gets a deficiency memo three months later saying the application was filed under the wrong category.",
      "These are not disputes about whether the refund is owed. In every case above, the refund was legitimate. The problem was procedural. The application had a defect, a mismatch, or a missing document that the department was not only entitled to reject but required to. The money was not gone. The timeline was.",
      "We handle GST refund work for exporters, SaaS companies with cross-border revenue, and manufacturers with inverted-duty structures. The same five procedural failures show up repeatedly. Each one is avoidable. Each one has a concrete fix.",
      "## Failure one: the LUT is in the wrong state or expired",
      "**Letter of Undertaking** is the document that allows exporters to supply goods or services without paying IGST at the point of export, preserving the right to claim a refund of accumulated input credit. It sounds administrative. In practice it is the single most common reason export refund applications get returned.",
      "Three versions of the LUT problem appear regularly. First, the LUT was filed in a prior financial year and the firm did not renew it before the export invoices were raised. The export happened in April, the LUT was valid through March. Every invoice raised after renewal lapsed is treated as a supply without a valid LUT, which means IGST should have been paid at the point of export. The refund of input credit for those invoices becomes contested.",
      "Second, the LUT was filed in the wrong GSTIN jurisdiction. A firm operating across multiple states sometimes files the LUT in the head-office state while exports were invoiced out of a different state registration. Refund applications from the second registration have no LUT backing them.",
      "Third, the firm exported on payment of IGST instead of under LUT, then applied for a refund of IGST paid rather than a refund of unutilised input credit. These are two different refund categories, processed differently, with different documentary requirements. Applying under the wrong category triggers an automatic deficiency memo.",
      "The fix is straightforward: file the LUT for the new financial year in the first week of April, before any export invoice is raised. Do it in every GSTIN that exports. Maintain a calendar entry because the department does not send reminders.",
      "## Failure two: invoice data does not match across GSTR-1, GSTR-3B, and the shipping bill",
      "A GST refund for an exporter depends on the department being able to trace a chain from the input invoices in GSTR-2A, through the output invoices in GSTR-1, to the corresponding shipping bills filed with Customs. If any number in that chain does not match exactly, the system throws an error and the refund application stalls.",
      "The mismatches we see most often are not large. The invoice number in GSTR-1 has a slash where the shipping bill has a hyphen. The taxable value in GSTR-1 is in rupees; the invoice used a slightly different exchange-rate rounding. The shipping bill was filed before the GST invoice was uploaded to the portal, so the department's system cannot reconcile them sequentially.",
      "These look trivial. To the refund-processing system they are hard stops.",
      "### Cleaning the data before applying",
      "The right approach is to run a three-way reconciliation before submitting the refund application, not after getting a deficiency memo. Pull the GSTR-1 data, the shipping bill data from the ICEGATE portal, and the inward invoice data from GSTR-2A. Map every export invoice to its corresponding shipping bill. Flag every field where there is any difference, however small, including case differences in invoice numbers.",
      "Where a mismatch can be corrected before the return period closes, correct it. Where the return period is closed, file the refund with a covering note explaining the discrepancy and attaching both documents side by side. The covering note does not guarantee approval, but it converts a blind rejection into something the processing officer can actually review.",
      "For SaaS firms billing in foreign currency, the exchange-rate difference is predictable. Use the RBI reference rate for the invoice date and document that choice explicitly in the refund application. Consistency across invoices matters more than the specific rate used.",
      "## Failure three: incorrect or missing HSN/SAC codes",
      "**HSN codes** for goods and **SAC codes** for services are the classification spine of GST. Refund eligibility, rate applicable to the supply, and the correct refund category all flow from getting these right. Getting them wrong is more common than it should be.",
      "For exporters of goods, the problem is often HSN at the four-digit level in the invoice when the shipping bill requires the eight-digit code. The four-digit code is accepted for tax purposes but the Customs system requires eight digits for the shipping bill, so the two documents are never matched correctly by the department's reconciliation engine.",
      "For SaaS and other service exporters, the SAC code applied to the invoice determines whether the supply qualifies as an export of service under Section 2(6) of the IGST Act. A wrong SAC code can mean the supply is classified as a domestic taxable service, which removes the export-of-service status and with it the entire refund entitlement.",
      "The fix has two parts. First, build a master list of every HSN or SAC code your firm uses, validated against the GST rate schedule and, for goods exporters, the Customs Tariff heading. Second, lock this list in the invoicing system so individual users cannot override it. The classification decision should be made once, correctly, and then enforced at the point of invoice generation.",
      "## Failure four: no FIRC or missing bank realisation certificate for service exports",
      "Export of services under GST is zero-rated, but the refund of input credit depends on demonstrating that payment for the service was received in foreign exchange. The document that proves this is the **Foreign Inward Remittance Certificate** issued by the exporter's bank, or a Bank Realisation Certificate for older transactions.",
      "The FIRC problem has two variants. The first is that the FIRC was not obtained at all, or the bank issued an informal credit advice instead of the formal certificate. The department will not accept anything other than the formal document.",
      "The second, more common variant: the FIRC is for the full contract value while the invoices raised were for monthly tranches. The department processes invoices individually, not against aggregate contract values. So a single FIRC for $120,000 does not satisfy the documentary requirement for twelve monthly invoices of $10,000 each. You need a FIRC for each remittance, or a statement from the bank mapping remittances to invoice numbers.",
      "Some banks issue a consolidated bank statement format that the department has accepted. We have also seen the department accept a chartered-accountant certificate mapping the aggregate FIRC to individual invoices when the bank will not issue separate FIRCs. However, neither of these is guaranteed. The safest practice is to obtain a FIRC or equivalent for each remittance at the time of receipt and file it with the corresponding invoice data in the refund application.",
      "## Failure five: refund applications filed outside the two-year window or before the filing trigger",
      "Under Section 54 of the CGST Act, a refund application must be filed within two years from the **relevant date**. The relevant date is not the same for all refund types. For export of goods with payment of IGST, it is the date of the shipping bill. For export without payment of IGST (i.e., under LUT), it is the end of the financial year in which the export invoice was raised. For inverted-duty refunds, it is the date of filing of GSTR-3B for the relevant period.",
      "Firms that miscalculate the relevant date sometimes apply late and then spend months in adjudication trying to argue condonation. Condonation of delay in refund matters requires showing sufficient cause, and the department's adjudicating officers are not generous about it.",
      "The opposite problem also occurs. Some firms apply for the LUT-export refund before the financial year ends, meaning the relevant date has not yet crystallised. The application is not invalid, but the supporting documents for invoices raised later in the same financial year cannot be included, so the refund is partial. A second application for the balance then creates reconciliation work across two refund orders.",
      "### The filing calendar we use",
      "For export refunds under LUT, we file once per quarter, covering all export invoices from the preceding quarter, with a final year-end sweep in May to capture any invoices from the March quarter where GSTR-3B filing was late. This avoids both premature applications and the risk of letting the two-year window narrow.",
      "For IGST-paid export refunds, we file within thirty days of the shipping bill acknowledgment. The system processes these faster and the relevant-date calculation is simpler.",
      "For inverted-duty refunds, we file within sixty days of the GSTR-3B for the relevant period. Any longer and the accumulated credit starts to drag on working capital unnecessarily.",
      "## What a clean refund application looks like",
      "A refund application that does not come back with a deficiency memo has five things in order before it is submitted: a valid LUT for the current year covering the relevant GSTIN, a reconciled invoice and shipping-bill data set with every field matching, correct eight-digit HSN or SAC codes on every invoice, a FIRC or bank statement mapped to each invoice for service exports, and a correctly calculated relevant date that puts the application inside the two-year window.",
      "None of this is technically difficult. The difficulty is that these checks are not prompted by the GST portal. The portal accepts the application and either processes it or returns a deficiency memo weeks later. By then the delay has already happened.",
      "The firms we work with that have the cleanest refund cycles have solved this with a pre-submission checklist that runs before any application is filed. The checklist is not long. Running it takes less time than responding to the first deficiency memo.",
    ].join('\n\n'),
    authorSlug: 'abhishek-gupta',
    publishedOn: '2026-05-17',
    readMinutes: 9,
    tag: "GST refunds",
    serviceSlugs: ['tax-regulatory'],
    thumbnailSrc: '/article-thumbs/gst-refund-procedural-failures.jpg',
    thumbnailHook: "Refunds die in the cover letter.",
    thumbnailHookEmphasis: 'die',
    reviewerStatus: 'pending',
  },
  {
    slug: 'statutory-audit-questions-founders-dread',
    title: "Statutory audit: the questions founders dread and how to make them routine",
    excerpt:
      "The audit is not the problem. The three weeks before the auditors arrive are. Four asks come up in almost every engagement. Each one takes a day to prepare for and three days to fight through unprepared.",
    body: [
      "Every founder who has been through a statutory audit remembers the moment the auditors asked for something that did not exist in the form they wanted it. Revenue reconciled to contracts, not just bank deposits. A fixed-asset register that tied out to the depreciation schedule. Related-party transactions documented with board approvals and market-rate justifications. The ask was not unreasonable. The company just had not kept the paper.",
      "The dread is not really about the auditors. It is about the gap between how the company actually ran its books during the year and what Ind-AS and the Companies Act require those books to look like at year-end. Most of the gap is closeable in a week if you know where to look. The founders who spend three days in fire drills are the ones who find out what the auditors need only after the fieldwork starts.",
      "Abhishek leads the audit and assurance practice at Nucleus. Over six years across statutory audits, IFC reviews, and Ind-AS implementations, he has seen the same four asks surface in nearly every engagement. This is what those asks actually mean, what auditors want to see, and what simple preparation looks like for each.",
      "## Why the dread is predictable",
      "Statutory auditors in India are required to give an opinion on whether the financial statements present a true and fair view under Ind-AS, whether the company has adequate internal financial controls, and whether specific disclosures required by Schedule III and other regulations are complete. These are not optional checks.",
      "Four areas concentrate most of the difficulty. Revenue recognition under Ind-AS 115. Related-party transactions under Ind-AS 24 and Section 188 of the Companies Act. Fixed-asset register reconciliation. Lease accounting under Ind-AS 116. A fifth, key managerial personnel compensation disclosures, tends to create a different kind of problem: it is usually not missing, it is just wrong.",
      "None of these require new systems. They require documentation discipline during the year, not just at year-end.",
      "## Revenue recognition under Ind-AS 115",
      "Ind-AS 115 requires you to recognize revenue when, or as, performance obligations are satisfied. That sounds simple. In practice it means the auditors need to see the link between your contracts, your invoicing, and your revenue line.",
      "What auditors actually want: a sample of contracts from your top customers, matched to the invoices raised against them, matched to the revenue recognized. For a SaaS company, they want to understand whether you are recognizing revenue monthly as the service is provided or upfront at the point of invoicing. For a services company, they want to understand the milestone structure in the contract and confirm that the revenue recognized matches milestones actually completed, not milestones billed.",
      "The three situations that slow audits down most are: contracts with multiple deliverables where the company treated the whole thing as one performance obligation; deferred revenue that was recognized early because the invoice was raised before the service period started; and variable consideration, discounts, refunds, or rebates, that were not accounted for when recognizing the revenue.",
      "### What simple preparation looks like",
      "Before fieldwork starts, pull your top 20 customers by revenue. For each one, have the signed contract, the invoices raised during the year, and a one-line memo explaining how you identified the performance obligations and when you recognize revenue. If you have deferred revenue on the balance sheet, have the schedule showing the opening balance, additions, and releases, tied to specific contracts. This is two days of work for a CFO or controller. It turns a week of auditor queries into a 45-minute walkthrough.",
      "## Related-party transactions",
      "Related-party disclosures under Ind-AS 24 require you to disclose all transactions with directors, key managerial personnel, their relatives, and entities they control or significantly influence. Section 188 of the Companies Act adds an approval requirement for transactions above prescribed thresholds: board approval for smaller amounts, shareholder approval for larger ones.",
      "What auditors actually want: a complete list of all related parties, every transaction with each of them during the year, confirmation that transactions above thresholds were approved at the right level, and evidence that the terms were at arm's length.",
      "**The most common gap is not the transactions. It is the documentation.** A company lends money to a director's other entity. The loan exists. The interest is being charged. But there is no board resolution authorizing the loan, no loan agreement signed between the two parties, and no documented basis for the interest rate being at market. The auditors are not surprised that the transaction exists. They need to see that the board knew about it and approved it.",
      "### Building the RPT register",
      "Keep a related-party transaction register from the start of the financial year, not the end. Every transaction with a related party goes in as it happens: date, counterparty, nature of transaction, amount, whether board or shareholder approval was obtained, and where the approval resolution can be found. The register takes 30 minutes a quarter to maintain if you do it live. It takes three days to reconstruct from a year of bank statements at year-end.",
      "One more point. Remuneration to directors and key managerial personnel is itself a related-party transaction requiring disclosure. If your board has not formally approved the KMP remuneration through a compensation committee or board resolution, that is both a disclosure gap and a Companies Act compliance gap. Fix it before the auditors ask.",
      "## Fixed-asset register reconciliation",
      "The fixed-asset register is supposed to be the single source of truth for every capitalized asset: what it is, when it was purchased, what it cost, how it is being depreciated, and what its net book value is. In practice, the FAR in most growing companies is a spreadsheet that was last updated six months ago and does not match the depreciation schedule in the accounting software.",
      "What auditors actually want: the FAR tied out to the gross block and accumulated depreciation figures on the balance sheet, with additions and disposals during the year documented and physically verified. For companies above a certain size, they will do a physical verification, picking a sample of assets from the register and checking they exist, and picking a sample of assets from the floor and checking they are on the register.",
      "**The two gaps that slow this down most are unrecorded disposals and assets under construction that were never capitalized.** A laptop was written off but remains in the FAR. A leasehold improvement completed eight months ago is still sitting under capital work-in-progress. Both require adjustment entries that will show up in the audit report if not dealt with.",
      "### Keeping the FAR current",
      "The FAR should be updated in the same month as the purchase or disposal, not at year-end. Assign ownership: whoever approves the purchase order signs off on the FAR entry. For physical verification, do an internal round in December rather than waiting for the auditors to do it in March. Find your own gaps first.",
      "## Lease accounting under Ind-AS 116",
      "Ind-AS 116 applies to most leases of one year or more. It requires you to recognize a right-of-use asset and a corresponding lease liability on the balance sheet, then charge depreciation on the asset and interest on the liability through the P&L. Most companies got comfortable with this for office leases. The gaps tend to be in equipment leases, vehicle leases, and arrangements that look like service contracts but meet the definition of a lease.",
      "What auditors actually want: a complete list of all arrangements that meet the Ind-AS 116 definition of a lease, the calculation of the right-of-use asset and lease liability at inception and at year-end using the incremental borrowing rate, and the disclosure note broken down by maturity.",
      "The incremental borrowing rate is where most companies get challenged. The rate used to discount the lease liability should reflect what the company would pay to borrow on secured terms over a similar tenor. Using the SBI base rate because it is convenient is not the right answer and auditors will ask for the basis.",
      "## KMP compensation disclosures",
      "Schedule III of the Companies Act requires disclosure of remuneration paid to directors and key managerial personnel, broken down by components. The Companies Act also sets ceilings on managerial remuneration as a percentage of net profits for listed companies and requires specific disclosures for private companies above prescribed thresholds.",
      "**The gap here is almost never the remuneration itself. It is the breakdown.** The company paid its MD Rs. 1.2 crore. The auditors ask for it split into salary, performance bonus, perquisites valued under Income Tax rules, and any commission component. The HR team has the payslips. The perquisite valuation is sitting in a drawer. The commission approval is in a board resolution from eighteen months ago. None of it is wrong, but it takes two days to pull together.",
      "Do this reconciliation once a year, in January, before fieldwork begins. Pull every component of compensation for each KMP, value perquisites using Income Tax rules, confirm the total ties to what was expensed in the books, and verify you have a board or shareholder resolution authorizing the aggregate. Then it is a 10-minute conversation with the auditors.",
      "## What the preparation window actually looks like",
      "The audit preparation that makes fieldwork smooth takes about five working days, spread across January and February for companies with a March year-end.",
      "Day one and two: revenue walkthrough. Pull the top-customer sample, write the performance-obligation memos, reconcile deferred revenue.",
      "Day three: RPT register. Reconcile all related-party transactions against approvals, update the register, confirm KMP compensation breakdown.",
      "Day four: FAR and CWIP. Reconcile the register to the balance sheet, flag unrecorded disposals, move completed CWIP to the FAR.",
      "Day five: lease schedule and KMP disclosures. Confirm all leases are captured, verify the IBR basis, complete the compensation reconciliation.",
      "That is it. Five days of focused preparation replaces three weeks of fire drills. The auditors arrive, fieldwork runs on schedule, and the audit report lands on time. For a company planning a fundraise or an exit in the same year, that matters more than most founders realize. Investors asking for audited financials do not want to hear that the audit is delayed because the FAR does not tie out.",
    ].join('\n\n'),
    authorSlug: 'abhishek-gupta',
    publishedOn: '2026-05-17',
    readMinutes: 9,
    tag: "Statutory audit",
    serviceSlugs: ['assurance'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'esop-valuation-india-409a-playbook',
    title: "ESOP valuation in India: why the 409A playbook does not translate",
    excerpt:
      "US-trained founders and CFOs reach for the 409A framework by instinct. Indian tax authorities have a different rulebook entirely. What a defensible ESOP valuation looks like under Rule 11UA, and what gets you rejected.",
    body: [
      "Every quarter we review an ESOP valuation that a startup has submitted to its auditors or tax counsel, and roughly half of those valuations were built on assumptions that make sense in a US context but create real exposure under Indian law. The founder or CFO has seen a 409A done for a portfolio company by a US firm, figured the methodology is universal, and replicated it. It is not universal.",
      "The Indian framework for ESOP valuation sits at the intersection of three separate bodies of regulation: Rule 11UA of the Income Tax Act (which governs perquisite taxation at the time of exercise), the Companies Act 2013 (which governs the valuation basis for private companies issuing securities), and FEMA for companies with foreign shareholders or foreign employees holding options. Each one has a different purpose, a different enforcement mechanism, and a different preference for methodology. Building a single valuation that passes all three is not complicated, but it requires knowing what each authority is actually looking for.",
      "We have done enough of these across sectors and stages that the failure patterns are predictable. This is what we have learned.",
      "## What 409A gets you and why Indian tax authorities care",
      "In the US, Section 409A of the Internal Revenue Code sets the framework for deferred compensation. A 409A valuation establishes the fair market value of common stock at the time of an ESOP grant, which then determines the exercise price. The purpose is to set a floor on the grant price that the IRS will not challenge. The methodology is flexible: discounted cash flow, comparables, or a hybrid. A qualified independent appraiser can use significant judgment.",
      "Indian income tax authorities are not concerned with the grant price the same way. Under Section 17(2)(vi) of the Income Tax Act, the taxable perquisite for an employee arises at exercise, not at grant. The perquisite is the difference between the fair market value on the date of exercise and the exercise price. For a listed company this is simple: use the market price on exercise date. For an unlisted company, the Income Tax Rules direct you to Rule 11UA(1)(c)(b), which specifies a merchant-banker valuation using a DCF method.",
      "The phrase 'merchant-banker valuation' is important. Indian tax authorities expect the valuation to come from a SEBI-registered Category I or Category II merchant banker, not from an offshore advisory firm, a CA firm without the relevant SEBI registration, or a startup's internal finance team. A 409A from a reputable US firm, however sophisticated, does not satisfy this requirement. We have seen companies receive tax notices specifically because the valuation at exercise was backed by a document that looked like a 409A but was not certified by a SEBI-registered merchant banker.",
      "## Rule 11UA: the methodology you cannot avoid",
      "Rule 11UA(1)(c)(b) requires a DCF-based valuation by a merchant banker for unlisted equity. The rule does not give the merchant banker a free hand. It anchors the valuation to the company's cash flow projections as of the valuation date and requires specific disclosure of assumptions.",
      "What this means in practice: the valuation report must contain the projected financial statements used as inputs, the discount rate with its derivation, the terminal value assumption, and a sensitivity table. A report that quotes a valuation multiple from a comparables analysis without a DCF is not Rule 11UA compliant for income tax purposes, regardless of how well-supported the comparable analysis is.",
      "The DCF requirement creates a practical problem for early-stage companies. A pre-revenue SaaS company with no operating history has projections that are speculative by definition. The merchant banker still has to build the DCF. The approach we use is a probability-weighted scenario model: a base case, a downside case, and an upside case, with explicit probability weights assigned and documented. The weights are defensible only if there is a business rationale for each scenario. A table of three scenarios with equal 33% weights is not a substantive analysis; it is a placeholder, and a tax officer reviewing the report will treat it as one.",
      "### Discount rate derivation under Indian conditions",
      "The discount rate for an Indian private company DCF cannot be copied from a 409A built for a US counterpart. The cost of equity calculation has to use Indian risk-free rates, typically the 10-year Government of India bond yield, and an Indian equity risk premium. Using the US 10-year Treasury rate as the risk-free rate in a valuation of an Indian rupee-denominated business will immediately flag a knowledgeable reviewer.",
      "Size premium and company-specific risk premium adjustments are also necessary. For an early-stage company, the total discount rate often falls in the 25-40% range depending on sector and stage. Rates below 20% for a pre-Series B Indian startup require explicit justification. Rates above 45% require the same. Both extremes will invite challenge.",
      "### The DLOM question",
      "A Discount for Lack of Marketability (DLOM) is appropriate for an unlisted company because the shares cannot be freely traded. US-trained practitioners often apply a DLOM of 20-30% drawn from restricted-stock studies or put-option models. Indian tax authorities have been inconsistent in accepting DLOMs under Rule 11UA. The more defensible position is to model the DLOM using a quantitative method such as the Finnerty model or the Longstaff model rather than asserting a round number from a US study. Document the holding period assumption and the assumed volatility of comparable listed companies. A DLOM with a quantitative derivation is much harder to reject than a sentence that says '25% discount applied for lack of marketability.'",
      "## Where the Companies Act and FEMA add constraints",
      "For the purpose of issuing shares to employees under the Companies Act 2013, Section 62(1)(b) requires the price of shares issued under an ESOP scheme to be not less than the face value and to comply with the valuation prescribed by the SEBI guidelines for listed companies or, for unlisted companies, to be supported by a registered valuer's report. The 'registered valuer' here refers to registration under the Insolvency and Bankruptcy Board of India (IBBI), which is a separate registration from a SEBI merchant banker license.",
      "**This is the structural problem:** a SEBI-registered merchant banker satisfies Rule 11UA for tax purposes, but may not hold an IBBI registered valuer license, and vice versa. A company that uses a single valuer who holds only one of these two credentials has a gap. For a straightforward domestic ESOP with no foreign element, many companies manage with one certificate backed by one credential. We recommend getting both covered, particularly for companies approaching a Series B or later where the scrutiny at the next fundraise will be higher.",
      "For companies with foreign shareholders or foreign employee option holders, FEMA adds a third layer. RBI's foreign investment framework requires that the price at which shares are issued to non-residents be not less than the fair value determined under a method acceptable to the RBI. In practice, the DCF by a merchant banker satisfies this requirement, but the report has to be available at the time of allotment and reported in the FC-GPR filing. Many companies allot shares to foreign option holders and file the FC-GPR with an internal valuation or a delayed merchant-banker certificate. The RBI's Authorised Dealers will flag this.",
      "## What a defensible valuation report actually contains",
      "A report that will withstand income tax scrutiny, a Companies Act audit, and a FEMA compliance review has the following anatomy.",
      "The engagement letter names a SEBI-registered Category I or II merchant banker and, ideally, an IBBI registered valuer. The report is dated as of the valuation date, which is the date of allotment (or the date proximate to the grant, depending on the trigger). The report states the purpose of the valuation and the applicable regulatory framework explicitly.",
      "The body of the report contains the DCF model as an exhibit: projected profit and loss, projected cash flows, capital expenditure assumptions, working capital assumptions, and terminal value with the perpetuity growth rate stated. The WACC derivation is shown line by line. A sensitivity table shows value across at least two discount-rate scenarios and two growth-rate scenarios.",
      "**The comparables section is supplementary, not primary.** We include a trading comparables analysis and, where available, a transaction comparables analysis, but these are presented as sanity checks on the DCF output. Stating clearly that the DCF is the primary method and the comparables provide a range gives the report the regulatory compliance of Rule 11UA while still giving the reader context on how the company sits relative to market.",
      "The DLOM section states the method, the inputs, and the percentage applied with the formula shown. The conclusion section states the per-share value and the basis for the exercise price. If the exercise price is below the fair value (which is permissible), the report states the expected perquisite per option at exercise based on the current valuation.",
      "## Perquisite tax timing: what employees need to understand",
      "This is the section most ESOP letters to employees get wrong. Under the current Indian income tax framework, the taxable event is at exercise, not at vest. The employee receives shares worth more than the exercise price and is taxed on the spread as a perquisite in the year of exercise. The employer deducts TDS on this amount.",
      "**The practical consequence:** an employee who exercises 10,000 options at Rs. 10 per share when the fair value is Rs. 200 per share has a perquisite income of Rs. 19 lakh in the year of exercise. If the employee is in the 30% bracket, TDS of roughly Rs. 5.7 lakh is due immediately, before the employee has sold a single share. For unlisted companies where the shares are not liquid, this is a cash-flow problem for the employee.",
      "The Finance Act 2020 partially addressed this by deferring TDS on ESOP allotments in eligible start-ups: the employer can defer TDS to the earliest of 14 days after a sale, 5 years from the allotment date, or the employee's departure from the company. But this deferral applies only to start-ups registered with DPIIT. For companies that are not DPIIT-registered, or for employees who have already left the start-up, the old regime applies.",
      "We include a plain-language note in the ESOP grant letters we review explaining the exercise-date tax event and the TDS mechanics. Employees who understand this early make better exercise decisions. Employees who learn about it after exercising are usually very unhappy.",
      "## The one mistake we see repeatedly",
      "A Series A company completes a fundraise. The new investors ask for an ESOP refresh. The founders hire the same audit firm that did the 409A for a US investor to do the Indian ESOP valuation. The audit firm is excellent at 409A work. It is not SEBI-registered. The valuation report is well-constructed. The exercise prices are set. Options are granted.",
      "Eighteen months later, at Series B due diligence, the new investor's counsel pulls the ESOP valuation. The report does not name a SEBI-registered merchant banker. The income tax compliance at exercise is potentially deficient. The company needs a retrospective valuation, which is harder to defend than a contemporaneous one. The exercise price decisions may have to be revisited. The diligence timeline extends by six weeks.",
      "The fix is not expensive. A SEBI-registered merchant banker valuation for a Series A company typically costs Rs. 1.5 to 3 lakh depending on complexity. Getting the credential right costs nothing extra. The problem is purely about knowing the requirement exists.",
      "If you are building or refreshing an ESOP plan and the company has any foreign element in its cap table or its employee base, treat the valuation as a three-authority document from the start: tax compliance under Rule 11UA, issuance compliance under the Companies Act, and FEMA compliance under the relevant RBI circular. Build it that way once, and the Series B diligence conversation is a twenty-minute sign-off.",
    ].join('\n\n'),
    authorSlug: 'vijay-singh-rathore',
    publishedOn: '2026-05-17',
    readMinutes: 10,
    tag: "ESOP valuation",
    serviceSlugs: ['valuations'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'when-outsourced-finance-beats-hiring-your-first-cfo',
    title: "When outsourced finance beats hiring your first CFO",
    excerpt:
      "Most Indian SaaS and D2C founders between Series A and B believe the next finance hire is a CFO. In most cases, it is not. The job they actually need done costs a fraction of what a CFO costs, and a CFO cannot do it anyway.",
    body: [
      "Series A closes. The founder gets two pieces of advice from every investor on the board: hire a strong head of sales and hire a CFO. The head of sales is usually the right call. The CFO is usually not, at least not yet.",
      "The instinct makes sense. The company is now carrying institutional money. Reporting expectations are higher. The founder does not want to be caught with messy books. A CFO feels like the professional-grade answer. The problem is that a CFO is a strategic, board-facing, investor-relations role. Between Series A and Series B, that job is maybe 20 percent of what needs doing. The other 80 percent is operational finance: monthly close, statutory compliance, GST filings, payroll, payables and receivables, MIS reporting. That work does not require a CFO. It requires a controller and a compliance layer, and both can be outsourced at a fraction of the cost.",
      "This is not a cost-cutting argument. It is a fit argument. Hiring a CFO too early means paying Rs. 50-80 lakh all-in per year for a senior person who spends most of their time doing work that a capable outsourced team handles better, faster, and without the overhead.",
      "## What the CFO role actually requires",
      "A CFO earns their salary when the company is doing something that requires capital-market judgment and board-level credibility. That means preparing for and managing a fundraise. Structuring a debt facility or working-capital line. Presenting financials to the board in a way that drives strategic decisions. Running financial due diligence for a potential acquisition. Evaluating whether the unit economics support moving into a new geography.",
      "Between Series A close and Series B process, how many of those activities are live at once? Usually one, sometimes two. For the months in between, the CFO is doing the operational work anyway because the infrastructure beneath them does not exist. They are closing the books, chasing GST reconciliation, reviewing the payroll run. Work they are overqualified for and often not particularly good at, because operational finance and strategic finance are genuinely different skills.",
      "**Hiring a CFO before the company needs a CFO is expensive in two ways.** You pay the salary. And you get a mediocre controller, because that is not what they were hired to do.",
      "## What outsourced controllership actually covers",
      "When we take on a controllership engagement for a Series A company, the scope covers six areas.",
      "Bookkeeping and monthly close. Every transaction recorded, books closed within ten working days of month-end, ledger reconciled against bank statements. This sounds basic. At most companies between Series A and B, it is being done late, inconsistently, or by someone who is already stretched across three other roles.",
      "GST compliance. Return filings (GSTR-1, GSTR-3B), input tax credit reconciliation, notices handled, annual return prepared. For a SaaS business with B2B and B2C revenue streams, or a D2C brand with multiple fulfilment states, GST compliance is not a once-a-quarter task. It is ongoing work that requires someone who knows what they are doing.",
      "Income tax. Advance tax calculations, TDS deductions and filings, return preparation, managing any assessments. Tax positions that made sense at seed stage get reviewed for appropriateness at Series A scale.",
      "MIS reporting. A monthly management information pack that the board and investors can actually use. P&L with commentary, cash-flow statement, receivables ageing, departmental cost variance, a few key operating metrics tied to the financials. Delivered by the 15th of every month.",
      "Payables and receivables management. Vendor invoice processing, payment runs on a defined schedule, customer invoice generation and follow-up. Keeping the cash cycle under control.",
      "Payroll processing. Monthly payroll with statutory deductions, PF and ESIC filings, Form 16 at year-end. For a 30-80 person company, this is a job in itself.",
      "**This is the operational spine of the finance function.** A CFO generally does not want to run it. A controller loves it. An outsourced team does it at scale.",
      "## The cost comparison",
      "A qualified CFO for a Series A SaaS or D2C company in India costs Rs. 50-80 lakh per year all-in. That figure includes gross salary, employer PF contribution, gratuity provision, performance bonus, and the overhead of the role (laptop, benefits, ESOPs). For a genuinely strong candidate with relevant experience, Rs. 70 lakh all-in is a reasonable planning number.",
      "An outsourced controllership and compliance engagement covering everything listed above runs Rs. 6-12 lakh per year for a 30-100 person company. The range depends on transaction volume, the number of GST registrations, payroll complexity, and whether quarterly board packs are in scope.",
      "The gap is Rs. 58-68 lakh per year. For a company that is not yet at Series B, that is a meaningful number. It is also not just about cash. The outsourced team brings a bench of specialists: a GST practitioner who does nothing but GST, a direct-tax manager who handles assessments, a payroll specialist. The CFO you hire at Rs. 70 lakh is one person trying to cover all of it.",
      "The right question is not whether Rs. 70 lakh is too much to spend on finance. The right question is what you are getting for it. If you need a CFO, Rs. 70 lakh is reasonable. If what you actually need is a controller and a compliance layer, Rs. 70 lakh is the wrong spend.",
      "## When to actually hire a CFO",
      "The inflection point where a CFO becomes the right hire is when the strategic finance work is large enough to justify a full-time senior salary. That typically happens at one of four moments.",
      "**Series B process is 12-18 months away.** A CFO who joins a year before the fundraise has time to build the financial model, establish credibility with the existing investors, and be a credible presence across the diligence process. A CFO who joins three months before the process opens is a liability.",
      "Debt structuring is on the table. Working-capital lines, revenue-based financing, term debt for asset-heavy operations. These require a senior finance person who can negotiate with lenders and structure the instruments correctly. This work does not outsource well.",
      "The board requires a CFO-level presence. Some institutional investors at Series B or later insist on a CFO as a condition of the round or of board governance. At that point the hire is not a choice.",
      "M&A or secondary transactions are in scope. Acquisition targets require financial due diligence. A secondary transaction requires a seller-side financial package. Both need a CFO who can own the process and stand behind the numbers.",
      "For most companies, none of these are live between Series A close and Series B prep. Which means the right answer is outsourced controllership for 18-24 months, then a CFO hire timed to the Series B process.",
      "### The vCFO bridge",
      "There is a middle option worth naming. A virtual CFO, or vCFO, engagement sits above controllership and below a full-time hire. It typically means three to four days per month of senior finance time: board pack review, investor-relations support, budget sign-off, one-off analysis. This bridges the gap when the founder needs someone credible to stand in front of the board, but not yet a full-time hire. We offer this as a bolt-on to controllership engagements when the company is 9-12 months from a fundraise.",
      "## What to look for in an outsourced provider",
      "Not all outsourced finance providers are the same. The difference between a firm that runs your compliance calendar and a firm that runs your finance function is significant.",
      "The first thing to check is whether the firm has dedicated practitioners for each area. GST compliance handled by a specialist is materially different from GST compliance handled by a generalist accountant who also does your books. Ask directly: who will handle your GST filings, what is their background, how many GST assessments have they managed.",
      "The second is the MIS capability. A lot of accounting firms can close your books. Fewer can produce a management information pack that a Series A investor would find credible. Ask to see a sanitised sample. Look at whether the commentary explains variance, or whether it just restates the numbers.",
      "The third is responsiveness to change. Your business will change between Series A and Series B. New revenue lines, a new entity, a state expansion. The outsourced team needs to absorb those changes without the whole engagement falling apart. Ask how they have handled similar changes for other clients.",
      "**The fourth is the handover plan.** A good outsourced provider knows that their job ends when you hire a CFO. They should be able to describe clearly what a handover looks like: documented processes, clean working papers, a well-labelled data room. Providers who are vague about this are providers who have not done it cleanly before.",
      "The founders who get this decision right are the ones who separate the question 'do we need a finance function' from the question 'do we need a CFO'. The answer to the first question is always yes. The answer to the second depends on what the finance function is actually being asked to do.",
    ].join('\n\n'),
    authorSlug: 'rajat-singla',
    publishedOn: '2026-05-17',
    readMinutes: 9,
    tag: "vCFO",
    serviceSlugs: ['finance-outsourcing'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'roc-filings-that-fail-diligence',
    title: "ROC filings that fail diligence: the six that trip up startups",
    excerpt:
      "Six secretarial gaps surface in late-stage diligence more than any others. All six are preventable in real time. None of them are hard to fix before you go to market.",
    body: [
      "Late-stage diligence has a pattern. The investor's lawyer sends an initial document request list. A company that has maintained its secretarial compliance well responds quickly and cleanly. A company that has not spends three weeks pulling together filings, reconciling discrepancies, and writing explanatory memos that nobody should have had to write.",
      "The painful part is that the gaps causing these three-week delays are almost always the same six. We see them across industries, across company stages, across founders who are otherwise disciplined. Secretarial compliance sits in the background while a startup is growing, and the ROC portal does not send reminders when a filing slips by.",
      "What follows is a practitioner account of each gap: what the filing is, how diligence finds it, and how to close it before you invite buyers or investors into a data room.",
      "## Why ROC filings surface so reliably in diligence",
      "The Ministry of Corporate Affairs' public registry is fully searchable. Any diligence team with access to the MCA21 portal can pull a company's complete filing history in under ten minutes. They do not need to ask for it. They will notice the gaps before the first diligence call.",
      "What they find stays in the memo. A charge that should have been satisfied two years ago still showing as live. A director appointment that appears in the board minutes but has no corresponding DIR-12 on file. An annual return that reports 800 equity shares when the cap table says 1,000. Each of these becomes a line item in the legal due diligence report, and each one raises a question the seller has to answer under time pressure.",
      "The answer to each question exists. The underlying event happened. The documentation exists somewhere. The problem is that nobody filed the paperwork with the ROC at the time, and fixing it under diligence scrutiny is both slower and more expensive than fixing it in advance.",
      "## PAS-3: missing allotment returns",
      "PAS-3 is the return of allotment under Rule 12 of the Companies (Prospectus and Allotment of Securities) Rules, 2014. It must be filed within 30 days of any allotment of shares, whether to angel investors, a venture fund, employees exercising options, or a strategic partner taking a small stake.",
      "The failure mode is straightforward. A startup closes a round, issues share certificates, updates its internal cap table, and moves on. The PAS-3 gets missed because it feels administrative after the deal is done. Founders sometimes rely on their CA to file it and the CA assumes the company secretary has it covered.",
      "**Diligence catches this when the filed allotment history does not match the cap table.** If the cap table shows four allotment events and the MCA portal shows three PAS-3 filings, the discrepancy is visible to any diligence team within the first hour. The investor's lawyer then sends a query: please provide the PAS-3 for the missing allotment. If it does not exist, the company has to file a belated PAS-3 with additional fee under Section 460 of the Companies Act, 2013, and explain the delay.",
      "The fix before going to market: reconcile every allotment event against your PAS-3 filing history on MCA21. File any missing returns. If a belated filing is needed, do it with full fee payment and keep the payment receipts in the data room.",
      "## MGT-7: annual return inconsistencies against the cap table",
      "MGT-7 is the annual return every company must file under Section 92 of the Companies Act, 2013. It captures the shareholding pattern as of the financial year-end and is one of the first documents a diligence team cross-checks against the founder-submitted cap table.",
      "The inconsistency usually comes from timing. A funding round closes in January. The financial year-end is March. The founder updates the internal cap table immediately after the closing. The MGT-7 filed for the year ending March captures the post-round shareholding. If the PAS-3 was not filed, or if the ROC registration of the share certificate was delayed, the MGT-7 may reflect a shareholding that does not yet incorporate the round. Alternatively, a round that closed in April may not appear in the MGT-7 for the year just ended, which looks like the round was not disclosed.",
      "Either way, the investor's lawyer flags the discrepancy and asks for an explanation. The explanation, even when it is entirely benign, takes time.",
      "**The fix is to maintain a running reconciliation document** that maps every allotment event to the MGT-7 in which it should appear, and to verify this document before going to market. The reconciliation should cover at least the last three financial years. Any unexplained gap needs a memo explaining the timing.",
      "## DIR-12: unfiled director changes",
      "DIR-12 is the form for intimating the ROC of changes in directors or key managerial personnel, required under Section 170 of the Companies Act, 2013. It must be filed within 30 days of any appointment, resignation, or cessation of a director.",
      "This is one of the most common gaps in early-stage companies. A co-founder steps back from the board but stays in an advisory role. An independent director is added to satisfy an investor requirement. A nominee director from a seed fund is replaced when a new fund lead takes over. Each of these events requires a DIR-12.",
      "The problem is not that founders are unaware of DIR-12. The problem is that the filing feels less urgent than the associated paperwork: the resignation letter, the board resolution, the new appointment letter. Those documents get filed in the data room. The DIR-12 gets forgotten.",
      "When diligence cross-checks the MCA director list against the current board composition and finds a mismatch, they flag it as a possible governance issue. A director who resigned two years ago but still appears on the MCA registry looks like an oversight that calls other compliance into question.",
      "**Fix it by pulling the full director history from the MCA portal** and comparing it against your board minutes going back to incorporation. Any appointment or cessation without a corresponding DIR-12 needs to be filed. Add the belated filings, the additional fees paid, and a brief explanatory note to the data room.",
      "## MGT-14: missed board resolution filings",
      "### Which resolutions require MGT-14",
      "Not every board resolution needs to be filed with the ROC. The ones that do are specified in Section 117 of the Companies Act, 2013, and include resolutions to borrow money beyond prescribed limits, approve related-party transactions, make political contributions, change the registered office, alter the MOA or AOA, approve mergers, and take certain other specified actions.",
      "The MGT-14 must be filed within 30 days of the resolution being passed.",
      "Startups miss this filing for two reasons. First, a company secretary was not engaged at the time of the resolution, so the MGT-14 obligation was not flagged. Second, the resolution is categorised by the founder as routine when it actually falls within the Section 117 list.",
      "### How diligence surfaces it",
      "Diligence counsel asks for copies of all board and shareholder resolutions. They also check the MCA portal for MGT-14 filings. If a resolution approving a significant related-party transaction appears in the board minutes but there is no corresponding MGT-14, the gap is visible. Counsel may also note that the company appears to have borrowed above the limit under Section 180(1)(c) without a filed special resolution.",
      "**The fix is to audit every board resolution passed in the last five years** against the Section 117 list. A qualified company secretary can do this in a day. Any MGT-14 not filed should be filed with late fee. The data room should contain a clean resolution log showing filing status for each relevant resolution.",
      "## CHG-4: charge satisfaction not filed when loans are repaid",
      "When a company takes a term loan or working capital facility, the lender registers a charge with the ROC under Section 77 of the Companies Act, 2013. This creates a public record that the company's assets are encumbered. When the loan is repaid, the charge must be satisfied, and the satisfaction must be filed with the ROC using Form CHG-4 within 30 days of repayment.",
      "The CHG-4 gap is almost entirely a problem of follow-through. The company repays the loan. The bank issues a No Objection Certificate. The team considers the matter closed. Nobody files the CHG-4.",
      "Two years later, a diligence team pulls the charge register on MCA21 and finds three live charges on the company's assets. Two of those loans were repaid years ago. The charge register still shows them as active. To the buyer's counsel, this looks like undisclosed encumbrances until the company produces the NOC letters and explains the missed filings.",
      "**The practical fix is simple.** Pull the full charge register from MCA21. For every charge that appears as live, check whether the underlying loan is actually outstanding. If it has been repaid, get the NOC from the lender and file CHG-4 with applicable late fee. If the loan is genuinely live, document it clearly in the data room. A buyer can accept outstanding charges. What they cannot accept is ambiguity about which charges are real.",
      "## BEN-2: significant beneficial ownership chain not maintained",
      "### What BEN-2 captures",
      "The Significant Beneficial Ownership rules under Section 90 of the Companies Act, 2013, require every company to identify individuals who hold, directly or indirectly, more than 10 percent of shares or voting rights, or who exercise significant influence or control. Companies must file BEN-2 with the ROC when a significant beneficial owner (SBO) is identified or when their interest changes.",
      "For most startups with a clean ownership structure, this is straightforward. The founders hold shares directly; their names appear on the register. The challenge arises when a fund invests through a nominee or through a special-purpose vehicle, when an angel investor holds through a family trust, or when a foreign investor invests through a holding company in Mauritius or Singapore.",
      "### Why diligence flags the gap",
      "A diligence team doing a cross-border transaction or an AIF investment will ask specifically about SBO compliance. They want to see the BEN-2 filings and the declarations received from shareholders in Form BEN-1. If a fund invested three years ago through an SPV and nobody identified the SPV as requiring SBO analysis, the BEN-2 was never filed.",
      "**The gap matters because it is a sign that the ownership chain has not been mapped.** A buyer taking a controlling stake needs to know who they are buying from, in full. A chain that terminates at an SPV with no BEN-2 filing triggers a detailed legal query and, in some transactions, an escrow holdback until the chain is clean.",
      "The fix starts with mapping every shareholder that holds above 10 percent and tracing the beneficial owner behind any non-individual shareholder. Any SBO identified through that exercise needs to have filed a BEN-1 declaration with the company, and the company must file BEN-2 with the ROC. If that chain was never established, build it now. The company secretary engagement required to do this is modest. The delay it causes in diligence if left undone is not.",
      "## Fixing these before you go to market",
      "The six filings above cover the majority of ROC-related diligence queries we see. Running through them takes two to three days of focused secretarial work, which is a small fraction of what the same issues cost to explain and remediate under live diligence pressure.",
      "The process we recommend: six to eight weeks before any diligence event, pull the full filing history from MCA21, reconcile each of the six categories against internal records, identify gaps, and file with late fee as required. Document the remediation in the data room with receipts, explanatory notes, and the supporting board resolutions.",
      "A clean ROC record does not win a deal. A messy one can slow it by four to six weeks and, in the wrong transaction, give a buyer a basis to reprice. The remediation work is entirely within a company's control, and the earlier it is done, the lower the cost.",
    ].join('\n\n'),
    authorSlug: 'neha-rathore',
    publishedOn: '2026-05-17',
    readMinutes: 9,
    tag: "ROC filings",
    serviceSlugs: ['corporate-secretarial'],
    reviewerStatus: 'pending',
  },
  {
    slug: 'cat-i-vs-cat-ii-aif-structural-choice',
    title: "Category I vs Category II AIF: the structural choice you cannot reverse",
    excerpt:
      "Founders launching an AIF treat the category selection as a formality. It is not. The category you register under shapes investment restrictions, tax allocation mechanics, GP economics, and the perimeter of what you can ever change about the fund.",
    body: [
      "SEBI's AIF Regulations, 2012 divide alternative investment funds into three categories. Most fund lawyers will tell you the right one for your strategy within a few minutes of hearing what you plan to invest in. What they often do not walk you through is what the category locks in, what it leaves open, and where the two categories that are most commonly confused actually diverge in ways that surface years after registration.",
      "Category I and Category II sit in the same tax treatment bucket. They have the same basic GP/LP construct. They can both raise from the same pool of investors. From the outside, they look similar enough that founders launching a first fund sometimes treat the choice as a label question rather than a structural one. The choice is structural. Once SEBI registers your fund under a category, you cannot move it.",
      "This article covers the definitions and use cases, the investment restrictions that follow from the category, how the tax pass-through mechanics differ in practice even when the headline benefit is the same, what this means for GP/LP economics, what is and is not reversible after registration, and the single question worth settling in week one of fund formation.",
      "## What SEBI defines and why the definitions are narrower than they look",
      "Regulation 3 of the SEBI (Alternative Investment Funds) Regulations, 2012 sets the categories.",
      "**Category I** covers funds that invest in start-ups, SMEs, social ventures, infrastructure, and related sectors that the government or SEBI considers economically or socially desirable. The sub-categories are Venture Capital Funds, SME Funds, Social Impact Funds, Infrastructure Funds, and, as added later, Special Situation Funds under the 2020 amendment. The common thread is that Category I funds are investing in segments where SEBI perceives a positive spillover and therefore extends the pass-through benefit without additional conditions.",
      "**Category II** is the residual category. Any AIF that is not a Category I or a Category III fund falls here. In practice this means private equity funds, debt funds, real estate funds, and fund-of-funds that do not qualify as Category I. Category II funds cannot borrow except for day-to-day operational needs and cannot lever the portfolio at the fund level.",
      "Category III covers funds that use complex strategies, leverage, or trade in listed or unlisted derivatives. Hedge funds and long-short equity funds sit here. Category III does not get the pass-through tax benefit. We are not covering Category III in this article.",
      "The definitions look clean. The practical complication is that Category I sub-categories have hard edges. A fund calling itself a Venture Capital Fund under Category I must invest at least two-thirds of its investable funds in unlisted equity or equity-linked instruments of start-ups, emerging or early-stage ventures, or SMEs as defined under the MSMED Act. If your strategy is to invest in late-stage pre-IPO companies with some secondary purchase, you likely do not fit the Category I Venture Capital Fund definition. You are a Category II fund, whether or not you want the VC label.",
      "## Investment restrictions and concentration limits",
      "Category I and Category II funds both face a base concentration limit: no more than 25% of the investable funds in a single investee company. SEBI tightened certain sub-limits through its 2023 circular on AIF investments, so check the current version of Regulation 15 and the applicable circulars at the time of registration.",
      "The more important restriction is what Category II funds cannot do. They cannot invest in funds-of-funds beyond what Regulation 15(1)(d) permits and they cannot take leveraged positions at the fund level. The Category I restriction is different in character: you are constrained by the sub-category's asset definition, not just a concentration cap.",
      "One practical consequence: a Category I Venture Capital Fund that wants to put 15% of its corpus into a large, late-stage company that happens to be profitable and 15 years old will find the definition does not accommodate that neatly. A Category II fund can make that allocation freely, subject to the 25% cap and its own investment policy. The freedom is narrower under Category I because the category comes with a sectoral obligation, not just a permission.",
      "### Co-investments and the category constraint",
      "Co-investments from an AIF sit under the main fund's category. If your registered fund is Category I, a co-investment vehicle you run alongside it will also need to be registered separately and will be examined for Category I eligibility on its own. This has practical implications for fund managers running a main fund and a sidecar: if the sidecar's investments differ enough from the Category I sub-category definition, the sidecar is a Category II fund and cannot borrow from the Category I brand for regulatory purposes.",
      "## Tax pass-through: the same headline, different mechanics",
      "Both Category I and Category II AIFs get pass-through tax treatment under Section 115UB of the Income Tax Act, 1961. The income earned at the fund level is not taxed at the fund; it passes through to the unit-holders and is taxed in their hands at the rate applicable to their character of income.",
      "This is the right headline. The operational mechanics below the headline diverge.",
      "### How losses flow",
      "Business losses of a Category I fund pass through to the unit-holder and can be set off against the unit-holder's income from business. Capital losses similarly pass through. The practical benefit is that an investor in a Category I fund can use a loss in year two of the fund to offset gains elsewhere in that assessment year, subject to the normal set-off rules.",
      "For Category II funds, the same pass-through applies but the character of the loss is preserved as it passes. A capital loss from a debt fund position remains a capital loss for the unit-holder. This sounds similar to Category I treatment but the investor base for a Category II debt fund is often corporate treasuries, which have different set-off appetites than the family-office investors who dominate Category I VC funds.",
      "### The withholding problem",
      "Category I and II funds are required to withhold tax on distributions to unit-holders under Section 194LBB at 10% for resident unit-holders. This is mechanically straightforward. The complexity arises when the fund has a mix of domestic and foreign investors, or when a unit-holder is a tax-exempt entity like a provident fund. Getting the withholding right at the time of distribution requires the fund administrator and the fund's tax counsel to classify each investor's character correctly before the distribution waterfall runs. This is a fund operations question, not a category question, but the category determines which income is being allocated and in what sequence.",
      "## GP/LP economics: carry, hurdle, and what category changes",
      "The standard GP/LP waterfall looks the same for Category I and Category II funds on paper: return of capital, preferred return to LPs (the hurdle), a catch-up for the GP, then carried interest split. SEBI does not prescribe the waterfall structure, so fund documents govern.",
      "The category affects the economics indirectly through two channels.",
      "First, the investor base for a Category I VC fund skews toward high-net-worth individuals, family offices, and smaller institutional money. Hurdle rates in the 8-10% range are standard. Carry splits of 20% are conventional. The negotiating dynamic is relatively founder-friendly because the GP is often the fund's primary differentiator and investors are buying access.",
      "A Category II PE or debt fund more typically raises from larger institutional investors, FIIs registered as FPIs, insurance companies, and corporate treasuries. These investors negotiate harder on hurdle rates (10-12% is common in debt funds) and occasionally on the carry split. The GP economics per rupee of AUM may be thinner, but the AUM scale of Category II funds typically compensates.",
      "Second, management fee structures differ in practice. Category I VC funds tend to charge 2% on committed corpus during the investment period and 2% on invested corpus during the harvesting period. Category II PE funds often negotiate stepped fees. Neither structure is mandated by SEBI for the respective category, but the investor base of each category creates market conventions that will push back if you deviate significantly.",
      "## What is irreversible after registration",
      "SEBI does not provide a mechanism to convert a registered AIF from one category to another. If you register under Category II and subsequently find that the fund's strategy has evolved toward early-stage VC investing, you cannot amend your registration to Category I. You would need to surrender the existing registration and apply for a new one, which means a new registration number, a new fund vehicle, and a new fund raise. Existing investors in the Category II vehicle remain in it.",
      "What you can change after registration, within limits: the investment strategy can be amended with investor consent, the fund tenure can be extended by up to two years with two-thirds consent of unit-holders, the management fee can be revised with investor consent, and side-pocket provisions can be added if the fund documents permit.",
      "The category boundary is also reflected in the AIF's annual compliance filings to SEBI under Regulation 34. Investments that fall outside the category's permitted universe must be disclosed and will attract scrutiny. A Category I Venture Capital Fund that has made a debt investment in a portfolio company without an equity kicker does not fit cleanly into the Regulation 2(b)(i) definition and will need to explain the position.",
      "## The question to settle in week one",
      "Before the term sheet is signed, before the fund documents are drafted, before the SEBI application is filed, one question determines everything else: what is the fund's investment mandate, precisely, and does it fit a Category I sub-category or is it residual?",
      "This is not a question to answer based on what the GP would prefer. It is a question to answer based on what the portfolio is actually going to look like in years two through five. We sit with founders in the first week and work through the intended portfolio company profile: sector, stage, instrument (equity, compulsory convertible, debt with warrants, pure debt), and the likely proportion of each. When the portfolio map is written down, the category question usually answers itself.",
      "If the map fits Category I, the next question is which sub-category and whether the two-thirds concentration rule is genuinely workable for the strategy. If it is not, the fund is Category II regardless of branding preference.",
      "The AIF registration application to SEBI requires a detailed investment strategy document. SEBI's examination team will read it. Category claims that do not match the strategy document create back-and-forth at the application stage that delays registration by months. Getting the category right at week one means the application goes in clean.",
      "## One irreversible label, many downstream consequences",
      "The category selection is the first major governance decision in a fund's life and the only one that cannot be undone. It shapes who you can raise from, what you can invest in, how losses flow to investors, what market conventions apply to your GP economics, and what your compliance calendar looks like for the fund's life.",
      "We work through this with every fund formation client before the documentation phase starts. The conversation is short when the strategy is clear. It takes longer when the GP has not yet decided whether the fund is a VC fund with some debt capacity or a debt fund with equity optionality. That decision needs to be made. The SEBI registration process will force it eventually. Better to make it in week one, at a whiteboard, than in month three, under a deadline.",
    ].join('\n\n'),
    authorSlug: 'neha-rathore',
    publishedOn: '2026-05-17',
    readMinutes: 9,
    tag: "AIF structuring",
    serviceSlugs: ['aif-fund-management'],
    reviewerStatus: 'pending',
  },
];

export function getArticlesForService(slug: string, opts?: { allowDrafts?: boolean }) {
  const allowDrafts = opts?.allowDrafts ?? false;
  return articles
    .filter((a) => a.serviceSlugs.includes(slug))
    .filter((a) => (allowDrafts ? true : a.reviewerStatus === 'approved'))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export function getArticleBySlug(slug: string, opts?: { allowDrafts?: boolean }) {
  const allowDrafts = opts?.allowDrafts ?? false;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return undefined;
  if (!allowDrafts && article.reviewerStatus !== 'approved') return undefined;
  return article;
}
