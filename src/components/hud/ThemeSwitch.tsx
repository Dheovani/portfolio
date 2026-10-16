import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/useAppStore';
import { ICONS } from '../ui/icons';
import { PixelIcon } from '../ui/PixelIcon';
import styles from './hud.module.css';

/** Day/night switch for the room lighting. */
export function ThemeSwitch() {
  const { t } = useTranslation();
  const time = useAppStore((s) => s.timeOfDay);
  const setTime = useAppStore((s) => s.setTimeOfDay);
  const isNight = time === 'night';

  useEffect(() => {
    document.documentElement.dataset.time = time;
  }, [time]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isNight}
      aria-label={t('hud.timeOfDay')}
      title={isNight ? t('hud.night') : t('hud.day')}
      className={`${styles.chip} ${styles.switch}`}
      onClick={() => setTime(isNight ? 'day' : 'night')}
    >
      <span className={styles.switchSide} data-active={!isNight}>
        <PixelIcon rows={ICONS.sun} />
      </span>
      <span className={styles.switchSide} data-active={isNight}>
        <PixelIcon rows={ICONS.moon} />
      </span>
      <span className={styles.knob} data-night={isNight} aria-hidden="true" />
    </button>
  );
}
