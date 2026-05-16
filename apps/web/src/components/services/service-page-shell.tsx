import type { ReactNode } from 'react';

/**
 * Two-column page shell used by service pages.
 *
 *   Desktop (≥ 1100px): | main column 1fr | sidebar 320px |
 *   Mobile  (< 1100px): single column; sidebar content drops below main.
 *
 * Sections that want the full container width (Hero, ClientLogos
 * marquee) should be passed via `fullBleed` so they break out of the
 * grid and span the entire 1200px wrapper. The narrower `children`
 * column is what holds the bulk of editorial sections.
 *
 * The right sidebar is sticky and scrollable on hover — native browser
 * scroll-chaining handles the "mouse over sidebar scrolls sidebar /
 * mouse over main scrolls main" behavior; no JS needed.
 */
export function ServicePageShell({
  fullBleed,
  children,
  rightSlot,
}: Readonly<{
  fullBleed?: ReactNode;
  children: ReactNode;
  rightSlot: ReactNode;
}>) {
  return (
    <>
      {fullBleed}
      <div className="service-shell">
        <div className="service-shell-main">{children}</div>
        {/* data-lenis-prevent lets the sidebar do native overflow scroll;
            without it, Lenis intercepts wheel events on the whole page and
            the sidebar never scrolls independently. */}
        <aside
          className="service-shell-side"
          aria-label="Service sidebar"
          data-lenis-prevent
        >
          {rightSlot}
        </aside>
      </div>
    </>
  );
}
