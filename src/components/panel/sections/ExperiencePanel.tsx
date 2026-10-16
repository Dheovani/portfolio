import { useTranslation } from 'react-i18next';
import { experience } from '../../../content/experience';
import { useLocale } from '../../../i18n';
import { OrPending } from './Pending';
import styles from './sections.module.css';

export function ExperiencePanel() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  return (
    <ol className={styles.list}>
      {experience.map((job, i) => (
        <li key={i} className={styles.entry}>
          <div className={styles.entryHead}>
            <h3 className={styles.entryTitle}>{pick(job.role)}</h3>
          </div>
          <dl className={styles.meta}>
            <div>
              <dt>{t('panel.company')}:</dt>
              <dd>
                <OrPending value={job.company}>{(company) => company}</OrPending>
              </dd>
            </div>
            <div>
              <dt>{t('panel.period')}:</dt>
              <dd>
                <OrPending value={job.period}>{(period) => pick(period)}</OrPending>
              </dd>
            </div>
            {job.location && (
              <div>
                <dt>{t('panel.location')}:</dt>
                <dd>{pick(job.location)}</dd>
              </div>
            )}
          </dl>
          {job.responsibilities && (
            <>
              <h4 className={styles.label}>{t('panel.responsibilities')}</h4>
              <ul className={styles.bullets}>
                {pick(job.responsibilities).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          <h4 className={styles.label} style={{ marginTop: 12 }}>
            {t('panel.achievements')}
          </h4>
          <OrPending value={job.achievements}>
            {(achievements) => (
              <ul className={`${styles.bullets} ${styles.spaced}`}>
                {pick(achievements).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </OrPending>
          <h4 className={styles.label} style={{ marginTop: 12 }}>
            {t('panel.technologies')}
          </h4>
          <OrPending value={job.technologies}>
            {(techs) => (
              <ul className={styles.tags}>
                {techs.map((tech) => (
                  <li key={tech} className={styles.tag}>
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </OrPending>
        </li>
      ))}
    </ol>
  );
}
