import { useTranslation } from 'react-i18next';
import { LOCALES, type Locale } from '../../content/types';
import { setLocale, useLocale } from '../../i18n';
import styles from './hud.module.css';

const NATIVE_NAMES: Record<Locale, string> = { pt: 'Português', en: 'English', es: 'Español' };

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  return (
    <div className={styles.chip} role="group" aria-label={t('hud.language')}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          className={styles.segment}
          aria-pressed={code === locale}
          aria-label={NATIVE_NAMES[code]}
          onClick={() => setLocale(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
