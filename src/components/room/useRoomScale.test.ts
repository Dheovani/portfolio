import { describe, expect, it } from 'vitest';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../../game/engine/dimensions';
import { computeScale } from './useRoomScale';

describe('room scale', () => {
  it('uses integer scales on large screens', () => {
    expect(computeScale(1440, 900)).toBe(3);
    expect(computeScale(1366, 657)).toBe(2);
  });

  it('keeps the whole room visible on phones and leaves room for the panel sheet', () => {
    for (const [w, h] of [[390, 844], [360, 640], [412, 915]] as const) {
      const scale = computeScale(w, h);
      expect(WORLD_WIDTH * scale - w).toBeLessThanOrEqual(24 * scale + 0.01);
      expect(WORLD_HEIGHT * scale).toBeLessThanOrEqual(h * 0.42);
    }
  });
});
