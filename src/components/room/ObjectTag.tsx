import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { SectionId } from '../../game/world/layout';
import styles from './ObjectTag.module.css';

interface ObjectTagProps {
  section: SectionId;
  style: CSSProperties;
  /** As a button the tag is invisible until it receives keyboard focus. */
  as?: 'button';
  onActivate?: () => void;
}

/** Small label floating above an object: shown on mouse hover, or on keyboard focus as a button. */
export function ObjectTag({ section, style, as, onActivate }: ObjectTagProps) {
  const { t } = useTranslation();
  const title = t(`sections.${section}`);
  const object = t(`objects.${section}`);
  const content = (
    <>
      <span className={styles.title}>{title}</span>
      <span className={styles.object}>{object}</span>
    </>
  );
  if (as === 'button') {
    return (
      <button
        type="button"
        className={`${styles.tag} ${styles.focusTarget}`}
        style={style}
        aria-label={t('room.open', { section: title, object })}
        onClick={onActivate}
      >
        {content}
      </button>
    );
  }
  return (
    <div className={styles.tag} style={style} aria-hidden="true">
      {content}
    </div>
  );
}
