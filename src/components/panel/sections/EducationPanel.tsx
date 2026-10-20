import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { education } from '../../../content/education';
import { useLocale } from '../../../i18n';
import { formatRange } from '../../../i18n/dates';
import { CertificateCard } from './CertificateCard';
import { OrPending } from './Pending';
import styles from './sections.module.css';

export function EducationPanel() {
  const { t } = useTranslation();
  const { locale, pick } = useLocale();
  /** Entry whose certificate is shown in place of the list, or null for the list. */
  const [viewing, setViewing] = useState<number | null>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const openerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const returnTo = useRef<number | null>(null);

  // Move focus with the view: to "back" when a certificate opens, to its button when it closes.
  useEffect(() => {
    if (viewing !== null) {
      backRef.current?.focus();
      backRef.current?.scrollIntoView({ block: 'nearest' });
    } else if (returnTo.current !== null) {
      openerRefs.current[returnTo.current]?.focus();
      returnTo.current = null;
    }
  }, [viewing]);

  const entry = viewing !== null ? education[viewing] : undefined;
  if (entry) {
    return (
      <div className={styles.stack}>
        <button
          ref={backRef}
          type="button"
          className={styles.backButton}
          onClick={() => {
            returnTo.current = viewing;
            setViewing(null);
          }}
        >
          <span aria-hidden="true">←</span> {t('certificate.back')}
        </button>
        <CertificateCard entry={entry} />
      </div>
    );
  }

  return (
    <ol className={styles.list}>
      {education.map((item, index) => (
        <li key={item.title.en} className={styles.entry}>
          <div className={styles.entryHead}>
            <h3 className={styles.entryTitle}>{pick(item.title)}</h3>
            <span className={`${styles.badge} ${item.kind === 'certification' ? styles.badgeWarm : styles.badgeCyan}`}>
              {t(`panel.kind.${item.kind}`)}
            </span>
          </div>
          <dl className={styles.meta}>
            <div>
              <dt>{t('panel.institution')}:</dt>
              <dd>
                <OrPending value={item.institution}>{(name) => name}</OrPending>
              </dd>
            </div>
            <div>
              <dt>{t('panel.period')}:</dt>
              <dd>
                <OrPending value={item.period}>{(period) => formatRange(period, locale)}</OrPending>
              </dd>
            </div>
          </dl>
          <p className={styles.text}>{pick(item.description)}</p>
          {item.certificate && (
            <button
              ref={(el) => {
                openerRefs.current[index] = el;
              }}
              type="button"
              className={`${styles.link} ${styles.linkButton}`}
              onClick={() => setViewing(index)}
            >
              {t('panel.certificate')} <span aria-hidden="true">→</span>
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}
