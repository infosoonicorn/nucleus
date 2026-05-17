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
};

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
    publishedOn: '2026-04-12',
    readMinutes: 5,
    tag: 'Term sheet',
    serviceSlugs: ['investment-banking'],
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
    publishedOn: '2026-04-02',
    readMinutes: 6,
    tag: 'Investor narrative',
    serviceSlugs: ['investment-banking', 'ma-advisory'],
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
    publishedOn: '2026-03-22',
    readMinutes: 5,
    tag: 'Cap table',
    serviceSlugs: ['investment-banking'],
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
    publishedOn: '2026-03-08',
    readMinutes: 8,
    tag: 'Term sheet',
    serviceSlugs: ['investment-banking', 'ma-advisory'],
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
    publishedOn: '2026-02-26',
    readMinutes: 6,
    tag: 'Term sheet',
    serviceSlugs: ['investment-banking'],
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
    publishedOn: '2026-02-14',
    readMinutes: 5,
    tag: 'Process',
    serviceSlugs: ['investment-banking'],
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
    publishedOn: '2026-01-29',
    readMinutes: 7,
    tag: 'Readiness',
    serviceSlugs: ['investment-banking'],
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
    publishedOn: '2026-01-15',
    readMinutes: 7,
    tag: 'M&A',
    serviceSlugs: ['investment-banking', 'ma-advisory'],
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
    publishedOn: '2025-12-18',
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
    publishedOn: '2025-12-04',
    readMinutes: 6,
    tag: 'Capital strategy',
    serviceSlugs: ['investment-banking', 'ma-advisory'],
    reviewerStatus: 'pending',
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
    thumbnailSrc: '/article-thumbs/first-30-days-of-a-sell-side-process.jpg',
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
