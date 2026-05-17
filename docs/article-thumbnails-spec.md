# Article thumbnails — image-generation spec

This file is the single brief for batch-generating thumbnail images for every long-form article on the Nucleus website. Generate externally (ChatGPT for one-offs, Codex CLI in a loop for batches), commit the resulting JPEGs into `apps/web/public/article-thumbs/`, then ensure each article's `thumbnailSrc` in `apps/web/src/content/articles.ts` matches the filename.

## Universal style brief

Apply this to every image unless an article-specific override is noted.

- **Aspect ratio:** 16:9 (e.g. 1280×720). Hero crops to 16:9 at the top of the article reader; cards display the same image at 4:3.
- **File format:** `.jpg`, optimised under 120 KB.
- **Filename:** must match the article's `slug` exactly. Example: `apps/web/public/article-thumbs/first-30-days-of-a-sell-side-process.jpg`.
- **Tone:** premium financial / advisory editorial. Think *Financial Times* op-ed graphic or *McKinsey Quarterly* feature image, not stock-photo "diverse business team smiling at laptop".
- **Palette:**
  - Background: warm cream (`#f7f5ef`) or dark navy (`#0c1024`) — alternate so the article grid feels varied.
  - Primary accent: brand red `#dd1017`.
  - Secondary accent: ochre `#b8a060`, sage `#6b8463`, or navy `#152249` — pick whichever fits the article topic.
- **Composition:** abstract, editorial. Geometric shapes, paper textures, document fragments, partial diagrams, isolated numerical fragments. Never:
  - Stock-photo people.
  - Generic finance imagery (rocket ships, growth arrows, handshakes, gears).
  - AI-generated faces.
  - Photorealistic offices.
- **Typography:** no text in the image. Title overlays are handled by CSS at runtime.
- **Brand mark:** never include the Nucleus logo in the image; it appears via the site chrome.

## Per-article scenes

Each entry below provides the article slug, the concept, and 2–3 visual cues. Pass the concept + cues + universal style brief to the generator.

### Investment Banking (10 articles, author: Vijay Singh Rathore)

> *Existing 10 IB articles already in `articles.ts`. Slugs are listed below; the visual cue should reflect the article's subject.*

| Slug | Concept | Visual cues |
| --- | --- | --- |
| `math-of-dilution` | Founder ownership shrinking across two rounds | Stacked pie-chart fragments at decreasing scale; warm cream background; red wedge highlighted on the smallest pie |
| `how-investors-read-im` | Analyst reading an information memorandum on a Saturday morning | Stylised IM page with handwritten margin notes; warm cream + ochre accents; one paragraph highlighted in red |
| `cap-table-hygiene` | Clean vs messy cap table side-by-side | Two cap-table grids — the left ordered and aligned, the right with scattered entries; dark navy background |
| `term-sheet-line-by-line` | Term sheet annotated with red marker | Folded term-sheet paper with one clause circled red; warm cream background |
| `anti-dilution-clauses-explained` | Ratchet mechanism illustration | Three converging arrows of unequal weight; dark navy background; red highlight on the heaviest arrow |
| `14-day-pitch-to-term-sheet-myth` | Time pressure on a fundraise | Calendar grid with 14 cells marked, several crossed out; warm cream background |
| `fundraise-readiness-audit` | Readiness checklist | Vertical checklist with ticks, crosses and one question mark; ochre + navy palette |
| `strategic-exit-vs-pe-buyout` | Two paths diverging | Two diverging arrows from a single point — one toward a corporate building silhouette, one toward a vault icon; dark navy background |
| `esop-economics-for-founders` | ESOP pool carved from founder slice | Pie chart with a red wedge labelled ESOP; warm cream background |
| `case-for-outside-banker` | Founder vs banker in the room | Stylised two-chair diagram with a document between them; warm cream + red accents |

### M&A Advisory (10 articles, authors: Pravesh Goel & Aakash Kalra)

| Slug | Concept | Visual cues |
| --- | --- | --- |
| `first-30-days-of-a-sell-side-process` | Three weeks of preparation before outreach | Timeline strip with weeks 1–3 labelled; documents stacking up; warm cream background |
| `building-a-target-list-that-produces-real-meetings` | 12 targets connected by relationship lines | Network diagram of 12 nodes with personal-connection paths between them; dark navy background |
| `earnouts-in-india-what-works-what-doesnt` | Earnout payment over time | Stair-step diagram showing earnout milestones across 2 years; warm cream + red accents |
| *(7 more after partner sign-off on the above 3 as the bar)* | | |

### Risk Advisory (10 articles, author: Ashish Gupta)

> *To be drafted after partner sign-off on the M&A bar.*

### Tax & Regulatory (10 articles, author: Abhishek Gupta)

> *To be drafted after partner sign-off on the M&A bar.*

### Assurance (10 articles, author: Abhishek Gupta)

> *To be drafted after partner sign-off on the M&A bar.*

### Valuations (10 articles, author: Vijay Singh Rathore)

> *To be drafted after partner sign-off on the M&A bar.*

### Finance Outsourcing (10 articles, author: Rajat Singla)

> *To be drafted after partner sign-off on the M&A bar.*

### Corporate Secretarial (10 articles, author: Neha Rathore)

> *To be drafted after partner sign-off on the M&A bar.*

### AIF & Fund Management (10 articles, author: Neha Rathore)

> *To be drafted after partner sign-off on the M&A bar.*

## Generation routing

- **One image at a time** (corrections, single replacements): ChatGPT chat with the universal style brief + per-article scene.
- **Batch generation** (>3 images): Codex CLI loop. Recommended approach:
  1. Read this spec.
  2. For each row in each service-line table, send the (universal brief + concept + cues) to the image API.
  3. Save the result to `apps/web/public/article-thumbs/<slug>.jpg`.
  4. Commit in batches of ten so review stays manageable.

## Card + reader rendering

Once an image exists for an article slug, set the article's `thumbnailSrc: '/article-thumbs/<slug>.jpg'` in `articles.ts`. Cards and the article reader render the thumbnail automatically; cards without a thumbnail continue to render fine with the existing layout.
