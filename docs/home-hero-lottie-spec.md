# Hero Lottie Animation — Asset Spec

The redesigned homepage hero ([apps/web/src/components/home/hero.tsx](../apps/web/src/components/home/hero.tsx)) reserves a slot inside the right-hand "Advisory coverage" canvas for a subtle Lottie animation that plays behind the dark gradient header band.

Until the asset is dropped in, [LottieSlot](../apps/web/src/components/lottie-slot.tsx) silently renders nothing — there is no placeholder shape and no broken UI. As soon as a JSON file lands at the path below, the animation appears on next reload.

## Where to put the file

```
apps/web/public/lottie/nucleus-hero.json
```

(Public assets are referenced as `/lottie/nucleus-hero.json` from the browser.)

## Visual brief

- Tone: premium financial advisory, calm, editorial. Not playful, not corporate cliché.
- Subject: an abstract data / coverage / lifecycle motion — e.g. a connected node graph quietly pulsing, an animated minimal line chart drawing itself, or thin sweeping arcs.
- Palette: 1–2 accent strokes max, in `#ff8e92` (soft red) or `#9fb7e3` (soft navy). Background must be transparent; the dark gradient `linear-gradient(180deg, #152249 0%, #0a112b 100%)` will sit behind it.
- No text. No human characters. No literal money / charts with numbers.
- Looping, 4–8 seconds. No hard cuts at loop seam.

## Technical

- Format: standard Lottie JSON (Bodymovin export).
- Dimensions: authored at 480×120, displayed responsively inside a `86px`-tall band. Pixel-perfect not required.
- File size: keep under 80 KB. Strip unused layers and pre-comps before exporting.
- Compatibility: standard `lottie-web` features only — no expressions, no Lottie Plugins, no DotLottie binary. Tested against `lottie-react` ^2.4.

## Sourcing route (per Vijay's coding rules)

Lottie animations are NOT hand-authored by Claude. Pick from one of:

1. **LottieFiles search** (`https://lottiefiles.com/`) — filter to free/CC0 abstract or data-viz pieces, then tint to brand palette using LottieFiles' built-in color editor before exporting.
2. **In-house designer / motion artist** — brief them with the visual section above.

When the file is added, no code change is required. The hero will pick it up.
