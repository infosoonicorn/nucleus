'use client';

import Image from 'next/image';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { testimonials, type Testimonial } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

const isDev = process.env.NODE_ENV !== 'production';

function Avatar({ name, photo }: Readonly<{ name: string; photo?: string }>) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (photo) {
    return (
      <span className="home-v3-testimonial-avatar">
        <Image src={photo} alt="" width={48} height={48} />
      </span>
    );
  }

  return (
    <span className="home-v3-testimonial-avatar home-v3-testimonial-avatar-fallback" aria-hidden="true">
      {initials}
    </span>
  );
}

function TestimonialFooter({ item }: Readonly<{ item: Testimonial }>) {
  return (
    <footer className="home-v3-testimonial-footer">
      <Avatar name={item.authorName} photo={item.authorPhoto} />
      <span>
        <cite className="home-v3-testimonial-name">{item.authorName}</cite>
        <span className="home-v3-testimonial-role">
          {item.authorRole}
          {item.authorCompany ? `, ${item.authorCompany}` : ''}
        </span>
      </span>
    </footer>
  );
}

function FeaturedCard({ item, index = 0 }: Readonly<{ item: Testimonial; index?: number }>) {
  return (
    <motion.article
      className="home-v3-testimonial-card home-v3-testimonial-card-featured"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
    >
      <header className="home-v3-testimonial-head">
        {item.companyLogo ? (
          <Image
            src={item.companyLogo}
            alt={item.authorCompany ?? 'Client logo'}
            width={120}
            height={28}
            className="home-v3-testimonial-logo"
          />
        ) : (
          <span className="home-v3-testimonial-logo-fallback" aria-hidden="true">
            {item.authorCompany ?? 'Client'}
          </span>
        )}
        <Quote className="home-v3-testimonial-quote-mark" aria-hidden="true" size={28} />
      </header>
      <blockquote>
        <p>{item.quote}</p>
        <TestimonialFooter item={item} />
      </blockquote>
    </motion.article>
  );
}

function SupportingCard({ item, index }: Readonly<{ item: Testimonial; index: number }>) {
  return (
    <motion.article
      className="home-v3-testimonial-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 + index * 0.07 }}
    >
      <blockquote>
        <p>{item.quote}</p>
        <TestimonialFooter item={item} />
      </blockquote>
    </motion.article>
  );
}

function EmptyState() {
  return (
    <div className="home-v3-testimonial-empty" role="note">
      <Quote aria-hidden="true" size={28} />
      <div>
        <strong>Awaiting consented client quotes.</strong>
        <p>
          The section will appear here once partner-approved testimonials are added to
          <code> apps/web/src/content/site.ts</code>. We don&apos;t ship placeholder names.
        </p>
      </div>
    </div>
  );
}

export function HomeTestimonials() {
  const real = testimonials;
  const hasReal = real.length > 0;

  if (!hasReal && !isDev) return null;

  const featured = hasReal ? (real.find((t) => t.featured) ?? real[0]) : null;
  const supporting = hasReal ? real.filter((t) => t !== featured).slice(0, 3) : [];

  return (
    <section className="home-v3-testimonials" aria-label="What clients say">
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">Voice of clients</span>
          <h2>What clients say after the work lands.</h2>
          <p>
            Testimonials below are published only with written client consent. Each is mapped
            to a partner and a specific engagement before it appears on the public site.
          </p>
        </div>
      </Reveal>

      {hasReal ? (
        <div className="home-v3-testimonials-grid">
          {featured ? <FeaturedCard item={featured} /> : null}
          {supporting.map((item, index) => (
            <SupportingCard key={`${item.authorName}-${index}`} item={item} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
