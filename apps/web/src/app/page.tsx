import Image from 'next/image';
import { ArrowUpRight, Linkedin, Mail } from 'lucide-react';

export default function Home() {
  return (
    <main className="maintenance-page">
      <section className="hero-rebuild" aria-labelledby="maintenance-title">
        <div className="hero-shell">
          <header className="maintenance-header">
            <Image src="/brand/nucleus-logo.png" alt="Nucleus Advisors" width={181} height={60} priority />
            <a className="header-link" href="mailto:info@nucleusadvisors.in">
              <Mail aria-hidden="true" size={18} />
              info@nucleusadvisors.in
            </a>
          </header>

          <div className="hero-content">
            <div className="hero-copy">
              <p className="maintenance-kicker">Always Onward</p>
              <h1 id="maintenance-title">We are rebuilding the Nucleus Advisors website.</h1>
              <p className="maintenance-copy">
                A sharper digital home is underway for our investment banking, risk advisory,
                tax and regulatory work. We will be back soon with a stronger experience.
              </p>
              <div className="hero-actions">
                <a className="primary-link" href="mailto:info@nucleusadvisors.in">
                  <Mail aria-hidden="true" size={18} />
                  Email us
                </a>
                <a
                  className="secondary-link"
                  href="https://in.linkedin.com/company/nucleusadvisors"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin aria-hidden="true" size={18} />
                  LinkedIn
                  <ArrowUpRight aria-hidden="true" size={16} />
                </a>
              </div>
            </div>

            <div className="build-visual" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="blueprint-card">
                <div className="blueprint-top">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="blueprint-grid">
                  <span className="block block-wide" />
                  <span className="block" />
                  <span className="block block-red" />
                  <span className="block block-tall" />
                  <span className="block block-wide" />
                </div>
                <div className="progress-track">
                  <span />
                </div>
              </div>
              <div className="tool-card tool-card-one">Strategy</div>
              <div className="tool-card tool-card-two">Risk</div>
              <div className="tool-card tool-card-three">Capital</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="maintenance-footer">
        <span>Website refresh in progress</span>
        <a href="mailto:info@nucleusadvisors.in">info@nucleusadvisors.in</a>
        <a href="https://in.linkedin.com/company/nucleusadvisors" target="_blank" rel="noreferrer">
          Check LinkedIn
          <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </footer>
    </main>
  );
}
