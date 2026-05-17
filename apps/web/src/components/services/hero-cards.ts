import type { ProcessDossier } from '@/content/site';
import type { HeroCard } from './service-hero';

/**
 * Pick 3 phases from a service's processDossier to display as floating
 * cards in the hero — first / middle / last. Each card uses the phase's
 * ordinal, an abbreviated first-word label (so "Build & pressure-test"
 * becomes "Build"), and the phase's weeks line. The last card carries
 * the phase's stampLine as a visible pill ("Closed", "Reported", etc.)
 * so it reads as the conclusion of the engagement.
 *
 * Returns null if the service has no dossier — the hero then renders
 * without a card stack.
 */
export function deriveHeroCards(dossier: ProcessDossier | undefined): HeroCard[] | undefined {
  if (!dossier || dossier.phases.length === 0) return undefined;
  const phases = dossier.phases;
  const last = phases.length - 1;
  // For 4 phases pick [0, 2, 3]; for 3 pick [0, 1, 2]; degrade gracefully.
  const indices = phases.length >= 4 ? [0, 2, last] : phases.length === 3 ? [0, 1, 2] : [0, last];
  return indices.slice(0, 3).map((i, ci) => {
    const p = phases[i];
    return {
      ordinal: p.ordinal,
      label: shortLabel(p.name),
      meta: p.weeks,
      stamp: ci === 2 ? p.stampLine.toUpperCase() : undefined,
    };
  });
}

/** Take the leading word or two of a phase name (drops "& X" suffixes). */
function shortLabel(name: string): string {
  // "Build & pressure-test" → "Build"
  // "Mandate & scope"        → "Mandate"
  // "Year-end fieldwork"     → "Year-end"
  const trimmed = name.split(/\s*[&·]\s*/)[0].trim();
  // If still long (multi-word), keep first one or two words.
  const words = trimmed.split(/\s+/);
  return words.slice(0, words.length <= 2 ? words.length : 2).join(' ');
}
