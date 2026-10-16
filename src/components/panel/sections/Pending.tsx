import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './sections.module.css';

/** Renders `children` for real data, or a visible "to be filled" marker for PENDING values. */
export function OrPending<T>({ value, children }: { value: T | null; children: (value: T) => ReactNode }) {
  const { t } = useTranslation();
  if (value === null) return <span className={styles.pending}>{t('panel.pending')}</span>;
  return <>{children(value)}</>;
}
