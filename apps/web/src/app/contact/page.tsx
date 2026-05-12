import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { SectionHeader } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';
import { services, site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact | Nucleus Advisors',
  description:
    'Contact Nucleus Advisors for consulting support across transactions, risk, tax, assurance, valuations, finance operations and compliance.',
};

export default function ContactPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <div>
            <p className="eyebrow">Contact</p>
            <h1>Start with the decision or workstream in front of you.</h1>
            <p>
              Share the context, preferred city and service interest. Phase 1 keeps this as a form UI;
              secure storage and workflow states arrive in Phase 1.5.
            </p>
          </div>
        </section>
        <section className="section contact-layout">
          <div>
            <SectionHeader eyebrow="Offices" title="Nucleus locations." />
            <div className="list-grid">
              {site.locations.map((location) => (
                <div key={location}>{location}</div>
              ))}
            </div>
            <a className="contact-email" href={`mailto:${site.email}`}>
              <Mail aria-hidden="true" size={18} />
              {site.email}
            </a>
          </div>
          <form className="contact-form" action={`mailto:${site.email}`} method="post" encType="text/plain">
            <label>
              Name
              <input name="name" type="text" />
            </label>
            <label>
              Company
              <input name="company" type="text" />
            </label>
            <label>
              Email
              <input name="email" type="email" />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" />
            </label>
            <label>
              Service interest
              <select name="service">
                {services.map((service) => (
                  <option key={service.slug}>{service.title}</option>
                ))}
                <option>Client Portal Support</option>
              </select>
            </label>
            <label>
              Preferred office/city
              <input name="city" type="text" />
            </label>
            <label className="full-field">
              Message
              <textarea name="message" rows={5} />
            </label>
            <label className="consent full-field">
              <input name="consent" type="checkbox" />
              <span>
                I consent to Nucleus Advisors using this information to respond to my enquiry.
                Backend storage and privacy policy copy will be finalized in Phase 1.5.
              </span>
            </label>
            <button className="button full-field" type="submit">
              Submit enquiry
            </button>
          </form>
        </section>
      </main>
    </PageShell>
  );
}
