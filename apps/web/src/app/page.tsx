import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarCheck,
  FileText,
  ShieldCheck,
  Users,
} from 'lucide-react';

const services = [
  {
    title: 'Startup & Fund Advisory',
    text: 'Transaction support, investment readiness, reporting, and operating discipline for growing companies.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Compliance Operations',
    text: 'Structured tracking for statutory, financial, tax, secretarial, and recurring engagement workflows.',
    icon: ShieldCheck,
  },
  {
    title: 'Client Finance Desk',
    text: 'Billing, receivables, deliverables, document requests, and client updates in one secure workspace.',
    icon: BarChart3,
  },
];

const platformModules = [
  'Team tasks and assignments',
  'Attendance and timesheets',
  'Billing and receivables',
  'Client portal and documents',
  'Newsletters and updates',
  'Public calculators and tools',
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-mark">N</span>
          <span>Nucleus Advisors</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#platform">Platform</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Advisory, compliance, and operating systems</p>
          <h1>Nucleus Advisors</h1>
          <p className="lead">
            A sharper digital home for a firm that supports founders, funds, and businesses
            through finance, compliance, transactions, and strategic execution.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#contact">
              Start a conversation <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a className="secondary-action" href="#platform">
              View platform roadmap
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Platform preview">
          <div className="panel-top">
            <span>Firm OS</span>
            <span>Phase 1</span>
          </div>
          <div className="metric-grid">
            <div>
              <strong>Client</strong>
              <span>Portal-ready</span>
            </div>
            <div>
              <strong>Team</strong>
              <span>Workflow-ready</span>
            </div>
            <div>
              <strong>Public</strong>
              <span>Tools-ready</span>
            </div>
            <div>
              <strong>Mobile</strong>
              <span>API-ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>Built for advice that becomes execution.</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className="service-card" key={service.title}>
                <Icon aria-hidden="true" size={22} />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section platform-section" id="platform">
        <div className="section-heading">
          <p className="eyebrow">Platform</p>
          <h2>Website now. Secure operating platform next.</h2>
          <p>
            The first release can ship as a public website. The same codebase is ready to add
            Supabase auth, client access, internal workflows, and future mobile apps.
          </p>
        </div>
        <div className="module-list">
          {platformModules.map((module, index) => (
            <div className="module-row" key={module}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{module}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Let’s build the advisory platform deliberately.</h2>
          <p>
            Start with a fast deployable website, then layer client access, tasks, billing,
            attendance, updates, and public tools without rebuilding the foundation.
          </p>
        </div>
        <div className="contact-actions">
          <a href="mailto:info@nucleusadvisors.in">
            <FileText aria-hidden="true" size={18} />
            info@nucleusadvisors.in
          </a>
          <a href="https://nucleusadvisors.in">
            <Users aria-hidden="true" size={18} />
            nucleusadvisors.in
          </a>
          <a href="#platform">
            <CalendarCheck aria-hidden="true" size={18} />
            Platform roadmap
          </a>
        </div>
      </section>
    </main>
  );
}
