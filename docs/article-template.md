# Writing an article for the Nucleus website

This is the single brief for adding a new article to `/insights`. Follow it and your draft will render with the same bar as the demo: 1,500-word editorial body, sticky TOC, brand-styled headers, hero thumbnail, sidebar Read next, lead-magnet CTA.

Articles currently live in `apps/web/src/content/articles.ts` as a TypeScript array. To add one, copy the template below, fill the fields, and append the object to the `articles` array. A future phase will move articles to a Supabase-backed CMS, but the markdown conventions documented here will remain identical — the renderer is the single source of truth.

## 1. Scaffold a new entry

From the repo root:

```bash
pnpm new-article <slug>
```

This prints a ready-to-paste TypeScript object with all required fields. Open `apps/web/src/content/articles.ts`, paste it into the `articles` array, and start filling in.

## 2. Required fields

| Field | Format | Rule |
| --- | --- | --- |
| `slug` | kebab-case | Becomes the URL: `/insights/<slug>`. Must be unique. |
| `title` | sentence case | 60-100 characters. No em-dashes. |
| `excerpt` | one or two sentences | 140-260 characters. Renders as card preview + article subhead. |
| `body` | array of strings joined with `\n\n` | See markdown rules below. |
| `authorSlug` | string matching a slug in `apps/web/src/content/team.ts` | E.g. `'pravesh-goel'`. The article author block, byline, headshot and bio are all resolved from the team registry — one source of truth. When the partner record gets updated (new photo, LinkedIn, longer bio), every article by them upgrades automatically. |
| `publishedOn` | `YYYY-MM-DD` | Date of intended publication. Articles sort newest-first. |
| `readMinutes` | integer | Estimated reading time. Around 200 wpm: 1,500-word article ≈ 8 min. |
| `tag` | short string | Single tag chip on the card, e.g. "Sell-side process". |
| `serviceSlugs` | array of slugs | Which service pages this article surfaces on. E.g. `['ma-advisory']`. |
| `thumbnailSrc` | path string | `/article-thumbs/<slug>.jpg`. The JPG must exist at `apps/web/public/article-thumbs/<slug>.jpg` before the article ships. |
| `reviewerStatus` | `'pending'` or `'approved'` | New drafts start as `'pending'`. Vijay flips to `'approved'` after review. Approved drafts also need `reviewerApprovedAt`. |

## 3. Body markdown rules

The article body is parsed by `/insights/[slug]/page.tsx`. Supported markdown:

- `## Heading` — section header (h2). Renders with a brand-red accent bar above.
- `### Subheading` — subsection header (h3). Renders with a brand-red bullet dot.
- `**bold**` — inline emphasis. Renders with a soft red highlight underlay.
- `> text` — pull-quote. A paragraph beginning with `> ` renders as an oversized italic quote with a decorative red mark. Use sparingly: zero or one per article, on the line you most want the reader to hold.
- `:::note text` — ochre callout box labelled **Worth noting**. Closing `:::` is optional. For asides that interrupt the argument with a side observation.
- `:::insight text` — navy callout box labelled **The insight**. Use for the one line that summarises the article's central claim.
- `:::watch text` — red callout box labelled **Watch for**. Use for a specific failure mode or risk to flag at the right moment in the narrative.
- Everything else is a paragraph. Paragraphs are justified with browser hyphenation.

No raw HTML. No em-dashes (`—`). No `<span>`, no `<br>`, no inline styles. If you want a visual treatment, raise it as a renderer feature — never embed presentation in the body.

### When to reach for which callout

Use callouts sparingly. A practitioner article that needs more than two callouts is probably structured wrong — break it into a `##` section instead.

- **`:::watch`** at the moment in the article where a specific failure mode applies. ("Watch for: the regulator will read the agreement and the operating practice as different documents.")
- **`:::insight`** as the article's load-bearing claim — usually at the end of the lead-in, before the first `##`. Quoted as the article's TL;DR in shares.
- **`:::note`** for procedural context the practitioner needs but the argument doesn't strictly require. ("Worth noting: the FIRC requirement applies even when the bank issues a consolidated statement.")

## 4. Voice and length

- **Length:** 1,200-1,800 words. Sweet spot is ~1,500 (eight-minute read).
- **Structure:** ~5-8 `##` sections. Use `###` subsections for longer sections only.
- **Voice:** first person plural for the firm ("we"). Second person for the reader ("you").
- **Tone:** declarative, practitioner-grade, no marketing slop. Concrete numbers and named situations beat generalisations.
- **Avoid:** "delve", "robust", "nuanced", "crucial", "multifaceted", three-element parallel constructions used as rhetorical filler.
- **No em-dashes.** They read as an AI tell. Use periods, commas, colons, or just rewrite.
- **One author per article.** If two partners co-authored, pick one as the byline and credit the other inside the body if needed.

## 5. Thumbnail

Every article needs a 16:9 JPG at `apps/web/public/article-thumbs/<slug>.jpg`, under 120KB.

Generation rule:

- **Single image:** generate in ChatGPT with the brief in `docs/article-thumbnails-spec.md`.
- **Batch (>3):** route to Codex CLI for parallel generation.

Style is set in the spec doc. Common pitfalls: no stock-photo people, no rocket ships, no AI-generated faces, no text in the image, no Nucleus logo (site chrome handles it).

## 6. Before you commit

Run the article lint check:

```bash
pnpm lint:articles
```

It enforces the rules above and exits non-zero if your article:

- has a body shorter than 1,200 or longer than 1,800 words
- contains an em-dash (`—`) in body or title
- has fewer than three `##` headings
- is missing `thumbnailSrc` or the JPG file at the expected path
- has a slug that collides with an existing article
- uses an `authorSlug` that doesn't resolve to a team.ts entry

Also run the standard gates before opening a PR:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## 7. Reviewer workflow

1. Draft author commits with `reviewerStatus: 'pending'`. The article renders in dev (`pnpm dev`) and on Vercel preview, but not in production.
2. Vijay (or the designated reviewer) reads the draft on the preview URL and either:
   - Edits in place and flips to `reviewerStatus: 'approved'` with `reviewerApprovedAt: 'YYYY-MM-DD'`.
   - Sends back to the author with notes.
3. The next production deploy publishes the approved article. No content goes live without an explicit review and a separate commit flipping the flag.

## 8. Anatomy of a good article (the demo)

See `first-30-days-of-a-sell-side-process` in `articles.ts`. It is the bar-setter:

- 1,541 words
- 7 `##` sections, 5 `###` subsections
- 4 `**bold**` inline emphasis points used sparingly for the things that matter
- One concrete example per section
- No em-dashes
- Author bylined as Pravesh Goel
- Hero thumbnail wired (JPG to follow)
- Tagged to `ma-advisory`

When in doubt, mirror its shape.
