// Furniture sprites. Each returns an iso sprite whose anchor is the back corner of its footprint.
import { shade, rng } from './lib/canvas.mjs';
import { isoSprite, box, paintPlaneX, paintPlaneY, paintPlaneZ, glow, material } from './lib/iso.mjs';
import { C, BOOK_COLORS } from './palette.mjs';
import { hash2 } from './room.mjs';

export function bed() {
  const s = isoSprite(3, 2, 30);
  box(s, 0, 0, 3, 2, 0, 7, C.woodDark);
  box(s, 0, 0, 0.3, 2, 0, 28, C.woodDark);
  box(s, 0.3, 0.12, 0.38, 1.88, 9, 25, '#4b4a63', { edges: false });
  box(s, 0.38, 0.06, 2.95, 1.94, 7, 13, C.sheet);
  box(s, 0.5, 0.2, 1.1, 0.95, 13, 17, C.pillow);
  box(s, 0.5, 1.05, 1.1, 1.8, 13, 17, C.pillow);
  box(s, 1.15, 0.02, 1.45, 1.98, 10, 15.5, C.sheet);
  box(s, 1.4, 0.02, 3.0, 1.98, 9, 15, C.blanket, {
    leftPattern: (x, y) => (hash2(x, y * 3) > 0.92 ? shade(C.blanket, 0.88) : undefined),
  });
  // Quilt stitching on top.
  paintPlaneZ(s, 15, 1.4, 3.0, 0.02, 1.98, (x, y) =>
    Math.abs(((x - 1.4) % 0.5) - 0.25) < 0.02 || Math.abs((y % 0.66) - 0.33) < 0.02 ? shade(C.blanket, 1.32) : undefined,
  );
  return s;
}

export function nightstand() {
  const s = isoSprite(1, 1, 34);
  box(s, 0.12, 0.12, 0.88, 0.88, 0, 15, C.wood);
  const a = s.P(0.88, 0.14, 8);
  const b = s.P(0.88, 0.86, 8);
  s.canvas.line(a[0], a[1], b[0], b[1], C.woodDark);
  const k = s.P(0.88, 0.5, 11);
  s.canvas.set(k[0], k[1], C.metalLight);
  box(s, 0.4, 0.4, 0.62, 0.62, 15, 17, C.metalDark);
  box(s, 0.48, 0.48, 0.54, 0.54, 17, 24, C.metalDark, { edges: false });
  box(s, 0.28, 0.28, 0.76, 0.76, 23, 31, material(C.warm, { top: 1.1, left: 1, right: 0.85 }));
  return s;
}

export function bookshelf() {
  const s = isoSprite(1, 2, 60);
  const r = rng(11);
  box(s, 0, 0.1, 0.1, 1.9, 0, 56, C.woodDark);
  box(s, 0, 0, 1, 0.1, 0, 56, C.wood);
  for (const z of [0, 14, 28, 42]) {
    box(s, 0.1, 0.1, 0.95, 1.9, z, z + 2, C.wood);
    let y = 0.14;
    while (y < 1.75) {
      const w = 0.1 + r() * 0.08;
      if (r() < 0.12) {
        y += w; // gap
        continue;
      }
      const h = 7 + Math.round(r() * 4);
      const color = BOOK_COLORS[Math.floor(r() * BOOK_COLORS.length)];
      box(s, 0.22 + r() * 0.08, y, 0.86, Math.min(y + w, 1.86), z + 2, z + 2 + h, color, { edges: false });
      y += w + 0.015;
    }
  }
  box(s, 0, 0, 1, 2, 55, 58, C.woodLight);
  // Small pot plant and a tiny robot on top.
  box(s, 0.3, 0.3, 0.65, 0.65, 58, 63, C.pot);
  for (const [dy, dz, c] of [[0, 3, C.plant], [-2, 5, C.plantLight], [3, 4, C.plantDark], [1, 7, C.plant]]) {
    const p = s.P(0.48, 0.48, 63 + dz);
    s.canvas.ellipse(p[0] + dy, p[1], 2.5, 1.6, c);
  }
  box(s, 0.35, 1.2, 0.7, 1.55, 58, 62, C.metalLight);
  box(s, 0.4, 1.25, 0.65, 1.5, 62, 66, C.metalLight);
  const eye = s.P(0.65, 1.42, 64);
  s.canvas.set(eye[0], eye[1], C.cyan);
  box(s, 0, 1.9, 1, 2, 0, 56, C.wood);
  return s;
}

export function desk() {
  const s = isoSprite(3, 1, 46);
  const top = '#6b4f41';
  box(s, 0.05, 0.08, 0.16, 0.95, 0, 18, C.metalDark);
  box(s, 2.15, 0.08, 2.95, 0.95, 0, 18, C.wood);
  for (const z of [6, 12]) {
    const a = s.P(2.15, 0.95, z);
    const b = s.P(2.95, 0.95, z);
    s.canvas.line(a[0], a[1], b[0], b[1], C.woodDark);
  }
  box(s, 0, 0, 3, 1, 18, 20, top);
  const l0 = s.P(0.2, 1, 17);
  const l1 = s.P(2.1, 1, 17);
  s.canvas.line(l0[0], l0[1], l1[0], l1[1], C.cyan);
  // Monitor.
  box(s, 1.3, 0.16, 1.7, 0.36, 20, 21, C.metalDark);
  box(s, 1.45, 0.16, 1.55, 0.24, 21, 28, C.metalDark, { edges: false });
  box(s, 0.62, 0.08, 2.38, 0.2, 26, 43, C.graphite);
  const r = rng(5);
  const lines = Array.from({ length: 8 }, () => [r() * 0.3, 0.3 + r() * 0.9, r()]);
  paintPlaneY(s, 0.2, 0.7, 2.3, 28, 41.5, (x, z) => {
    const row = Math.floor((41.5 - z) / 1.6);
    const l = lines[row];
    if (l && Math.floor((41.5 - z) * 10) % 16 < 9) {
      const [indent, len, tone] = l;
      if (x > 0.78 + indent && x < 0.78 + indent + len) return tone > 0.7 ? C.warm : tone > 0.3 ? C.cyan : '#cfd6e6';
    }
    return C.screen;
  });
  // Keyboard, mouse, mug.
  box(s, 0.95, 0.46, 2.0, 0.7, 20, 21, C.graphite, {
    topPattern: (x, y) => ((x + y) % 2 === 0 ? shade(C.graphite, 1.5) : undefined),
  });
  box(s, 2.12, 0.52, 2.26, 0.7, 20, 21, C.metalLight);
  box(s, 0.32, 0.45, 0.5, 0.63, 20, 25, '#d9d4cc');
  return s;
}

export function chair() {
  const s = isoSprite(1, 1, 34);
  const fabric = '#3b3f52';
  box(s, 0.15, 0.45, 0.85, 0.55, 0, 2, C.graphite);
  box(s, 0.45, 0.15, 0.55, 0.85, 0, 2, C.graphite);
  box(s, 0.45, 0.45, 0.55, 0.55, 2, 11, C.metal, { edges: false });
  box(s, 0.16, 0.14, 0.84, 0.78, 11, 15, fabric);
  box(s, 0.12, 0.2, 0.2, 0.7, 15, 19, C.graphite);
  box(s, 0.2, 0.72, 0.8, 0.86, 13, 33, fabric);
  paintPlaneY(s, 0.86, 0.46, 0.54, 16, 31, () => C.blue);
  return s;
}

export function pcTower() {
  const s = isoSprite(1, 1, 38);
  box(s, 0.18, 0.12, 0.82, 0.86, 0, 34, C.graphite);
  paintPlaneY(s, 0.86, 0.26, 0.32, 5, 30, () => C.cyan);
  paintPlaneX(s, 0.82, 0.2, 0.78, 5, 30, (y, z) => {
    for (const cz of [12, 23]) {
      const d = Math.hypot((y - 0.49) * 16, z - cz);
      if (d > 3.2 && d < 4.4) return C.cyan;
      if (d < 1.2) return C.metal;
    }
    return '#161a24';
  });
  return s;
}

function leaves(s, seed, count, spread, baseZ, height, size) {
  const r = rng(seed);
  const items = Array.from({ length: count }, () => ({
    fx: 0.5 + (r() - 0.5) * spread,
    fy: 0.5 + (r() - 0.5) * spread,
    z: baseZ + r() * height,
    color: [C.plantDark, C.plant, C.plant, C.plantLight][Math.floor(r() * 4)],
    rx: size * (0.8 + r() * 0.5),
  }));
  items.sort((a, b) => a.fx + a.fy - (b.fx + b.fy));
  for (const leaf of items) {
    const [x, y] = s.P(leaf.fx, leaf.fy, leaf.z);
    s.canvas.ellipse(x, y, leaf.rx, leaf.rx * 0.6, leaf.color);
    s.canvas.set(x - 1, y - 1, shade(leaf.color, 1.25));
  }
}

export function plantTall() {
  const s = isoSprite(1, 1, 58);
  box(s, 0.25, 0.25, 0.75, 0.75, 0, 13, C.pot);
  paintPlaneZ(s, 13, 0.3, 0.7, 0.3, 0.7, () => '#2a201c');
  const a = s.P(0.5, 0.5, 13);
  s.canvas.line(a[0], a[1], a[0] + 1, a[1] - 26, C.plantDark);
  leaves(s, 21, 22, 0.9, 18, 34, 4.2);
  return s;
}

export function plantBushy() {
  const s = isoSprite(1, 1, 42);
  box(s, 0.2, 0.2, 0.8, 0.8, 0, 11, '#c9c4ba');
  paintPlaneZ(s, 11, 0.25, 0.75, 0.25, 0.75, () => '#2a201c');
  leaves(s, 33, 26, 1.0, 11, 20, 3.4);
  return s;
}

export function workbench() {
  const s = isoSprite(3, 2, 40);
  for (const [x, y] of [[0.08, 0.08], [2.78, 0.08], [0.08, 1.78], [2.78, 1.78]]) {
    box(s, x, y, x + 0.14, y + 0.14, 0, 22, C.metalDark, { edges: false });
  }
  box(s, 0.1, 0.1, 2.9, 1.9, 5, 7, C.metalDark);
  box(s, 0.4, 0.6, 1.3, 1.5, 7, 13, '#b4564a');
  box(s, 0.4, 0.6, 1.3, 1.5, 13, 14, shade('#b4564a', 0.8));
  box(s, 1.7, 0.4, 2.5, 1.6, 7, 12, '#c9a35f');
  box(s, 0, 0, 3, 2, 22, 25, '#454b5b');
  const l0 = s.P(0.1, 2, 23);
  const l1 = s.P(2.9, 2, 23);
  s.canvas.line(l0[0], l0[1], l1[0], l1[1], C.cyanDim);
  // Cutting mat.
  paintPlaneZ(s, 25, 0.75, 2.15, 0.45, 1.8, (x, y) =>
    Math.abs((x * 4) % 1) < 0.1 || Math.abs((y * 4) % 1) < 0.1 ? '#3a6460' : '#2b4a4a',
  );
  // Parts tray.
  box(s, 0.15, 1.3, 0.62, 1.85, 25, 27, C.metalLight);
  for (const [x, y, c] of [[0.3, 1.45, C.red], [0.45, 1.6, C.cyan], [0.3, 1.7, C.warm]]) {
    const p = s.P(x, y, 27);
    s.canvas.set(p[0], p[1], c);
  }
  // Oscilloscope.
  box(s, 2.3, 0.12, 2.9, 0.78, 25, 35, C.metal);
  paintPlaneY(s, 0.78, 2.36, 2.72, 27, 34, (x, z) => {
    const wave = 30.5 + Math.sin((x - 2.36) * 28) * 2.2;
    return Math.abs(z - wave) < 0.8 ? C.cyan : '#0f2422';
  });
  paintPlaneX(s, 2.9, 0.2, 0.7, 27, 33, (y, z) => (Math.round(y * 16) % 3 === 0 && Math.round(z) % 3 === 0 ? C.metalLight : undefined));
  return s;
}

export function terminal() {
  const s = isoSprite(1, 1, 50);
  box(s, 0.2, 0.2, 0.8, 0.8, 0, 3, C.graphite);
  box(s, 0.4, 0.4, 0.6, 0.6, 3, 22, C.metalDark);
  box(s, 0.14, 0.24, 0.86, 0.76, 22, 37, C.graphite);
  paintPlaneY(s, 0.76, 0.2, 0.8, 24, 35, (x, z) => {
    // Envelope glyph.
    const u = (x - 0.2) * 16;
    const v = 35 - z;
    if (u > 1.5 && u < 8.5 && v > 2.5 && v < 8.5) {
      const onEdge = u < 2.5 || u > 7.5 || v < 3.5 || v > 7.5;
      const onFlap = Math.abs(v - 2.5 - (3.5 - Math.abs(u - 5)) * 0.85) < 0.6;
      if (onEdge || onFlap) return C.cyan;
    }
    return C.screen;
  });
  paintPlaneX(s, 0.86, 0.32, 0.68, 25, 34, (y, z) => (Math.round(y * 16) % 2 === 0 && Math.round(z) % 2 === 0 ? C.metal : undefined));
  const base = s.P(0.72, 0.32, 37);
  s.canvas.line(base[0], base[1], base[0], base[1] - 9, C.metalLight);
  return s;
}

/** Glow passes applied after outlines so light does not get outlined. */
export const glows = {
  nightstand: (s) => {
    const p = s.P(0.52, 0.52, 27);
    glow(s.canvas, p[0], p[1], 12, 9, C.warm, 40, 4);
  },
  terminal: (s) => {
    const p = s.P(0.72, 0.32, 47);
    glow(s.canvas, p[0], p[1], 3, 3, C.red, 120, 2);
    s.canvas.set(p[0], p[1], '#ffb3a6');
  },
};
