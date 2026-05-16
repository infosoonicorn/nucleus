/**
 * Client / founder logos used on service pages as the "Trusted by" /
 * track-record proof strip.
 *
 * Curation rule: only companies that have a direct working relationship
 * with Nucleus (advisory mandate, banking transaction, or Soonicorn
 * portfolio with founder consent to public mention). No purchased or
 * "we sat in the same room once" logos.
 *
 * Partner can freely add or remove entries here — the ClientLogos strip
 * renders whatever's listed and the CSS marquee adapts to any 7–25 count.
 */

export type Client = {
  slug: string;            // url-safe identifier (used for keys, anchors)
  name: string;            // company display name (used for alt text + tooltips)
  logoSrc: string;         // path under apps/web/public, e.g. '/brand/portfolio/zingbus.png'
  logoAlt: string;         // explicit alt text for screen readers
  serviceSlugs: string[];  // which service pages this logo shows up on
};

/**
 * Initial set sourced from the 12 Soonicorn-portfolio assets already in
 * `apps/web/public/brand/portfolio/`. Vijay to review and curate — some
 * may be moved out and replaced with pure-advisory clients for the IB
 * page once partner has confirmed which names can be publicly named.
 */
export const clients: Client[] = [
  {
    slug: 'adiabatic',
    name: 'Adiabatic',
    logoSrc: '/brand/portfolio/Adiabatic.png',
    logoAlt: 'Adiabatic',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'burger-singh',
    name: 'Burger Singh',
    logoSrc: '/brand/portfolio/burger-singh.png',
    logoAlt: 'Burger Singh',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'cusmat',
    name: 'Cusmat',
    logoSrc: '/brand/portfolio/Cusmat.png',
    logoAlt: 'Cusmat',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'geekster',
    name: 'Geekster',
    logoSrc: '/brand/portfolio/Geekster.png',
    logoAlt: 'Geekster',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'kredily',
    name: 'Kredily',
    logoSrc: '/brand/portfolio/Kredily.png',
    logoAlt: 'Kredily',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'limechat',
    name: 'Limechat',
    logoSrc: '/brand/portfolio/Limechat.png',
    logoAlt: 'Limechat',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'pickmywork',
    name: 'Pickmywork',
    logoSrc: '/brand/portfolio/pickmywork.png',
    logoAlt: 'Pickmywork',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'skyeair',
    name: 'Skyeair',
    logoSrc: '/brand/portfolio/skyeair.jpg',
    logoAlt: 'Skyeair',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'tsaw',
    name: 'TSAW',
    logoSrc: '/brand/portfolio/TSAW.jpg',
    logoAlt: 'TSAW',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'wherehouse',
    name: 'Wherehouse',
    logoSrc: '/brand/portfolio/wherehouse.jpg',
    logoAlt: 'Wherehouse',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'zingbus',
    name: 'Zingbus',
    logoSrc: '/brand/portfolio/zingbus.png',
    logoAlt: 'Zingbus',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'zypp',
    name: 'Zypp',
    logoSrc: '/brand/portfolio/zypp.png',
    logoAlt: 'Zypp',
    serviceSlugs: ['investment-banking'],
  },
];

export function getClientsForService(slug: string): Client[] {
  return clients.filter((c) => c.serviceSlugs.includes(slug));
}
