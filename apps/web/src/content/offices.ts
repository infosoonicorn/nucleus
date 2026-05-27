/**
 * Nucleus office directory.
 *
 * Used by the AboutOffices interactive block on /about. Each entry
 * renders a left-rail item with a HQ chip (when set) and, on click,
 * a right-panel detail view containing a Google Maps embed, the
 * address, and up to three office photos.
 *
 * Partner inputs still pending:
 *   - Final street addresses (the `address` field; currently
 *     omitted, UI shows a graceful "address coming soon" placeholder)
 *   - Office photos (drop JPGs under apps/web/public/offices/<slug>/
 *     and reference them in the `photos` array)
 *
 * Until both are provided, the UI is structurally complete and
 * production-safe: the map embed works off the `mapsQuery` city
 * lookup, and the photo slots show a clearly-labelled placeholder
 * card rather than a fake image.
 */

export type OfficePhoto = {
  src: string;
  alt: string;
};

export type Office = {
  slug: string;
  city: string;
  state: string;
  /** Marks the headquarters; shown as an "HQ" chip in the list. */
  isHq?: boolean;
  /** Search query used to construct the Google Maps embed URL.
   *  A specific place name (e.g. "Nucleus Advisors Gurugram office")
   *  gives the most accurate pin; falls back to city + state. */
  mapsQuery: string;
  /** Street address lines for display under the map. Leave empty
   *  until the partner confirms — UI renders a placeholder instead. */
  address?: string[];
  /** Up to 3 office photos shown as a strip under the address.
   *  Drop JPGs in apps/web/public/offices/<slug>/ and reference here. */
  photos?: OfficePhoto[];
};

export const offices: Office[] = [
  {
    slug: 'gurugram',
    city: 'Gurugram',
    state: 'Haryana',
    isHq: true,
    mapsQuery: 'Nucleus Advisors, Gurugram, Haryana, India',
    address: [
      '401, Suncity Trade Tower',
      'Sector 21',
      'Gurugram 122016',
    ],
  },
  {
    slug: 'jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    mapsQuery: 'Ridhiraj World Business Centre, Ajmer Road, Jaipur 302019',
    address: [
      'A4, 8th Floor',
      'Ridhiraj World Business Centre',
      'Ajmer Road, Jaipur 302019',
    ],
  },
  {
    slug: 'bhatinda',
    city: 'Bhatinda',
    state: 'Punjab',
    mapsQuery: '29B Grain Market, Bathinda, Punjab, India',
    address: [
      '29B, Opposite HDFC Bank',
      'Grain Market',
      'Bathinda, Punjab',
    ],
  },
  {
    slug: 'faridabad',
    city: 'Faridabad',
    state: 'Haryana',
    mapsQuery: 'Geetanjali Virmani Faridabad',
    address: [
      '3A/47, NIT Faridabad',
      'Haryana 121001',
    ],
  },
  {
    slug: 'bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    mapsQuery: '43 Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025',
    address: [
      '43, Residency Road',
      'Shanthala Nagar, Ashok Nagar',
      'Bengaluru, Karnataka 560025',
    ],
  },
];
