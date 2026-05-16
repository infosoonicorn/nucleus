'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

type FaqItem = {
  q: string;
  a?: string;
};

type FaqProps = Readonly<{
  ordinal: string;
  serviceTitle: string;
  faq?: FaqItem[];
}>;

function genericQuestions(serviceTitle: string): FaqItem[] {
  return [
    `When should a company engage Nucleus for ${serviceTitle}?`,
    'What information should the client prepare before the first discussion?',
    'What deliverables can management expect from this workstream?',
    'Which related services may become relevant as the engagement progresses?',
  ].map((q) => ({ q }));
}

/**
 * Split a single-paragraph FAQ answer into a TL;DR (first sentence) plus body
 * (everything after). Only splits when the first sentence is short enough to
 * read as a one-line lede; otherwise renders the whole answer as body prose.
 */
function splitAnswer(a: string | undefined): { tldr?: string; body: string[] } {
  if (!a) return { body: [] };
  const trimmed = a.trim();
  // Match the first sentence ending with . ! or ? followed by a space.
  // [\s\S] avoids needing the /s dotall flag (TS target below es2018).
  const match = trimmed.match(/^([\s\S]+?[.!?])(\s+)([\s\S]+)$/);
  if (match) {
    const [, first, , rest] = match;
    if (first.length <= 180 && first.length >= 20) {
      return { tldr: first, body: [rest] };
    }
  }
  return { body: [trimmed] };
}

export function Faq({ ordinal, serviceTitle, faq }: FaqProps) {
  const items: FaqItem[] = faq ?? genericQuestions(serviceTitle);

  const parsed = useMemo(
    () =>
      items.map((it, i) => ({
        ord: String(i + 1).padStart(2, '0'),
        q: it.q,
        ...splitAnswer(it.a),
      })),
    [items],
  );

  // First item open by default to anchor the editorial rhythm. All others closed.
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set([0]));

  function toggle(i: number) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }
  function expandAll() {
    setOpenSet(new Set(parsed.map((_, i) => i)));
  }
  function collapseAll() {
    setOpenSet(new Set());
  }

  const openCount = openSet.size;
  const total = parsed.length;
  const updated = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });

  return (
    <section className="service-v1-section service-v1-faq" aria-labelledby="ib-faq-heading">
      <header className="service-v1-faq-head">
        <div>
          <p className="service-v1-faq-eyebrow">
            <span className="service-v1-faq-eyebrow-num">§{ordinal}</span>
            <span className="service-v1-faq-eyebrow-bar" aria-hidden="true" />
            <span>FAQs · On the record</span>
          </p>
          <h2 id="ib-faq-heading" className="service-v1-faq-title">
            Questions <em>this page</em> is designed to answer
            <span className="service-v1-faq-title-stop">.</span>
          </h2>
        </div>
        <div className="service-v1-faq-headside">
          <p className="service-v1-faq-lede">
            Ten of the questions we hear most often from founders, with the{' '}
            <em>honest, partner-level answers</em> we&rsquo;d give over coffee — no marketing veneer.
          </p>
          <div className="service-v1-faq-livemeta">
            <span className="service-v1-faq-livedot" aria-hidden="true" />
            <span>Updated · {updated}</span>
          </div>
        </div>
      </header>

      <div className="service-v1-faq-toolbar">
        <div className="service-v1-faq-count">
          <strong>{openCount}</strong> of <strong>{total}</strong> open
        </div>
        <div className="service-v1-faq-toolbar-actions">
          <button
            type="button"
            className="service-v1-faq-toolbar-btn"
            onClick={expandAll}
          >
            Expand all
          </button>
          <button
            type="button"
            className="service-v1-faq-toolbar-btn"
            onClick={collapseAll}
          >
            Collapse all
          </button>
        </div>
      </div>

      <ol className="service-v1-faq-list">
        {parsed.map((item, i) => {
          const isOpen = openSet.has(i);
          return (
            <li
              key={item.q}
              className={`service-v1-faq-entry ${isOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="service-v1-faq-summary"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => toggle(i)}
              >
                <span className="service-v1-faq-num">§Q.{item.ord}</span>
                <span className="service-v1-faq-q">{item.q}</span>
                <span className="service-v1-faq-toggle" aria-hidden="true">
                  <Plus size={12} strokeWidth={2.5} />
                </span>
              </button>
              <div
                id={`faq-panel-${i}`}
                className="service-v1-faq-answer"
                role="region"
                aria-hidden={!isOpen}
              >
                <div className="service-v1-faq-answer-inner">
                  <div className="service-v1-faq-answer-body">
                    {item.body.length === 0 ? (
                      <p className="service-v1-faq-pending">
                        <span className="service-v1-pending-pill">Updating soon</span> Reviewer-approved
                        content for this question is in preparation.
                      </p>
                    ) : (
                      <>
                        {item.tldr ? <p className="service-v1-faq-tldr">{item.tldr}</p> : null}
                        {item.body.map((para, pi) => (
                          <p key={pi} className="service-v1-faq-para">
                            {para}
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="service-v1-faq-foot">
        <p className="service-v1-faq-foot-meta">
          Didn&rsquo;t find your question? <em>Ask us directly</em> — partner-level reply within 48 hours.
        </p>
      </footer>
    </section>
  );
}
