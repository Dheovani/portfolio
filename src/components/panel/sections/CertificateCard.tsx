import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { CERTIFICATE_HOLDER } from '../../../content/education';
import type { EducationEntry } from '../../../content/types';
import { useLocale } from '../../../i18n';
import { formatDate, formatRange } from '../../../i18n/dates';
import styles from './CertificateCard.module.css';

/**
 * Visual stand-in for a certificate or diploma: a document-like card built from safe fields only.
 * The original files are not published (they contain ID numbers and the birth date).
 */
export function CertificateCard({ entry }: { entry: EducationEntry }) {
  const { t } = useTranslation();
  const { locale, pick } = useLocale();
  const cert = entry.certificate;
  if (!cert) return null;

  return (
    <figure className={styles.card} style={{ '--accent': cert.accent } as CSSProperties}>
      <div className={styles.paper}>
        <p className={styles.issuer}>{cert.issuer}</p>
        <p className={styles.documentType}>{t(`certificate.${cert.document}`)}</p>
        <div className={styles.rule} aria-hidden="true" />
        <p className={styles.awarded}>{t('certificate.awardedTo')}</p>
        <p className={styles.holder}>{CERTIFICATE_HOLDER}</p>
        <p className={styles.course}>{pick(entry.title)}</p>
        <dl className={styles.details}>
          {cert.hours && (
            <div>
              <dt>{t('certificate.hours')}</dt>
              <dd>{t('certificate.hoursValue', { hours: cert.hours })}</dd>
            </div>
          )}
          {entry.period?.start && (
            <div>
              <dt>{t('panel.period')}</dt>
              <dd>{formatRange(entry.period, locale)}</dd>
            </div>
          )}
          <div>
            <dt>{t('certificate.issued')}</dt>
            <dd>
              {cert.place ? `${cert.place}, ` : ''}
              {formatDate(cert.issued, locale, 'full')}
            </dd>
          </div>
        </dl>
        <div className={styles.seal} aria-hidden="true" />
      </div>
      <figcaption className={styles.note}>{t('certificate.note')}</figcaption>
    </figure>
  );
}
