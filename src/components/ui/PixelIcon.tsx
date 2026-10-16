import styles from './PixelIcon.module.css';

/** Pixel icon from a string grid ('#' = filled), drawn as rects so it stays crisp at any size. */
export function PixelIcon({ rows, size = 14 }: { rows: readonly string[]; size?: number }) {
  const w = rows[0]?.length ?? 0;
  return (
    <svg
      className={styles.icon}
      style={{ width: size, height: size }}
      viewBox={`0 0 ${w} ${rows.length}`}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) => (cell === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)),
      )}
    </svg>
  );
}
