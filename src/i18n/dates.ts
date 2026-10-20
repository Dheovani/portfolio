import type { DateRange, IsoDate, Locale } from '../content/types';

const LOCALE_TAGS: Record<Locale, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

/** Formats 'YYYY' or 'YYYY-MM-DD'. `month` → "nov. de 2025"; `full` → "3 de novembro de 2025". */
export function formatDate(iso: IsoDate, locale: Locale, style: 'month' | 'full' = 'month'): string {
  const [year, month, day] = iso.split('-').map(Number);
  if (!month) return String(year);
  const date = new Date(Date.UTC(year!, month - 1, day ?? 1));
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    timeZone: 'UTC',
    year: 'numeric',
    month: style === 'full' ? 'long' : 'short',
    day: style === 'full' ? 'numeric' : undefined,
  }).format(date);
}

export function formatRange(range: DateRange, locale: Locale): string {
  const end = formatDate(range.end, locale);
  return range.start ? `${formatDate(range.start, locale)} – ${end}` : end;
}
