import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FileCheck2,
  Landmark,
  LineChart,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Service = {
  title: string;
  slug: string;
  summary: string;
  promise: string;
  seoTitle: string;
  metaDescription: string;
  howWeHelp: string[];
  deliverables: string[];
  experts: string[];
  leadMagnet: string;
  cta: string;
  proof?: string[];
  icon: LucideIcon;
};

export const site = {
  name: 'Nucleus Advisors',
  email: 'info@nucleusadvisors.in',
  linkedin: 'https://in.linkedin.com/company/nucleusadvisors',
  locations: ['Gurugram', 'Bangalore', 'Jaipur', 'Faridabad', 'Bhatinda'],
};

export const navigation = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Careers', href: '/careers' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];

export const proof = [
  { value: '8', label: 'partners' },
  { value: '90+', label: 'team members' },
  { value: '130+', label: 'clients' },
  { value: '50+', label: 'deals' },
  { value: '5', label: 'offices' },
  { value: '100+', label: 'years combined experience' },
];

export const lifecycle = [
  {
    title: 'Incorporation and early compliance',
    text: 'Company formation, statutory setup, registrations, accounting foundations and compliance calendars.',
  },
  {
    title: 'First finance stack',
    text: 'Bookkeeping, MIS, payroll, GST, tax filings, investor-friendly reporting and finance process setup.',
  },
  {
    title: 'Fundraising and investor readiness',
    text: 'Models, pitch decks, due diligence, valuation, data rooms and investor targeting.',
  },
  {
    title: 'Growth and control building',
    text: 'Internal audit, IFC, process improvement, controllership, tax planning and regulatory discipline.',
  },
  {
    title: 'Transactions and restructuring',
    text: 'M&A, mergers, demergers, diligence, valuation and transaction documentation support.',
  },
  {
    title: 'Scale and listing readiness',
    text: 'Audit readiness, Ind AS, controls, governance, reporting discipline and board-level dashboards.',
  },
];

export const decisiveMoments = [
  'Raising capital or preparing for a transaction.',
  'Buying, selling, merging or restructuring a business.',
  'Strengthening internal controls, IFC and risk management.',
  'Improving finance operations, MIS and controllership.',
  'Handling tax, GST, transfer pricing and regulatory complexity.',
  'Preparing valuations, diligence packs and investor material.',
  'Meeting audit, assurance and Ind AS expectations.',
];

export const services: Service[] = [
  {
    title: 'Investment Banking',
    slug: 'investment-banking',
    summary:
      'Fundraising, investor targeting, financial modelling, pitch decks, due diligence support and transaction closure.',
    promise:
      'We help founders and businesses prepare, position and execute capital raises and strategic transactions with disciplined financial storytelling.',
    seoTitle: 'Investment Banking Advisory in India | Fundraising & Deal Support',
    metaDescription:
      'Nucleus Advisors supports startups, growth companies, investors and family offices with fundraising, financial modelling, pitch decks, due diligence, investor targeting and deal closure.',
    howWeHelp: [
      'Fundraising readiness assessment.',
      'Financial modelling and scenario planning.',
      'Investor pitch decks and information memorandums.',
      'Investor targeting and outreach support.',
      'Financial due diligence preparation.',
      'Term sheet and transaction support.',
      'Post-investment monitoring support for funds and family offices.',
    ],
    deliverables: [
      'Fundraise readiness report.',
      'Financial model.',
      'Investor deck.',
      'Information memorandum.',
      'Due diligence checklist and data room structure.',
      'Investor target list.',
      'Transaction workplan.',
    ],
    experts: ['CA Vijay Singh Rathore', 'CA Aakash Kalra', 'Samarth Pandey'],
    leadMagnet: 'Fundraise Readiness Checklist',
    cta: 'Discuss your fundraise',
    icon: Landmark,
  },
  {
    title: 'M&A Advisory',
    slug: 'ma-advisory',
    summary:
      'Buy-side, sell-side, mergers, demergers, restructuring, transaction strategy and documentation support.',
    promise:
      'We support businesses through the strategic, financial, compliance and execution layers of mergers, acquisitions and restructuring.',
    seoTitle: 'M&A Advisory in India | Buy-Side, Sell-Side & Restructuring',
    metaDescription:
      'Nucleus Advisors advises companies on M&A strategy, due diligence, mergers, demergers, restructuring, transaction modelling and deal execution.',
    howWeHelp: [
      'Transaction strategy and feasibility assessment.',
      'Buy-side and sell-side transaction support.',
      'Mergers, demergers and restructuring advisory.',
      'Due diligence coordination.',
      'Valuation and transaction modelling.',
      'Investor and acquirer material.',
      'Transaction documentation support with legal and secretarial teams.',
    ],
    deliverables: [
      'Transaction feasibility note.',
      'Deal model.',
      'Valuation note.',
      'Information memorandum.',
      'Diligence issue tracker.',
      'Negotiation support pack.',
      'Closing checklist.',
    ],
    experts: [
      'CA Pravesh Goel',
      'CA Vijay Singh Rathore',
      'CA Aakash Kalra',
      'CA Tarun Agarwal',
      'CS Neha Rathore',
    ],
    leadMagnet: 'M&A Readiness Checklist',
    cta: 'Evaluate a transaction',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Risk Advisory',
    slug: 'risk-advisory',
    summary:
      'Internal audit, IFC, ICFR, process audits, revenue audits, concurrent audits and process re-engineering.',
    promise:
      'We help management teams identify control gaps, reduce operating risk and build processes that scale.',
    seoTitle: 'Risk Advisory, Internal Audit & IFC Consulting | Nucleus Advisors',
    metaDescription:
      'Nucleus Advisors helps companies strengthen internal audit, IFC, ICFR, risk management, process controls, revenue audits, concurrent audits and process re-engineering.',
    howWeHelp: [
      'Internal audits.',
      'Risk assessment.',
      'IFC and ICFR implementation or review.',
      'Process audits and process re-engineering.',
      'Revenue audits and concurrent audits.',
      'Special audits.',
      'PPE and physical verification.',
      'Fraud and forensic investigations where required.',
    ],
    deliverables: [
      'Risk and control matrix.',
      'Internal audit plan.',
      'Audit observations and management action tracker.',
      'IFC/ICFR design and operating effectiveness report.',
      'Process improvement roadmap.',
      'Board or audit committee reporting pack.',
    ],
    experts: ['CA Ashish Gupta', 'CA Abhishek Gupta', 'Geetanjali Virmani'],
    leadMagnet: 'Internal Controls Health Check',
    cta: 'Review your control environment',
    icon: ShieldCheck,
  },
  {
    title: 'Tax & Regulatory',
    slug: 'tax-regulatory',
    summary:
      'Direct tax, international tax, transfer pricing, GST, regulatory filings, assessments and advisory.',
    promise:
      'We help businesses manage tax and regulatory complexity without losing sight of commercial decisions.',
    seoTitle: 'Tax & Regulatory Advisory | Direct Tax, GST & Transfer Pricing',
    metaDescription:
      'Nucleus Advisors advises businesses on direct tax, international tax, transfer pricing, GST, tax assessments, statutory filings and regulatory compliance.',
    howWeHelp: [
      'Domestic tax advisory and filings.',
      'International tax and treaty advisory.',
      'Transfer pricing advisory and documentation.',
      'GST registration, filings, audits, refunds and advisory.',
      'Tax assessments and opinions.',
      'Statutory compliance.',
      'Regulatory coordination for company matters.',
    ],
    deliverables: [
      'Tax position note.',
      'Compliance calendar.',
      'GST impact analysis.',
      'Transfer pricing documentation.',
      'Assessment response support.',
      'Refund support pack.',
      'Regulatory filing tracker.',
    ],
    experts: ['CA Hemendra Chauhan', 'Rajat Singla', 'CS Neha Rathore', 'Vijay K. Choudhary'],
    leadMagnet: 'GST and Tax Compliance Calendar',
    cta: 'Review tax and compliance exposure',
    icon: Scale,
  },
  {
    title: 'Assurance',
    slug: 'assurance',
    summary:
      'Statutory audits, bank audits, system audits, Ind AS, limited reviews, restatement, forensic and special reviews.',
    promise:
      'We help companies build confidence in financial reporting, audit readiness and compliance evidence.',
    seoTitle: 'Assurance, Audit & Ind AS Advisory | Nucleus Advisors',
    metaDescription:
      'Nucleus Advisors provides statutory audit, bank audit, system audit, limited review, Ind AS, IFRS, restatement, utilization certificate and assurance support.',
    howWeHelp: [
      'Statutory audits.',
      'Bank audits.',
      'Limited reviews.',
      'System audits.',
      'Ind AS and IFRS advisory.',
      'Utilization certificates.',
      'RBI/FEMA compliance support.',
      'Restatement of financials.',
      'Audit support for controllership teams.',
    ],
    deliverables: [
      'Audit plan.',
      'Audit queries and closure tracker.',
      'Financial reporting review.',
      'Ind AS impact note.',
      'Compliance evidence checklist.',
      'Management letter and improvement observations.',
    ],
    experts: ['CA Abhishek Gupta', 'CA Tarun Agarwal', 'Geetanjali Virmani'],
    leadMagnet: 'Audit Readiness Checklist',
    cta: 'Prepare for audit readiness',
    icon: FileCheck2,
  },
  {
    title: 'Valuations',
    slug: 'valuations',
    summary:
      'Business valuation, ESOP, brand, IFRS/Ind AS, FDI, transaction and fundraising valuations.',
    promise:
      'We prepare valuation work that supports transactions, compliance, fundraising, reporting and strategic decision-making.',
    seoTitle: 'Business Valuation, ESOP Valuation & FDI Valuation | Nucleus Advisors',
    metaDescription:
      'Nucleus Advisors provides business valuation, ESOP valuation, brand valuation, IFRS/Ind AS valuation, FDI valuation and transaction valuation support.',
    howWeHelp: [
      'Business valuation.',
      'Startup and fundraise valuation.',
      'ESOP valuation.',
      'Brand valuation.',
      'FDI valuation.',
      'IFRS/Ind AS valuation.',
      'Transaction valuation and fairness support.',
      'Valuation inputs for investor and board discussions.',
    ],
    deliverables: [
      'Valuation report.',
      'Valuation model.',
      'Assumptions pack.',
      'Scenario analysis.',
      'Investor or board summary.',
      'Compliance-ready supporting schedules.',
    ],
    experts: ['CA Vijay Singh Rathore', 'CA Aakash Kalra', 'CA Tarun Agarwal'],
    leadMagnet: 'Valuation Readiness Checklist',
    cta: 'Start a valuation discussion',
    icon: LineChart,
  },
  {
    title: 'Finance Outsourcing',
    slug: 'finance-outsourcing',
    summary:
      'Accounting, MIS, payroll, statutory compliance, expense verification, fixed asset register and controllership.',
    promise:
      'We help companies run sharper finance operations with reliable reporting, compliant books and better management visibility.',
    seoTitle: 'Finance Outsourcing, Accounting, MIS & vCFO Services',
    metaDescription:
      'Nucleus Advisors supports finance teams with accounting, MIS reporting, payroll, statutory compliance, expense verification, fixed asset registers and vCFO services.',
    howWeHelp: [
      'Accounting services.',
      'MIS reporting.',
      'Statutory compliance.',
      'Payroll services.',
      'Expense verification.',
      'Fixed asset register management.',
      'Physical verification.',
      'Controllership.',
      'vCFO support.',
      'Audit support.',
    ],
    deliverables: [
      'Monthly MIS pack.',
      'Compliance tracker.',
      'Bookkeeping and close calendar.',
      'Payroll tracker.',
      'Finance process SOPs.',
      'Expense verification report.',
      'Fixed asset register.',
    ],
    experts: ['CA Pravesh Goel', 'CA Tarun Agarwal', 'CA Hemendra Chauhan', 'Geetanjali Virmani'],
    leadMagnet: 'Monthly MIS Template for Founders',
    cta: 'Strengthen finance operations',
    icon: BarChart3,
  },
  {
    title: 'Corporate Secretarial',
    slug: 'corporate-secretarial',
    summary:
      'Incorporation, ROC, registers, board and shareholder documentation, due diligence and compliance calendars.',
    promise:
      'We help companies keep corporate records, filings, governance actions and transaction documentation aligned with statutory requirements.',
    seoTitle: 'Corporate Secretarial, Company Law & Compliance Support',
    metaDescription:
      'Nucleus Advisors supports company formation, annual filings, statutory registers, company law matters, AIF compliance, due diligence and transaction documentation coordination.',
    howWeHelp: [
      'Company formation.',
      'Annual filings.',
      'Statutory registers and records.',
      'Charge creation and satisfaction.',
      'Company law matters.',
      'General meeting extensions.',
      'AIF compliance support.',
      'Contract and transaction documentation coordination.',
      'Secretarial due diligence.',
    ],
    deliverables: [
      'Compliance calendar.',
      'Statutory registers checklist.',
      'Board and shareholder documentation tracker.',
      'ROC filing tracker.',
      'Due diligence request list.',
      'Governance action note.',
    ],
    experts: ['CS Neha Rathore', 'Astha Kumar'],
    leadMagnet: 'Corporate Compliance Calendar',
    cta: 'Review corporate compliance status',
    icon: ClipboardCheck,
  },
  {
    title: 'AIF & Fund Management',
    slug: 'aif-fund-management',
    summary:
      'AIF structuring support, setup coordination, compliance maintenance, investor onboarding and fund operations.',
    promise:
      'We help sponsors, fund platforms and investment networks bring structure, compliance discipline, documentation and operating clarity to AIF and fund management ecosystems.',
    seoTitle: 'AIF Setup, Fund Management & Compliance Support | Nucleus Advisors',
    metaDescription:
      'Nucleus Advisors supports AIF structuring, setup coordination, compliance maintenance, investor onboarding, documentation, reporting and fund operations.',
    howWeHelp: [
      'AIF structure planning and setup coordination.',
      'Fund documentation and compliance calendar support.',
      'Investor onboarding and KYC process support.',
      'Drawdown, contribution and unit certificate process coordination.',
      'Trustee, sponsor, investment manager and service-provider coordination.',
      'Compliance maintenance and filing trackers.',
      'Investor communication and reporting workflows.',
      'Fund operations process design.',
      'Portfolio update and monitoring discipline.',
      'AIF due diligence and secretarial support.',
    ],
    deliverables: [
      'AIF setup workplan.',
      'Regulatory and compliance calendar.',
      'Investor onboarding checklist.',
      'KYC and document collection tracker.',
      'Drawdown and unit certificate process tracker.',
      'Fund operations SOP.',
      'Investment documentation tracker.',
      'Portfolio reporting calendar.',
    ],
    experts: ['CS Neha Rathore', 'CA Vijay Singh Rathore', 'Samarth Pandey', 'Astha Kumar'],
    leadMagnet: 'AIF Setup and Compliance Readiness Checklist',
    cta: 'Discuss AIF structuring and fund operations',
    proof: [
      'Investment Manager to Soonicorn Angel Trust-I.',
      'Soonicorn Angel Trust-I is presented publicly as a SEBI-registered Category I Angel Fund.',
      'Proof is shown as operating experience, not as investment solicitation or performance promotion.',
    ],
    icon: Building2,
  },
];

export const industries = [
  'Startups and funded companies',
  'Founder-led and family businesses',
  'Investor-backed growth companies',
  'Funds, family offices and investment networks',
  'Manufacturing, services and digital-first businesses',
  'Companies preparing for audit, transaction or listing readiness',
];

export type Testimonial = {
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany?: string;
  companyLogo?: string;
  authorPhoto?: string;
  consentNote?: string;
  featured?: boolean;
};

/*
 * Real, consented testimonials only.
 *
 * Workflow before adding an entry here:
 *   1. Get written consent from the client to attribute the quote on the public site.
 *   2. Capture the consent context in `consentNote` (e.g. "Approved by signatory on 2026-04-12").
 *   3. Confirm with the relevant partner that the client logo/photo can be used externally.
 *
 * When the array is empty, the homepage testimonial section auto-hides in production
 * and shows a clearly-marked "awaiting consented quotes" placeholder in dev.
 */
export const testimonials: Testimonial[] = [];

export const insightCategories = [
  'Deals and Investment Banking',
  'M&A and Restructuring',
  'Risk, IFC and Internal Audit',
  'GST and Indirect Tax',
  'Direct Tax and Transfer Pricing',
  'Valuations',
  'Assurance and Reporting',
  'AIF and Fund Management',
];
