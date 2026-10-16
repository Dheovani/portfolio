import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { LOCALES, type Locale, type Localized } from '../content/types';
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';

const STORAGE_KEY = 'portfolio.lang';
const HTML_LANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en', es: 'es' };

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

function initialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage may be unavailable (private mode); fall through to the browser language.
  }
  const browser = navigator.language.slice(0, 2).toLowerCase();
  return isLocale(browser) ? browser : 'pt';
}

function applyDocumentLocale(lng: string): void {
  const locale = isLocale(lng) ? lng : 'pt';
  document.documentElement.lang = HTML_LANG[locale];
  document.title = i18n.t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', i18n.t('meta.description'));
}

void i18n.use(initReactI18next).init({
  resources: { pt: { translation: pt }, en: { translation: en }, es: { translation: es } },
  lng: initialLocale(),
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
});

applyDocumentLocale(i18n.language);
i18n.on('languageChanged', (lng) => {
  applyDocumentLocale(lng);
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // Not persisted; the choice still applies to this visit.
  }
});

export function setLocale(locale: Locale): void {
  void i18n.changeLanguage(locale);
}

/** Current locale plus a picker for localized content values. */
export function useLocale(): { locale: Locale; pick: <T>(value: Localized<T>) => T } {
  const { i18n: instance } = useTranslation();
  const locale = isLocale(instance.resolvedLanguage) ? instance.resolvedLanguage : 'pt';
  return { locale, pick: (value) => value[locale] };
}

export default i18n;
