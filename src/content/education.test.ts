import { describe, expect, it } from 'vitest';
import { formatDate, formatRange } from '../i18n/dates';
import { education } from './education';

describe('education dates', () => {
  it('formats periods and issue dates per language', () => {
    expect(formatDate('2026-03-03', 'pt', 'full')).toBe('3 de março de 2026');
    expect(formatDate('2026-03-03', 'en', 'full')).toBe('March 3, 2026');
    expect(formatDate('2023', 'es')).toBe('2023');
    expect(formatRange({ start: '2025-11-03', end: '2026-03-03' }, 'en')).toBe('Nov 2025 – Mar 2026');
  });

  it('lists entries most recent first', () => {
    const ends = education.map((e) => e.period?.end ?? '');
    expect([...ends].sort().reverse()).toEqual(ends);
  });
});

describe('personal data safeguards', () => {
  it('publishes no certificate files', () => {
    const files = Object.keys(import.meta.glob(['/src/**/*.pdf', '/public/**/*.pdf']));
    expect(files).toEqual([]);
  });

  it('contains no CPF-like numbers in the site content', () => {
    const sources = import.meta.glob<string>('/src/{content,i18n}/**/*.{ts,json}', {
      query: '?raw',
      import: 'default',
      eager: true,
    });
    for (const [file, text] of Object.entries(sources)) {
      expect(text, file).not.toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
    }
  });
});
