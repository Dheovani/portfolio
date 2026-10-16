// Isometric (2:1) drawing helpers. Floor coordinates are in tiles, z in pixels.
import { PixelCanvas, shade, hex } from './canvas.mjs';

export const HALF_W = 16;
export const HALF_H = 8;

/** Projects floor coordinates relative to an anchor (screen pixel of tile corner 0,0). */
export function projector(ax, ay) {
  return (fx, fy, z = 0) => [ax + (fx - fy) * HALF_W, ay + (fx + fy) * HALF_H - z];
}

/**
 * Creates a canvas sized for a footprint of `w` x `h` tiles reaching `height` px.
 * The anchor is the back corner of the footprint at floor level.
 */
export function isoSprite(w, h, height, margin = 2) {
  const canvas = new PixelCanvas((w + h) * HALF_W + margin * 2, (w + h) * HALF_H + height + margin * 2);
  const anchor = [margin + h * HALF_W, margin + height];
  return { canvas, anchor, footprint: [w, h], P: projector(...anchor) };
}

/** Material with the three visible faces lit from the upper left. */
export function material(base, { top = 1.18, left = 1, right = 0.72, edge = 1.4 } = {}) {
  return {
    top: shade(base, top),
    left: shade(base, left),
    right: shade(base, right),
    edge: shade(base, edge),
  };
}

/**
 * Draws an axis-aligned box. `left` is the +y face (front-left), `right` the +x face (front-right).
 * Optional patterns receive (u, v) in face-local pixels for texturing.
 */
export function box(sprite, x0, y0, x1, y1, z0, z1, mat, opts = {}) {
  const { canvas, P } = sprite;
  const m = mat.top ? mat : material(mat);
  if (z1 > z0) {
    canvas.poly([P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0), P(x0, y1, z0)], m.left, opts.leftPattern);
    canvas.poly([P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0), P(x1, y0, z0)], m.right, opts.rightPattern);
  }
  canvas.poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], m.top, opts.topPattern);
  if (opts.edges !== false && z1 - z0 >= 2) {
    const a = P(x0, y1, z1);
    const b = P(x1, y1, z1);
    const c = P(x1, y0, z1);
    canvas.line(a[0], a[1] - 1, b[0], b[1] - 1, m.edge);
    canvas.line(b[0], b[1] - 1, c[0] - 1, c[1] - 1, m.edge);
  }
}

/** Inverse projection of a screen pixel onto the plane x = const (wall facing +x). */
export function onPlaneX(sprite, x) {
  const [ax, ay] = sprite.anchor;
  return (sx, sy) => {
    const y = x - (sx + 0.5 - ax) / HALF_W;
    const z = ay + (x + y) * HALF_H - (sy + 0.5);
    return [y, z];
  };
}

/** Inverse projection of a screen pixel onto the plane y = const (wall facing +y). */
export function onPlaneY(sprite, y) {
  const [ax, ay] = sprite.anchor;
  return (sx, sy) => {
    const x = (sx + 0.5 - ax) / HALF_W + y;
    const z = ay + (x + y) * HALF_H - (sy + 0.5);
    return [x, z];
  };
}

/** Inverse projection of a screen pixel onto a horizontal plane at height z. */
export function onPlaneZ(sprite, z = 0) {
  const [ax, ay] = sprite.anchor;
  return (sx, sy) => {
    const a = (sx + 0.5 - ax) / HALF_W;
    const b = (sy + 0.5 - ay + z) / HALF_H;
    return [(a + b) / 2, (b - a) / 2];
  };
}

/** Paints a rectangle lying on the plane x = const using a (y, z) -> color function. */
export function paintPlaneX(sprite, x, y0, y1, z0, z1, fn) {
  const { canvas, P } = sprite;
  const inv = onPlaneX(sprite, x);
  canvas.poly([P(x, y0, z0), P(x, y1, z0), P(x, y1, z1), P(x, y0, z1)], [0, 0, 0, 0], (sx, sy) => {
    const [y, z] = inv(sx, sy);
    return fn(y, z, sx, sy);
  });
}

/** Paints a rectangle lying on the plane y = const using a (x, z) -> color function. */
export function paintPlaneY(sprite, y, x0, x1, z0, z1, fn) {
  const { canvas, P } = sprite;
  const inv = onPlaneY(sprite, y);
  canvas.poly([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)], [0, 0, 0, 0], (sx, sy) => {
    const [x, z] = inv(sx, sy);
    return fn(x, z, sx, sy);
  });
}

/** Paints a rectangle lying on a horizontal plane using an (x, y) -> color function. */
export function paintPlaneZ(sprite, z, x0, x1, y0, y1, fn) {
  const { canvas, P } = sprite;
  const inv = onPlaneZ(sprite, z);
  canvas.poly([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)], [0, 0, 0, 0], (sx, sy) => {
    const [x, y] = inv(sx, sy);
    return fn(x, y, sx, sy);
  });
}

/** Soft additive-looking glow made of concentric translucent ellipses. */
export function glow(canvas, cx, cy, rx, ry, color, strength = 60, rings = 5) {
  const [r, g, b] = hex(color);
  for (let i = rings; i >= 1; i--) {
    const t = i / rings;
    canvas.ellipse(cx, cy, rx * t, ry * t, [r, g, b, Math.round(strength / rings)]);
  }
}
