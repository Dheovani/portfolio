import { useTranslation } from 'react-i18next';
import { education } from '../../../content/education';
import { useLocale } from '../../../i18n';
import { OrPending } from './Pending';
import styles from './sections.module.css';

export function EducationPanel() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  return (
    <ol className={styles.list}>
      {education.map((entry) => (
        <li key={entry.title.en} className={styles.entry}>
          <div className={styles.entryHead}>
            <h3 className={styles.entryTitle}>{pick(entry.title)}</h3>
            <span className={`${styles.badge} ${entry.kind === 'certification' ? styles.badgeWarm : styles.badgeCyan}`}>
              {t(`panel.kind.${entry.kind}`)}
            </span>
          </div>
          <dl className={styles.meta}>
            <div>
              <dt>{t('panel.institution')}:</dt>
              <dd>
                <OrPending value={entry.institution}>{(name) => name}</OrPending>
              </dd>
            </div>
            <div>
              <dt>{t('panel.period')}:</dt>
              <dd>
                <OrPending value={entry.period}>{(period) => pick(period)}</OrPending>
              </dd>
            </div>
          </dl>
          <p className={styles.text}>{pick(entry.description)}</p>
          {entry.certificate && (
            <a className={styles.link} href={entry.certificate} target="_blank" rel="noopener noreferrer">
              {t('panel.certificate')} <span aria-hidden="true">↗</span>
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}
