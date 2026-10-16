import { profile } from '../../content/profile';
import { useLocale } from '../../i18n';
import styles from './hud.module.css';

/** Tiny name plate in the top-left corner (decorative; the page heading is the sr-only h1). */
export function IdentityTag() {
  const { pick } = useLocale();
  return (
    <div className={styles.identity} aria-hidden="true">
      <span className={styles.name}>{profile.name}</span>
      <span className={styles.role}>{pick(profile.role)}</span>
    </div>
  );
}
