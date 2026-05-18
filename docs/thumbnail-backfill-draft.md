# Article thumbnail backfill — draft for review

Drafted hooks + emphasis word + photo spec for each of the 18 existing articles in `apps/web/src/content/articles.ts`. Review, edit, or replace any line. Once approved (or once the first 3 are approved), I run the pipeline:

1. Generate each photo via OpenAI image API (Codex CLI batch loop), keyed by `<slug>`.
2. Upload each as a Canva asset.
3. Autofill the brand template `EAHJ7zOuHG4` with `{headline: thumbnailHook, background_photo: <uploaded asset id>}`.
4. Export 1280×720 JPG to `apps/web/public/article-thumbs/<slug>.jpg`.
5. Write `thumbnailHook`, `thumbnailHookEmphasis`, and `thumbnailSrc` into `articles.ts`.

**Hook rules followed** (see [docs/article-thumbnail-hook-guide.md](article-thumbnail-hook-guide.md)): never reuses title; max 7 words; sentence form with full stop; asserts a claim; pulled from the article body; no marketing scaffolding.

**Photo conventions** (per user's "let each photo be its own thing" choice): 16:9 widescreen, no people / no faces, no text in image, no Nucleus logo (the template adds it). Left third compositionally clear so the white card + headline overlay reads. Beyond that — each photo is free to set its own mood, palette, and subject.

---

## Investment Banking (Vijay Singh Rathore)

### 1. `math-of-dilution`
- **Title:** The math of dilution: what a $5M raise actually costs you over 18 months
- **Hook:** `Eighty percent becomes forty-four.`
- **Emphasis:** `forty-four`
- **Photo spec:** Overhead editorial shot of three pie charts hand-drawn on cream paper, progressively shrinking left to right. A black fountain pen, a small calculator showing "44", and a coffee cup ring on the paper. Warm window light from upper-right. Shallow depth of field. Mood: quiet, financial.

### 2. `how-investors-read-im`
- **Title:** How investors really read your information memorandum — and what they skip
- **Hook:** `Forty pages they won't read.` *(already shipped — keeping)*
- **Emphasis:** `read`
- **Photo spec:** *Already shipped at `/article-thumbs/how-investors-read-im.jpg` — moody dark desk, open IM, partial laptop, fountain pen, espresso. Skip regeneration.*

### 3. `cap-table-hygiene`
- **Title:** Cap-table hygiene: the six mistakes we see in first-time founder docs
- **Hook:** `Your cap table adds to 100.4.`
- **Emphasis:** `100.4`
- **Photo spec:** Close-up of a printed spreadsheet on a wooden desk, columns of percentages, one red pen-circle around a total row reading "100.4%". A reading-glasses pair resting on the page. Bright morning daylight. Mood: forensic, slightly anxious.

### 4. `term-sheet-line-by-line`
- **Title:** Term sheet line-by-line: liquidation preference, anti-dilution, drag-along, tag-along
- **Hook:** `The clause you didn't read.`
- **Emphasis:** `didn't`
- **Photo spec:** Folded two-page term sheet on dark walnut desk, one single clause underlined in red marker, a vintage brass magnifying glass laid across the page. Dramatic side-light from a green banker's lamp. Mood: solemn, legal.

### 5. `anti-dilution-clauses-explained`
- **Title:** Anti-dilution clauses explained: weighted-average vs full-ratchet, and why it matters
- **Hook:** `Full-ratchet doubles the damage.`
- **Emphasis:** `doubles`
- **Photo spec:** Macro shot of an actual mechanical ratchet wrench laid diagonally across a printed cap-table sheet. Cool blue-grey palette. Hard directional light from the right casting a long shadow of the wrench across the document. Mood: mechanical, ominous.

### 6. `14-day-pitch-to-term-sheet-myth`
- **Title:** The 14-day pitch-to-term-sheet myth: what actually goes into a fast close
- **Hook:** `Two weeks is a fairy tale.`
- **Emphasis:** `fairy tale`
- **Photo spec:** Top-down view of a paper wall calendar, fourteen consecutive days marked in red, surrounded by a chaotic spread of prep documents — financial model printouts, customer reference list, board minutes — half-stacked, half-strewn. Soft overcast light. Mood: pressured, real.

### 7. `fundraise-readiness-audit`
- **Title:** Fundraise readiness audit: nine things a partner-led review actually finds
- **Hook:** `Nine cracks before diligence finds them.`
- **Emphasis:** `Nine`
- **Photo spec:** Clipboard with a printed 9-item checklist, four items ticked in green, three in red, two with question marks. Resting on a navy blotter. A coffee cup, a phone face-down, a Mont Blanc pen. Warm cabin light. Mood: audit, methodical.

### 8. `strategic-exit-vs-pe-buyout`
- **Title:** Strategic exit vs. PE buyout: which conversation are you actually in?
- **Hook:** `Two doors. Different lives behind each.`
- **Emphasis:** `Different`
- **Photo spec:** Conceptual still life — two identical sealed manila envelopes on a slate-grey surface, each labelled with a small printed wax-seal — one reading "STRATEGIC", one reading "PE". A pair of reading glasses between them. Cool overhead studio lighting. Mood: deliberation.

### 9. `esop-economics-for-founders`
- **Title:** ESOP economics for founders: when to top up, how to model the dilution
- **Hook:** `Half a point at a time.`
- **Emphasis:** `Half`
- **Photo spec:** Overhead pie chart drawn in ink on cream paper, with a thin red wedge labelled "ESOP" carved out. A pencil eraser mid-erasing a previous wedge boundary, leaving graphite smudges. Soft side-light. Mood: small adjustments, accumulating.

### 10. `case-for-outside-banker`
- **Title:** The case for hiring an outside banker — even when you have a great cap table
- **Hook:** `Your network is fifteen names.`
- **Emphasis:** `fifteen`
- **Photo spec:** Top-down shot of a printed contact list with names redacted to grey bars, counted neatly in the margin to "15". Next to it, a much larger printed list labelled in a header "Active mandates" with rows trailing off the frame. Cool morning light. Mood: scope contrast.

---

## M&A Advisory (Pravesh Goel)

### 11. `first-30-days-of-a-sell-side-process`
- **Title:** The first 30 days of a sell-side process: what actually happens
- **Hook:** `Week one is paperwork.`
- **Emphasis:** `paperwork`
- **Photo spec:** Tall stack of black ring binders on a glass conference-room table, three of them open with tabs sticking out colour-coded blue, red, yellow. Late afternoon light filtered through floor-to-ceiling glass behind them. Slight motion blur on a hand reaching in. Mood: serious, corporate, in-progress.

---

## Risk Advisory (Ashish Gupta)

### 12. `five-control-failures-nbfc-internal-audit`
- **Title:** What internal audit actually catches in an NBFC: five recurring control failures
- **Hook:** `Five gaps we always find.`
- **Emphasis:** `always`
- **Photo spec:** Overhead shot of an audit working-file binder, opened to a tabbed section with red flag stickers protruding from five places. A bank ledger printout half-visible beneath. A green-shaded banker's lamp casting a pool of warm light. Mood: investigative, deliberate.

---

## Tax & Regulatory (Abhishek Gupta)

### 13. `gst-refund-procedural-failures`
- **Title:** GST refunds that get blocked: the procedural failures that delay claims
- **Hook:** `Refunds die in the cover letter.`
- **Emphasis:** `die`
- **Photo spec:** Close-up of a printed GST refund form stamped diagonally with a red rubber stamp reading "DEFICIENCY" (or similar bureaucratic mark). A second sheet underneath visible at the edge, with a hand-written annotation in blue ink. Cool fluorescent-style overhead light, slight government-office sterility. Mood: bureaucratic friction.

---

## Assurance (Abhishek Gupta)

### 14. `statutory-audit-questions-founders-dread`
- **Title:** Statutory audit: the questions founders dread and how to make them routine
- **Hook:** `Four questions, one bad week.`
- **Emphasis:** `one`
- **Photo spec:** Editorial overhead of an open audit working-paper file on a dark green leather desk, a black fountain pen mid-margin-note, a small calculator showing a long decimal, an Ind-AS reference book open to a tabbed page. Warm tungsten desk-lamp light, deep shadows. Mood: late-night audit room.

---

## Valuations (Vijay Singh Rathore)

### 15. `esop-valuation-india-409a-playbook`
- **Title:** ESOP valuation in India: why the 409A playbook does not translate
- **Hook:** `The US playbook breaks here.`
- **Emphasis:** `breaks`
- **Photo spec:** Two valuation reports side by side on a desk — one with a US-style cover marked subtly with US visual cues (white/blue palette), the other an Indian-format report with the SEBI merchant-banker letterhead, a wax-style stamp on the corner. A fountain pen lying between them, pointing at the Indian report. Warm light. Mood: divergence.

---

## Finance Outsourcing (Rajat Singla)

### 16. `when-outsourced-finance-beats-hiring-your-first-cfo`
- **Title:** When outsourced finance beats hiring your first CFO
- **Hook:** `You don't need a CFO yet.`
- **Emphasis:** `yet`
- **Photo spec:** An empty corner-office chair pulled back from a desk that holds a single name-plate engraved "CFO" — but the chair is conspicuously vacant. A coffee cup, untouched. A printout of an org chart, with one box at the top blank. Window-light from behind, slightly underexposed. Mood: premature, unfilled.

---

## Corporate Secretarial (Neha Rathore)

### 17. `roc-filings-that-fail-diligence`
- **Title:** ROC filings that fail diligence: the six that trip up startups
- **Hook:** `Six filings that kill diligence.`
- **Emphasis:** `kill`
- **Photo spec:** A fanned spread of six MCA21 form printouts (PAS-3, MGT-7, DIR-12, MGT-14, CHG-4, BEN-2) on a wooden desk, each marked with a red sticker tab. A magnifying glass resting on the top one. Soft overhead daylight. Mood: methodical inspection.

---

## AIF Fund Management (Neha Rathore)

### 18. `cat-i-vs-cat-ii-aif-structural-choice`
- **Title:** Category I vs Category II AIF: the structural choice you cannot reverse
- **Hook:** `One label you can't undo.`
- **Emphasis:** `can't`
- **Photo spec:** A SEBI-style registration certificate (no real seal — abstract embossed gold motif suggesting officialdom) on a dark mahogany desk, a heavy brass embossing stamp half-pressed onto it leaving a visible indentation. A fountain pen, mid-signature. Dim warm light. Mood: irrevocable.

---

## Schema change required

Before this lands in `articles.ts`, the `ArticleBase` type needs two new optional fields:

```ts
type ArticleBase = {
  // ...
  thumbnailHook?: string;
  thumbnailHookEmphasis?: string;
  // ...
};
```

These have already been documented in [docs/article-thumbnail-hook-guide.md](article-thumbnail-hook-guide.md). I'll add them to the type in the same change that lands the first batch of thumbnails.

## Sample 3 for pipeline test

Per your decision to "ship 3 first to test the pipeline, then run the rest", I propose these three as the test batch because they exercise different visual moods (financial precision / bureaucratic friction / corporate gravitas):

1. `math-of-dilution` — Eighty percent becomes forty-four. (warm-cream financial-paper still life)
2. `gst-refund-procedural-failures` — Refunds die in the cover letter. (bureaucratic-friction stamped form)
3. `first-30-days-of-a-sell-side-process` — Week one is paperwork. (corporate-binder-stack)

Approve, edit any line, or tell me to swap. Once the 3 are signed off, I generate photos → autofill template → export → commit, then loop the remaining 14.
