import type { Metadata } from 'next';
import Link from 'next/link';
import { Linkedin, Mail, MapPin } from 'lucide-react';
import { Reveal } from '@/components/motion-primitives';
import { PageShell } from '@/components/site-chrome';
import { site } from '@/content/site';
import { ContactForm } from '@/components/contact/contact-form';

export const metadata: Metadata = {
  title: 'Contact | Nucleus Advisors',
  description:
    'Bring the decision in front of you. Nucleus Advisors will reach out to you within 24 hours. Offices in Gurugram, Jaipur, Bhatinda, Faridabad and Bengaluru.',
};

export default function ContactPage() {
  return (
    <PageShell>
      <main className="home-v3 contact-page">
        <section
          className="contact-section"
          aria-label="Contact Nucleus Advisors"
        >
          <Reveal>
            <header className="contact-aside">
              <span className="home-v3-section-eyebrow">Contact</span>
              <h1 className="contact-headline">
                Bring the decision. We&rsquo;ll bring the <em>partner</em>.
              </h1>
              <p className="contact-lede">
                One brief, one practitioner, one workplan. We&rsquo;ll reach out
                to you within 24 hours.
              </p>

              <ul className="contact-channels" aria-label="Direct channels">
                <li>
                  <a className="contact-channel" href={`mailto:${site.email}`}>
                    <Mail aria-hidden="true" size={16} />
                    <span>{site.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    className="contact-channel"
                    href={site.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin aria-hidden="true" size={16} />
                    <span>LinkedIn</span>
                  </a>
                </li>
              </ul>

              <div className="contact-offices">
                <p className="contact-offices-label">
                  <MapPin aria-hidden="true" size={14} />
                  <span>Five offices across India</span>
                </p>
                <ul className="contact-offices-list">
                  {site.locations.map((location, i) => (
                    <li key={location}>
                      {location}
                      {i === 0 ? <span className="contact-offices-hq">HQ</span> : null}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="contact-tail">
                Looking for an existing engagement?{' '}
                <Link href="/team">Reach a partner directly.</Link>
              </p>
            </header>
          </Reveal>

          <ContactForm />
        </section>
      </main>
    </PageShell>
  );
}
