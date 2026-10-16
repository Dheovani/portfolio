import { useEffect, useState } from 'react';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../../game/engine/dimensions';

const MARGIN = 8;
/** Art pixels on each side that hold only the outer wall edge and may be cropped on phones. */
const PHONE_SIDE_CROP = 12;
/** Must match --sheet-height in global.css: share of the screen a panel takes on phones. */
const PHONE_SHEET_SHARE = 0.58;

/** Phone layout: matches the `max-width: 600px` breakpoint used by the panel bottom sheet. */
export function isPhonePortrait(viewportWidth: number, viewportHeight: number): boolean {
  return viewportWidth <= 600 && viewportHeight > viewportWidth;
}

/**
 * Display scale of the pixel-art canvas. Integer scales from 2x keep every art pixel the same size.
 * On phones the whole room stays visible (only the outer wall edge may be cropped) and it must also
 * fit above an open panel; everything else is fitted exactly.
 */
export function computeScale(viewportWidth: number, viewportHeight: number): number {
  if (isPhonePortrait(viewportWidth, viewportHeight)) {
    const byWidth = viewportWidth / (WORLD_WIDTH - PHONE_SIDE_CROP * 2);
    const aboveSheet = (viewportHeight * (1 - PHONE_SHEET_SHARE) - MARGIN * 2) / WORLD_HEIGHT;
    return Math.max(0.5, Math.min(1.5, byWidth, aboveSheet));
  }
  const fit = Math.min((viewportWidth - MARGIN * 2) / WORLD_WIDTH, (viewportHeight - MARGIN * 2) / WORLD_HEIGHT);
  return fit >= 2 ? Math.floor(fit) : Math.max(0.5, fit);
}

export function useRoomScale(): number {
  const [scale, setScale] = useState(() => computeScale(window.innerWidth, window.innerHeight));
  useEffect(() => {
    const onResize = () => setScale(computeScale(window.innerWidth, window.innerHeight));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return scale;
}
