import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/useAppStore';
import styles from './hud.module.css';

// 9x9 pixel icons drawn as rects so they stay crisp at any zoom.
const SUN = ['....#....', '.#.....#.', '...###...', '..#####..', '#.#####.#', '..#####..', '...###...', '.#.....#.', '....#....'];
const MOON = ['...####..', '..##.....', '.##......', '.##......', '.##......', '.##......', '..##.....', '...####..', '.........'];

function PixelIcon({ rows }: { rows: string[] }) {
  return (
    <svg className={styles.pixelIcon} viewBox="0 0 9 9" aria-hidden="true" shapeRendering="crispEdges">
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) => (cell === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)),
      )}
    </svg>
  );
}

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
        <PixelIcon rows={SUN} />
      </span>
      <span className={styles.switchSide} data-active={isNight}>
        <PixelIcon rows={MOON} />
      </span>
      <span className={styles.knob} data-night={isNight} aria-hidden="true" />
    </button>
  );
}
