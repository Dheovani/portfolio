export const LOCALES = ['pt', 'en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

/** A value available in every supported language. */
export type Localized<T = string> = Record<Locale, T>;

/**
 * Marks information that does not exist yet in the source material.
 * Panels render it with a visible "to be filled" style instead of inventing content.
 */
export const PENDING = null;
export type Pending = typeof PENDING;
export type MaybePending<T> = T | Pending;

export interface Profile {
  name: string;
  role: Localized;
  headline: Localized;
  summary: Localized<string[]>;
  highlights: { title: Localized; text: Localized }[];
  interests: Localized<string[]>;
  location: MaybePending<Localized>;
}

export interface ExperienceEntry {
  role: Localized;
  company: MaybePending<string>;
  period: MaybePending<Localized>;
  location?: Localized;
  /** Optional: shown only when provided. */
  responsibilities?: Localized<string[]>;
  achievements: MaybePending<Localized<string[]>>;
  technologies: MaybePending<string[]>;
}

export type EducationKind = 'degree' | 'postgraduate' | 'certification';

/** ISO date: 'YYYY-MM-DD', or 'YYYY' when only the year is known. */
export type IsoDate = string;

export interface DateRange {
  start?: IsoDate;
  end: IsoDate;
}

/**
 * What the site shows instead of the original document. Only fields that are safe to publish:
 * never ID numbers (RG/CPF), birth dates, grades or verification links that reveal them.
 */
export interface CertificateSummary {
  document: 'certificate' | 'diploma';
  /** Full institution name as printed on the document. */
  issuer: string;
  place?: string;
  issued: IsoDate;
  hours?: number;
  /** Accent colour of the visual card (a nod to the institution, without its logo). */
  accent: string;
}

export interface EducationEntry {
  kind: EducationKind;
  title: Localized;
  institution: MaybePending<string>;
  period: MaybePending<DateRange>;
  description: Localized;
  certificate?: CertificateSummary;
}

export type ProjectStatus = 'active' | 'maintenance';

export interface Project {
  name: string;
  description: Localized;
  technologies: string[];
  repository?: string;
  status: ProjectStatus;
  featured?: boolean;
}

export type ContactKind = 'email' | 'linkedin' | 'github';

export interface Contact {
  kind: ContactKind;
  label: string;
  value: string;
  href: string;
}
