import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/useAppStore';
import styles from './OnboardingHint.module.css';

/** One-line hint at the bottom of the screen until the visitor first walks or opens something. */
export function OnboardingHint() {
  const { t } = useTranslation();
  const hasExplored = useAppStore((s) => s.hasExplored);
  if (hasExplored) return null;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return (
    <p className={styles.hint} role="status">
      {t(coarse ? 'hud.hintTouch' : 'hud.hintPointer')}
    </p>
  );
}
