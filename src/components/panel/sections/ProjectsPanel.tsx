import { useTranslation } from 'react-i18next';
import { GITHUB_PROFILE, projects } from '../../../content/projects';
import { useLocale } from '../../../i18n';
import styles from './sections.module.css';

export function ProjectsPanel() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  return (
    <div className={styles.stack}>
      <ul className={styles.list}>
        {projects.map((project) => (
          <li key={project.name} className={styles.entry}>
            <div className={styles.entryHead}>
              <h3 className={styles.entryTitle}>{project.name}</h3>
              <span>
                {project.featured && <span className={`${styles.badge} ${styles.badgeWarm}`}>{t('panel.featured')}</span>}{' '}
                <span className={`${styles.badge} ${project.status === 'active' ? styles.badgeCyan : ''}`}>
                  {t(`panel.status.${project.status}`)}
                </span>
              </span>
            </div>
            <p className={styles.text}>{pick(project.description)}</p>
            <ul className={styles.tags} style={{ marginTop: 10 }} aria-label={t('panel.technologies')}>
              {project.technologies.map((tech) => (
                <li key={tech} className={styles.tag}>
                  {tech}
                </li>
              ))}
            </ul>
            {project.repository && (
              <a className={styles.link} href={project.repository} target="_blank" rel="noopener noreferrer">
                {t('panel.repository')} <span aria-hidden="true">↗</span>
              </a>
            )}
          </li>
        ))}
      </ul>
      <a className={styles.link} href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
        {t('panel.allProjects')} <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
