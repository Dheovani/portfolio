import { useTranslation } from 'react-i18next';
import { profile } from '../../../content/profile';
import { useLocale } from '../../../i18n';
import styles from './sections.module.css';

export function AboutPanel() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  return (
    <div className={styles.stack}>
      <p className={styles.lead}>{pick(profile.headline)}</p>
      {pick(profile.summary).map((paragraph) => (
        <p key={paragraph} className={styles.text}>
          {paragraph}
        </p>
      ))}
      <section>
        <h3 className={styles.label}>{t('panel.highlights')}</h3>
        <div className={styles.grid3}>
          {profile.highlights.map((h) => (
            <div key={h.title.en} className={styles.tile}>
              <h3>{pick(h.title)}</h3>
              <p>{pick(h.text)}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className={styles.label}>{t('panel.interests')}</h3>
        <ul className={styles.tags}>
          {pick(profile.interests).map((interest) => (
            <li key={interest} className={styles.tag}>
              {interest}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
