'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

/**
 * Native-select dropdown toolbar for /insights. Four filters drive the
 * server-rendered article list via URL query params:
 *   - service (slug)
 *   - tag    (string)
 *   - author (team-member slug)
 *   - sort   ('newest' default | 'oldest')
 *
 * The client-side text search lives in InsightsGrid because it
 * filters in-memory without round-tripping the server. Together they
 * cover the full filter / sort / search surface.
 *
 * Native <select> elements (custom-styled) used on purpose: real
 * mobile UI, real keyboard nav, real screen-reader semantics, zero
 * runtime cost. The ChevronDown icon overlays a select with
 * appearance:none.
 */
export type FilterOption = { value: string; label: string; count?: number };

export function InsightsToolbar({
  services,
  tags,
  authors,
  currentService,
  currentTag,
  currentAuthor,
  currentSort,
}: Readonly<{
  services: readonly FilterOption[];
  tags: readonly FilterOption[];
  authors: readonly FilterOption[];
  currentService: string;
  currentTag: string;
  currentAuthor: string;
  currentSort: 'newest' | 'oldest';
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: 'service' | 'tag' | 'author' | 'sort', value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `/insights?${qs}` : '/insights');
  }

  return (
    <div className="hub-toolbar" aria-label="Filter and sort insights">
      <Dropdown
        label="Service"
        value={currentService}
        allLabel="All services"
        options={services}
        onChange={(v) => update('service', v)}
      />
      <Dropdown
        label="Tag"
        value={currentTag}
        allLabel="All tags"
        options={tags}
        onChange={(v) => update('tag', v)}
      />
      <Dropdown
        label="Author"
        value={currentAuthor}
        allLabel="All authors"
        options={authors}
        onChange={(v) => update('author', v)}
      />
      <Dropdown
        label="Sort"
        value={currentSort === 'oldest' ? 'oldest' : ''}
        allLabel="Newest first"
        options={[{ value: 'oldest', label: 'Oldest first' }]}
        onChange={(v) => update('sort', v)}
      />
    </div>
  );
}

function Dropdown({
  label,
  value,
  allLabel,
  options,
  onChange,
}: Readonly<{
  label: string;
  value: string;
  allLabel: string;
  options: readonly FilterOption[];
  onChange: (v: string) => void;
}>) {
  const active = value !== '';
  return (
    <label className={`hub-dropdown${active ? ' is-active' : ''}`}>
      <span className="hub-dropdown-label">{label}</span>
      <span className="hub-dropdown-shell">
        <select
          className="hub-dropdown-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{allLabel}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
              {opt.count !== undefined ? ` (${opt.count})` : ''}
            </option>
          ))}
        </select>
        <ChevronDown size={14} aria-hidden="true" className="hub-dropdown-caret" />
      </span>
    </label>
  );
}
