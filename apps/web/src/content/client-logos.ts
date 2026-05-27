/**
 * Client logo inventory — built from the directory tree under
 * `apps/web/public/brand/clients/`. Each subdirectory is a sector;
 * each file inside is one client logo.
 *
 * Source: Nucleus Profile 2026.pdf (pp.18–23). 118 logos staged
 * on 2026-05-21. See `apps/web/public/brand/clients/README.md`.
 *
 * Sector assignment is filesystem-driven — to reassign a client,
 * simply move its file between folders. The page rebuilds with
 * the new grouping automatically.
 */

import fs from 'node:fs';
import path from 'node:path';

export type ClientLogo = {
  slug: string;          // file basename, no extension
  name: string;          // de-slugified display name
  src: string;           // public path, e.g. /brand/clients/bfsi/icici-bank.png
  sectorSlug: string;    // folder name, e.g. 'bfsi'
  sectorTitle: string;   // pretty sector name
  group: 'advisory' | 'fundraising';
};

export type SectorGroup = {
  slug: string;
  title: string;
  group: 'advisory' | 'fundraising';
  logos: ClientLogo[];
};

const CLIENTS_ROOT = path.join(process.cwd(), 'public', 'brand', 'clients');

const SECTOR_TITLES: Record<string, string> = {
  'automobiles-tools': 'Automobiles & Tools',
  'other-manufacturing': 'Other Manufacturing',
  'qsr-hospitality': 'QSR & Hospitality',
  'energy-power': 'Energy & Power',
  'non-profits': 'Non-Profits',
  healthcare: 'Healthcare',
  infrastructure: 'Infrastructure',
  telecom: 'Telecom',
  bfsi: 'BFSI',
  publishing: 'Publishing',
  agriculture: 'Agriculture',
  pharmaceutical: 'Pharmaceutical',
  'e-commerce': 'E-Commerce',
  'information-technology': 'Information Technology',
  fashion: 'Fashion',
  'transaction-advisory': 'Transaction Advisory',
  // fundraising sub-sectors
  'drone-tech': 'Drone Tech',
  'climate-tech': 'Climate-Tech',
  'fin-tech': 'Fin-Tech',
  'ar-vr-tech': 'AR / VR Tech',
  'd2c-fmcg': 'D2C FMCG',
  b2b: 'B2B',
  'consumer-tech': 'Consumer Tech',
  ev: 'EV',
  'logistic-tech': 'Logistic Tech',
  others: 'Others',
};

// Tweak display titles for a small set of slugs (PDF used acronyms we want to
// show in their original form rather than capitalized words).
const SLUG_NAME_OVERRIDES: Record<string, string> = {
  bsnl: 'BSNL',
  bhel: 'BHEL',
  nbcc: 'NBCC',
  hscc: 'HSCC',
  hudco: 'HUDCO',
  icici: 'ICICI Bank',
  'icici-bank': 'ICICI Bank',
  iffco: 'National Fertilizers Limited',
  ywca: 'YWCA',
  rfcl: 'Ramagundam Fertilizers',
  nhpc: 'NHPC',
  railtel: 'RailTel',
  phi: 'PHI Learning',
  qds: "QD's",
  vdi: 'VDI',
  'kei-wires-cables': 'KEI Wires & Cables',
  'oxford-university-press': 'Oxford University Press',
  'central-bank-of-india': 'Central Bank of India',
  'indusind-bank': 'IndusInd Bank',
  'bandhan-bank': 'Bandhan Bank',
  'sk-finance': 'SK Finance',
  ofbusiness: 'OfBusiness',
  expedien: 'Expedien',
  rmgx: 'RMgX',
  grabonrent: 'GrabOnRent',
  driveassist: 'DriveAssist',
  'm-plus-solar': 'Amplus Solar',
  'ampin-energy': 'Ampin Energy',
  'dcm-shriram': 'DCM Shriram',
  oagrifarm: "O'AgriFarm",
  dehaat: 'DeHaat',
  'pernod-ricard-india': 'Pernod Ricard India',
  kommerling: 'Kömmerling',
  desbro: 'Desbro',
  khanna: 'Khanna Paper Mills',
  'accor-hotels': 'Accor Hotels',
  'c-and-co': 'Cafeteria & Co.',
  'orange-twigs-cafe': 'The Orange Twigs Cafe',
  wanderburgs: 'WanderBurgs',
  'si-interpack': 'SI Interpack',
  'si-autopack': 'SI Autopack',
  'roam-group': 'Roam Group',
  'accurate-robotic-solutions': 'Accurate Robotic Solutions',
  'subhnen-panel-products': 'Subhnen Panel Products',
  'aurdia-jewellery': 'Aurdia Jewellery',
  'snithik-technologies': 'Snithik Technologies',
  'urban-ebikes': 'Urban e-Bikes',
  'sixredmarbles': 'sixredmarbles',
  borgwarner: 'BorgWarner',
  alpine: 'Alpine',
  sanden: 'Sanden',
  'alliance-energy-efficient-economy': 'Alliance for an Energy-Efficient Economy',
  healthkart: 'HealthKart',
  rgk: 'Ruby General Hospital',
  'valence-labs': 'Valence Labs',
  felix: 'Felix',
  olx: 'OLX',
  stellar: 'Stellar',
  ezspend: 'EZspend',
  easypolicy: 'EasyPolicy',
  xyzo: 'Oxyzo',
  // fundraising
  indrones: 'inDrones',
  'skylark-drones': 'Skylark Drones',
  skyeair: 'SkyeAir',
  'inside-fpv': 'Inside FPV',
  enercomp: 'EnerComp',
  saw: 'SAW',
  'flying-wedge': 'Flying Wedge',
  inficold: 'Inficold',
  minionlabs: 'MinionLabs',
  sheru: 'SHERU',
  sustvest: 'SustVest',
  'scrap-uncle': 'ScrapUncle',
  ecoratings: 'EcoRatings',
  'sharaksha-ecosolutions': 'Sharaksha Ecosolutions',
  'skilancer-solar': 'Skilancer Solar',
  regrip: 'ReGrip',
  finaleap: 'Finaleap',
  savart: 'Savart',
  cusmat: 'Cusmat',
  trezi: 'Trezi',
  'samosa-party': 'Samosa Party',
  skippi: 'Skippi',
  mitra: 'Mitra',
  proost: 'PROOST',
  'power-gummies': 'Power Gummies',
  'burger-singh': 'Burger Singh',
  burgerama: 'Burgerama',
  'supply-unknown': 'Supply (TBC)',
  'sapio-analytics': 'Sapio Analytics',
  'dave-ai': 'Dave AI',
  mobigarage: 'MobiGarage',
  'nayam-cloud': 'Nayam (TBC)',
  pickmywork: 'PickMyWork',
  limechat: 'LimeChat',
  kredily: 'Kredily',
  zingbus: 'zingbus',
  growfitter: 'Growfitter',
  hoopr: 'hoopr',
  'zypp-electric': 'Zypp Electric',
  autonxt: 'AutoNxt',
  supplynote: 'SupplyNote',
  carterx: 'CarterX',
  oorjaa: 'OORJAA',
  wherehouse: 'Wherehouse',
  geekster: 'Geekster',
  settl: 'Settl',
  quickreel: 'Quickreel',
  'neural-defend': 'Neural Defend',
  relata: 'Relata',
  'astrophel-aerospace': 'Astrophel Aerospace',
  brainwired: 'brainwired',
  'social-hardware': 'Social Hardware',
  // unknowns
  'unknown-circle-crane': 'New Swan',
  'unknown-psu-emblem': 'Delhi Transco Limited',
  'unknown-sphere': 'Pragati Power Corporation Limited',
  'unknown-auto-wrench': 'Unknown — to confirm',
};

function prettyName(slug: string): string {
  return (
    SLUG_NAME_OVERRIDES[slug] ??
    slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase())
  );
}

function readSector(
  dir: string,
  sectorSlug: string,
  group: 'advisory' | 'fundraising',
  publicPrefix: string,
): SectorGroup | null {
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && /\.(png|jpe?g|svg|webp)$/i.test(d.name))
    .map((d) => d.name);
  if (files.length === 0) return null;

  const sectorTitle = SECTOR_TITLES[sectorSlug] ?? prettyName(sectorSlug);

  const logos: ClientLogo[] = files
    .map((file) => {
      const slug = file.replace(/\.[^.]+$/, '');
      return {
        slug,
        name: prettyName(slug),
        src: `${publicPrefix}/${file}`,
        sectorSlug,
        sectorTitle,
        group,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return { slug: sectorSlug, title: sectorTitle, group, logos };
}

export function loadClientSectors(): {
  advisory: SectorGroup[];
  fundraising: SectorGroup[];
} {
  const advisory: SectorGroup[] = [];
  const fundraising: SectorGroup[] = [];

  if (!fs.existsSync(CLIENTS_ROOT)) return { advisory, fundraising };

  for (const entry of fs.readdirSync(CLIENTS_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'fundraising') continue;
    const sg = readSector(
      path.join(CLIENTS_ROOT, entry.name),
      entry.name,
      'advisory',
      `/brand/clients/${entry.name}`,
    );
    if (sg) advisory.push(sg);
  }

  const fundraisingRoot = path.join(CLIENTS_ROOT, 'fundraising');
  if (fs.existsSync(fundraisingRoot)) {
    for (const entry of fs.readdirSync(fundraisingRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const sg = readSector(
        path.join(fundraisingRoot, entry.name),
        entry.name,
        'fundraising',
        `/brand/clients/fundraising/${entry.name}`,
      );
      if (sg) fundraising.push(sg);
    }
  }

  // Stable ordering: largest sector first within each group, ties alphabetical.
  const byCountDesc = (a: SectorGroup, b: SectorGroup) =>
    b.logos.length - a.logos.length || a.title.localeCompare(b.title);
  advisory.sort(byCountDesc);
  fundraising.sort(byCountDesc);

  return { advisory, fundraising };
}
