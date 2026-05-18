# Article thumbnail hook — instructions for the article-writing agent

When you write or edit a Nucleus insights article, you must also produce a **`thumbnailHook`** — a short line that becomes the headline on the article's thumbnail image. The thumbnail uses one fixed Canva brand template (locked layout, locked photo, locked Nucleus wordmark); the only variable text is this hook.

This file is the prompt to hand to any agent (or human author) drafting articles. Read it before writing the hook for each article.

> Older sibling doc `docs/article-thumbnails-spec.md` describes the previous workflow (full-image generation via ChatGPT/Codex, CSS overlay). That path is being deprecated in favour of Canva brand-template autofill. Until the migration is complete, prefer the rules below for any new article.

## Brand context (one paragraph)

Nucleus Advisors is a sell-side M&A, fundraise, audit, tax, NBFC compliance, ESOP-valuation, and AIF advisory firm in India. Voice: first-person plural ("we") when the firm speaks; second-person ("you") when talking to a founder. Concrete numbers and named situations beat generalisations. Honest, sometimes inconvenient. Banned vocabulary: "delve", "robust", "nuanced", "crucial", "multifaceted". No three-element parallel constructions used as rhetorical filler. Short sentences allowed.

## What the hook is — and isn't

The hook is **bait that earns a click**, not a summary of the article. It points at the article's most uncomfortable, specific, or counterintuitive claim and stops there. The reader should feel a small flash of recognition or worry and want to read more.

## Hard rules

1. **Never reuse the article title.** If your hook overlaps the title by more than two content words, rewrite. The title and the hook are different jobs: the title indexes; the hook bait-clicks.
2. **Maximum 7 words.** Target 4–6. Word count includes contractions ("won't" = 1).
3. **Two visual lines.** The template breaks naturally between word 3 and word 4. Write so the break lands at a strong place. Good break: `Forty pages / they won't read.` Bad break: `Forty / pages they won't read.`
4. **Sentence form. Ends with a full stop.** No question marks. No ellipses. No exclamation points.
5. **Assert a claim, don't ask one.** ✅ "Investors skip the market section." ❌ "Do investors skip the market section?"
6. **No marketing scaffolding.** Banned openers: "How to", "Why", "The ultimate", "Everything you need", "Tips for", "What you should know", "A guide to", "Discover", "Unlock".
7. **No abstract nouns floating alone.** ❌ "Dilution math" ❌ "Cap-table hygiene tips" — they say nothing. ✅ "What 18 months actually costs." — specific stake.
8. **Pull from the body, not the abstract.** Find one specific number, one named situation, one inconvenient truth inside the article. Paraphrase it into ≤7 words. The hook should be defensible from the article's own text.
9. **No three-element rhetorical parallels.** ❌ "Faster, cheaper, smarter raises." — site-wide voice rule.
10. **No filler verbs.** Cut "really", "actually", "basically", "literally" unless they earn their place by contrast (e.g. *"actually"* paired with an obvious-seeming claim).

## Good vs. bad — concrete examples

| Article slug | ❌ Weak hook (often a rephrased title) | ✅ Strong hook |
|---|---|---|
| `how-investors-read-im` | "How investors read your IM" | "Forty pages they won't read." |
| `math-of-dilution` | "Dilution math explained" | "What 18 months costs you." |
| `first-30-days-of-a-sell-side-process` | "The sell-side timeline" | "Week one is paperwork." |
| `term-sheet-line-by-line` | "Understanding term sheets" | "The clause you didn't read." |
| `cap-table-hygiene` | "Cap-table best practices" | "Six mistakes we keep finding." |
| `14-day-pitch-to-term-sheet-myth` | "Fast fundraises explained" | "Two weeks is a fairy tale." |
| `gst-refund-procedural-failures` | "Why GST refunds get blocked" | "Refunds die in the cover letter." |
| `esop-valuation-india-409a-playbook` | "ESOP valuation in India" | "409A doesn't work here." |
| `roc-filings-that-fail-diligence` | "ROC filings that fail" | "Six filings that kill diligence." |

## Optional: emphasis word

You may flag one word in the hook to be rendered in Nucleus red — the punchline word that delivers the surprise. Examples: in *"Forty pages they won't **read**."* the emphasis is `read`; in *"What 18 months **costs** you."* it's `costs`.

Record this as a sibling field, e.g. `thumbnailHookEmphasis: 'read'`. The current autofill flow does not yet apply per-word color (Canva autofill replaces the text uniformly), so this is forward-looking — but capture it now so we don't have to revisit 80 articles later.

## Output format

When you add or edit an article in `apps/web/src/content/articles.ts`, include the new field alongside the existing ones:

```ts
{
  slug: 'how-investors-read-im',
  title: 'How investors really read your information memorandum — and what they skip',
  excerpt: '…',
  body: […].join('\n\n'),
  authorSlug: 'vijay-singh-rathore',
  publishedOn: '2026-04-02',
  readMinutes: 6,
  tag: 'Investor narrative',
  serviceSlugs: ['investment-banking'],
  thumbnailHook: "Forty pages they won't read.",   // ← new
  thumbnailHookEmphasis: 'read',                    // ← new, optional
  reviewerStatus: 'pending',
},
```

If the `Article` type in `articles.ts` doesn't yet declare these fields, add them as optional (`thumbnailHook?: string; thumbnailHookEmphasis?: string;`) in the same change — keep type and data in sync.

## What you do NOT do

- **Do not generate the JPG.** Thumbnails are batch-generated from the locked Canva brand template (design ID `DAHJ7lHaktM`; once promoted to a Brand Template by Vijay, a `BTM…` ID is captured and a one-shot script fills every article's `thumbnailSrc`). Adding a hook is your only thumbnail responsibility.
- **Do not set `thumbnailSrc`.** The batch script fills it.
- **Do not invent visual concepts.** The old per-article visual cues in `docs/article-thumbnails-spec.md` are no longer applied — every thumbnail uses the same locked photo + autofilled hook.

## Sanity check before you commit

Read your hook out loud. If any of these are true, rewrite:

- It sounds like a LinkedIn carousel cover.
- A founder reading it would not feel anything.
- It could appear on any insights article (i.e. it's generic).
- It restates the title in slightly different words.
- It ends with "?" or "!".
- It's longer than 7 words.

## When in doubt

Find the line in the article body that would make a founder wince, pause, or quietly admit "that's me". Trim it until it fits. That is the hook.

---

# Visual modes — the photo language

The brand frame stays constant on every thumbnail (cream rounded card on the left, navy headline with one red emphasis word, Nucleus wordmark bottom-left). The **photo** is where we get variety. 135+ articles on a single visual pattern would feel like stock-photo wallpaper — so each article is assigned one of **eight visual modes**, and the photo prompt is templated against that mode.

## The eight modes

| Mode | Code | Visual character | Best for | Mood |
|---|---|---|---|---|
| Editorial overhead desk | `A` | Top-down macro of documents, calculators, pens, marker circles on cream or wood | Calculation-heavy, audit, compliance, dilution math, readiness audit | Quiet, forensic, methodical |
| Boardroom / dealmaking | `B` | Wide shot of conference room, leather chairs, glass walls, silhouettes (no faces), golden-hour light | M&A process, term-sheet negotiation, board governance, fundraise process | Gravitas, deal-room, dusk |
| Skyline / financial district | `C` | Tilt-shift skyscrapers, BKC / Bangalore CBD glass towers, blue-hour twilight, distant city lights | Market analysis, sector pieces, AIF structuring, capital-markets opinion, India-vs-global | Scale, ambition, atmospheric |
| Conceptual still-life | `D` | One symbolic object: ratchet wrench, ticking clock, padlock, hourglass, single match, divergent paths | Concept articles (anti-dilution, irreversibility, deadlines, lock-in, choice) | Metaphorical, single-symbol |
| Paper / ink macro | `E` | Close-up of document texture, red marker, fountain pen, wax seals, rubber-stamp impressions, ink margin notes | Term sheets, ROC filings, audit findings, regulatory documents, GST, contracts | Evidentiary, forensic, archival |
| Hands / partial figures | `F` | Hands writing, hands signing, hands gesturing — no faces, just partial figures | Advisory relationship, founder-banker dynamic, hiring conversations, signing moments | Human, in-the-moment |
| Window / threshold / liminal | `G` | View through office window, blinds creating light slats, empty desk, anticipation | Timing pieces ("when should you..."), inflection-point decisions, career transitions | Pause, anticipation, threshold |
| Hand-drawn / whiteboard / scribble | `H` | Photo of hand-drawn chart, sketch on paper, dry-erase markers, scribbled cap-table | Modelling pieces, scenario planning, "how we think", math walkthroughs | Working-it-out, founder-vibe |

## Routing logic — pick the default mode by topic family

| Topic family | Default | Alt option |
|---|---|---|
| Cap-table math, dilution, valuation | **A** | H or D |
| M&A process / sell-side / buyer-list | **B** | F |
| Tax / GST / compliance / regulatory filings | **E** | A |
| Statutory / internal audit | **A** | E |
| Capital markets, AIF structuring, fund formation | **C** | B |
| Founder advisory / strategy / when-to-hire | **F** | G |
| Specific clause / term-sheet line | **E** | D |
| Career / role / org-design / hiring | **G** | F |
| Stat-driven ("X numbers", "Y mistakes") | **D** | A |

Default keeps things predictable. Pick the alt only when the article has a clear reason — e.g. an M&A article that's really about a single conceptual moment goes to **F** instead of **B**.

## Flexibility levers (no extra modes needed)

- **Time of day** — same setup at 7am (cool morning), 2pm (overhead daylight), 6pm (golden hour), 9pm (lamp + window glow). Vary across articles in the same mode so the grid doesn't repeat.
- **Palette tint** — warm wood / cool slate / paper cream / muted teal-grey. Optionally drive by service tag (IB → cool slate, Tax → warm wood, AIF → cool blue).
- **Subject distance** — extreme macro (one object filling frame), medium (workspace), wide (full room). Vary by article weight.

## How to record the mode

In `apps/web/src/content/articles.ts`, add `thumbnailMode` alongside the hook:

```ts
{
  slug: 'first-30-days-of-a-sell-side-process',
  // ...
  thumbnailHook: 'Week one is paperwork.',
  thumbnailHookEmphasis: 'paperwork',
  thumbnailMode: 'B',   // ← new
  reviewerStatus: 'pending',
}
```

The `ArticleBase` type already has `thumbnailMode?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'` declared.

---

# Photo-prompt templates (one per mode)

Each template is a self-contained prompt for Canva's `generate-design` (or any AI image generator). The shared opening sentence locks the technical brief (single full-bleed photograph, no overlays, 16:9, left third clear). The mode-specific paragraph defines the visual language. The `{{SUBJECT}}` and `{{TIME}}` placeholders are filled in per article.

Use these verbatim when generating per-article photo prompts. The article writer or thumbnail-generation script only needs to write 1-2 lines describing the specific subject for that article.

---

## Mode A — Editorial overhead desk

```
A single photograph filling the full 1280x720 frame edge to edge. ONE flat photographic image. NO graphic overlay, NO cream rounded card, NO icons, NO text, NO design composition, NO border, NO logo. Pure unstyled editorial photography. Subject pushed to the right two-thirds of the frame; left third compositionally empty and slightly darker (this empty space will later receive a cream card overlay). No people. No faces. No legible English text in the image.

VIEWPOINT: strict overhead / top-down, perpendicular to the desk surface. Tight crop on the subject.

SUBJECT: {{SUBJECT — describe the objects in the scene: e.g. "a financial spreadsheet with one row circled in red marker, a pair of reading glasses, and a calculator beside it"}}.

LIGHTING: {{TIME — e.g. "warm morning daylight from upper-right" / "soft overcast" / "tungsten desk-lamp pool of light"}}. Shallow depth of field. Subtle paper texture, ink, graphite. The desk surface is wood or matte cream.

Style: Financial Times feature image, Bloomberg Businessweek inset, NOT stock photography. Editorial photojournalism quality.
```

---

## Mode B — Boardroom / dealmaking

```
A single photograph filling the full 1280x720 frame edge to edge. ONE flat photographic image. NO graphic overlay, NO cream rounded card, NO icons, NO text, NO design composition, NO border, NO logo. Pure unstyled editorial photography. Subject pushed to the right two-thirds of the frame; left third compositionally empty and slightly darker.

VIEWPOINT: wide angle, eye-level or above-shoulder, looking across a large conference table or into a meeting room. Depth visible.

SUBJECT: {{SUBJECT — e.g. "a polished glass conference table with three black ring binders at the far end, leather chairs slightly pulled out, glass walls behind"}}. Optional silhouettes of figures in the deep background, BUT NEVER faces — only blurred shapes.

LIGHTING: {{TIME — typically "late afternoon golden hour through floor-to-ceiling windows" / "blue-hour evening with interior lamps lit"}}. Reflections in glass, warm highlights on leather, deep cool shadows. Atmospheric.

Style: editorial business photography, dealmaking gravitas. Vanity Fair business profile, The Economist long-form opener.
```

---

## Mode C — Skyline / financial district

```
A single photograph filling the full 1280x720 frame edge to edge. ONE flat photographic image. NO graphic overlay, NO cream rounded card, NO icons, NO text, NO design composition, NO border, NO logo. Pure unstyled editorial photography. Subject pushed to the right two-thirds of the frame; left third compositionally empty and slightly darker (atmosphere/sky).

VIEWPOINT: wide cityscape, slightly elevated. Glass-tower skyscrapers in the financial district. Optional tilt-shift effect.

SUBJECT: {{SUBJECT — e.g. "Mumbai BKC at blue hour, glass office towers with internal lights on, distant Bandra-Worli Sea Link visible" / "Bangalore CBD skyline from a high window, twilight, glass reflections"}}. No people. No legible signage.

LIGHTING: {{TIME — "blue hour twilight just after sunset" / "early morning cool gold over haze" / "late evening city-lights against indigo sky"}}. Deep saturation in the sky, warm pinpoints of office lights.

Style: editorial business photojournalism, FT long-form feature, atmospheric depth. NOT a tourist postcard.
```

---

## Mode D — Conceptual still-life

```
A single photograph filling the full 1280x720 frame edge to edge. ONE flat photographic image. NO graphic overlay, NO cream rounded card, NO icons, NO text, NO design composition, NO border, NO logo. Pure unstyled editorial photography. Subject pushed to the right two-thirds of the frame; left third compositionally empty and slightly darker.

VIEWPOINT: macro or near-macro, deliberate isolation. The subject is a SINGLE METAPHORICAL OBJECT or a tightly-related pair on a neutral surface.

SUBJECT: {{SUBJECT — pick a metaphor that maps to the article concept. Examples: "a mechanical ratchet wrench laid diagonally across a printed cap-table sheet" (for irreversible dilution); "two identical sealed envelopes with red wax seals on slate" (for two divergent paths); "a brass hourglass with red sand half-spent, on dark mahogany" (for deadlines); "a single match struck, smoke rising, against a dark stone wall" (for ignition moments)}}.

LIGHTING: {{TIME — typically directional and dramatic: "hard side-light from the right casting a long shadow across the surface" / "single overhead pool of warm light"}}. Strong contrast. Deep blacks around the subject.

Style: editorial conceptual photography, New York Times Magazine inset, idea-as-image. The object IS the headline.
```

---

## Mode E — Paper / ink macro

```
A single photograph filling the full 1280x720 frame edge to edge. ONE flat photographic image. NO graphic overlay, NO cream rounded card, NO icons, NO text, NO design composition, NO border, NO logo. Pure unstyled editorial photography. Subject pushed to the right two-thirds of the frame; left third compositionally empty and slightly darker.

VIEWPOINT: close-up macro of paper, ink, stamp, or document detail. Texture of paper grain visible.

SUBJECT: {{SUBJECT — e.g. "a folded legal term-sheet document with one clause underlined in red marker, brass magnifying glass across the page" / "a stamped government form with diagonal red rubber-stamp impression, ink slightly smudged, wooden stamp handle resting beside" / "a cream-paper certificate with a red wax-seal embossed in the corner, fountain pen mid-signature"}}. The document fills most of the visible frame.

LIGHTING: {{TIME — "warm desk-lamp pool of light" / "cool diffused daylight from the side" / "dramatic green banker's-lamp pool of light"}}. Paper texture sharply rendered, ink wet-look, stamp impressions tactile.

Style: editorial forensic / archival photography. The document is the evidence.
```

---

## Mode F — Hands / partial figures

```
A single photograph filling the full 1280x720 frame edge to edge. ONE flat photographic image. NO graphic overlay, NO cream rounded card, NO icons, NO text, NO design composition, NO border, NO logo. Pure unstyled editorial photography. Subject pushed to the right two-thirds of the frame; left third compositionally empty and slightly darker.

VIEWPOINT: medium close-up. Partial figures only — HANDS and FOREARMS, no faces visible, no full bodies. Optional second pair of hands across the table.

SUBJECT: {{SUBJECT — e.g. "two hands across a table, one offering a folded document, the other reaching toward it" / "a single hand mid-signature with a fountain pen on a term sheet" / "hands pointing to a specific line in a printed cap-table, finger nail clean and trimmed, white shirt cuff visible"}}. Professional attire (white or pale shirt cuff). No watches with visible brand. No rings.

LIGHTING: {{TIME — "soft window daylight from the left" / "warm conference-room ambient"}}. Skin tones natural, paper bright, surface in shadow.

Style: editorial business photography, Bloomberg Businessweek profile shot, advisory-relationship feel. Human but not staged.
```

---

## Mode G — Window / threshold / liminal

```
A single photograph filling the full 1280x720 frame edge to edge. ONE flat photographic image. NO graphic overlay, NO cream rounded card, NO icons, NO text, NO design composition, NO border, NO logo. Pure unstyled editorial photography. Subject pushed to the right two-thirds of the frame; left third compositionally empty and slightly darker.

VIEWPOINT: looking through, into, or out of a window or doorway. Or eye-level toward an empty chair / desk / room. Sense of a pause, an in-between moment.

SUBJECT: {{SUBJECT — e.g. "an empty leather executive chair pulled slightly back from a polished desk, viewed from across the room, morning light through venetian blinds creating slats" / "the corner of a window with rain on the glass, a coffee cup steaming on the inside sill" / "a half-open office door, light spilling out into a darker hallway"}}. No people.

LIGHTING: {{TIME — "early-morning cool slatted light through blinds" / "late-afternoon warm light, dust visible" / "evening lamp glow against blue dusk outside"}}. Strong directional light with visible patterns — blinds, mullions, dust. Anticipation.

Style: editorial cinematic, threshold moment. The Atlantic feature photography, slight melancholy.
```

---

## Mode H — Hand-drawn / whiteboard / scribble

```
A single photograph filling the full 1280x720 frame edge to edge. ONE flat photographic image. NO graphic overlay, NO cream rounded card, NO icons, NO text, NO design composition, NO border, NO logo. Pure unstyled editorial photography. Subject pushed to the right two-thirds of the frame; left third compositionally empty and slightly darker.

VIEWPOINT: macro top-down of a hand-drawn diagram, or eye-level of a whiteboard partial frame, or close-up of sketch paper with pen marks.

SUBJECT: {{SUBJECT — e.g. "a hand-drawn pie chart on cream paper with one thin red wedge labeled 'ESOP', pencil eraser smudges visible, a black pencil resting at the side" / "a whiteboard with a cap-table waterfall scribbled in blue dry-erase, partially erased, one number circled in red" / "graph paper with a hand-drawn scenario tree, three branching paths, fountain-pen ink"}}. Imperfect, working-document feel.

LIGHTING: {{TIME — "bright overhead daylight, paper grain sharply visible" / "warm side-light, pencil graphite catches highlights"}}. Visible texture — paper grain, pencil smudge, ink pooling.

Style: editorial working-document photography. The image of an idea being worked through, not a finished diagram.
```

---

## How the article-writing agent uses this

When the agent adds a new article:

1. Pick `thumbnailMode` based on the topic family (default from the routing table).
2. Write the hook and emphasis word per the rules above.
3. Optionally write a one-line `thumbnailSubject` describing the specific objects for that article (this is what fills `{{SUBJECT}}` in the prompt template).
4. The thumbnail-generation script (or a manual Canva run) loads the matching mode's template, inserts the subject and a time-of-day choice, and runs the pipeline.

The 18 articles we've already shipped are back-tagged with their assigned mode in `articles.ts`. New articles slot into the same system.
