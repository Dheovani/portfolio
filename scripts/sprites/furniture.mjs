// Furniture sprites. Each returns an iso sprite whose anchor is the back corner of its footprint.
import { PixelCanvas, shade, rng } from './lib/canvas.mjs';
import { isoSprite, box, HALF_W, paintPlaneX, paintPlaneY, paintPlaneZ, glow, material } from './lib/iso.mjs';
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

/**
 * Gallery of framed diplomas hung on the left wall (plane x = 0), one per education entry.
 * Each frame: dark border, cream paper, a few text lines and a seal in the institution's colour.
 */
export function diplomaWall() {
  const s = isoSprite(1, 3, 68);
  const frame = '#2b211d';
  const paper = '#ece5d4';
  const ink = '#9a907e';
  // [y0, y1, z0, z1, seal colour] — top row of three, bottom row of two.
  const frames = [
    [0.18, 0.92, 47, 62, '#8c2a5c'],
    [1.12, 1.88, 48, 64, '#2f5fa8'],
    [2.08, 2.82, 47, 62, '#2f5fa8'],
    [0.62, 1.42, 29, 43, '#3f7d4e'],
    [1.62, 2.38, 30, 42, '#2b6cb0'],
  ];
  for (const [y0, y1, z0, z1, seal] of frames) {
    const w = (y1 - y0) * HALF_W;
    const h = z1 - z0;
    // Soft shadow on the wall, one pixel down.
    paintPlaneX(s, 0, y0 + 0.04, y1 + 0.04, z0 - 1.5, z1 - 1.5, () => [10, 10, 16, 70]);
    paintPlaneX(s, 0, y0, y1, z0, z1, (y, z) => {
      const u = (y1 - y) * HALF_W; // left to right as seen on the wall
      const v = z1 - z; // top to bottom
      if (u < 1.2 || u > w - 1.2 || v < 1.2 || v > h - 1.2) return frame;
      if (u < 2.2 || u > w - 2.2 || v < 2.2 || v > h - 2.2) return shade(paper, 0.88);
      if (Math.hypot(u - (w - 4.2), v - (h - 4.2)) < 1.8) return seal;
      if (Math.abs(v - 3.6) < 0.5 && u > w * 0.25 && u < w * 0.75) return seal;
      if ([6, 8, 10].some((row) => Math.abs(v - row) < 0.45) && u > 3.5 && u < w - 3.5 && v < h - 6) return ink;
      return paper;
    });
  }
  return s;
}

/** Round pet bed centred on (cx, cy) in screen pixels. */
function petBed(canvas, cx, cy, color) {
  canvas.ellipse(cx, cy + 1, 10.5, 5.2, shade(color, 0.5));
  canvas.ellipse(cx, cy - 1, 10.5, 5.2, shade(color, 0.75));
  canvas.ellipse(cx, cy - 3, 10, 4.9, color);
  canvas.ellipse(cx, cy - 3, 7.5, 3.5, shade(color, 0.7));
  canvas.ellipse(cx, cy - 2.6, 7, 3.1, shade(color, 1.12));
}

const PET_COLORS = {
  o: C.outline,
  // Cat: orange tabby with white chest and paws.
  O: '#d9853c',
  L: '#eda25a',
  D: '#b8692b',
  W: '#f4efe6',
  p: '#e39a9a',
  // Pinscher: black and tan.
  B: '#24201e',
  b: '#3d3532',
  T: '#b8773a',
  n: '#4a3a34',
  k: '#3a2c26',
};

// Curled up asleep, head on the right.
const CAT = [
  '..........o..o..',
  '...ooooo.oOooOo.',
  '..oOLOLOooOOOOOo',
  '.oOOLOLOOoOkOkOo',
  '.oOOOOOOOOOOWWWo',
  '.oWWOOOOOOOWWpWo',
  '..oWWWWWWWWWWWo.',
  '...oDDDDDDDooo..',
  '....ooooooo.....',
];

const PINSCHER = [
  '..........o...o.',
  '...oooooooBo.oBo',
  '..oBbbBBBBoBooBo',
  '.oBbBBBBBBBTBBTo',
  '.oBBBBBBBBBBTBBo',
  '.oBBBBBBBBBTTTno',
  '..oBBBBBBBBoTTo.',
  '...oTToTTooo....',
  '....oo.oo.......',
];

function petSprite(rows) {
  const c = new PixelCanvas(rows[0].length, rows.length);
  c.grid(0, 0, rows, PET_COLORS);
  return c;
}

/** The author's cat and pinscher asleep in their beds under the diploma wall. */
export function petBeds() {
  const s = isoSprite(1, 3, 20);
  const pinscher = s.P(0.55, 0.75, 0);
  petBed(s.canvas, pinscher[0], pinscher[1], '#c2b49a');
  s.canvas.blit(petSprite(PINSCHER), pinscher[0] - 8, pinscher[1] - 11);

  const cat = s.P(0.55, 2.25, 0);
  petBed(s.canvas, cat[0], cat[1], '#9e3040');
  s.canvas.blit(petSprite(CAT), cat[0] - 8, cat[1] - 11);
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

/** Single-colour fan ring (radius r) around (cu, cv) in face-local pixels, or undefined outside it. */
function fanRing(u, v, cu, cv, r, color) {
  const d = Math.hypot(u - cu, v - cv);
  if (d > r - 1 && d < r + 0.3) return color;
  if (d < 0.9) return '#2a2e3a';
  if (d <= r - 1) return '#120f1c';
  return undefined;
}

/** Glass-panel PC case: dark frame, softly lit interior, two fans on the front. */
export function pcTower() {
  const s = isoSprite(1, 1, 28);
  const lilac = '#b48cff';
  const [x0, x1, y0, y1, z0, z1] = [0.24, 0.76, 0.16, 0.84, 1, 24];
  for (const y of [0.2, 0.74]) box(s, x0 + 0.04, y, x1 - 0.04, y + 0.06, 0, 1, C.outline, { edges: false });
  box(s, x0, y0, x1, y1, z0, z1, '#15171f');
  // Glass side facing the room: power-supply cover, graphics card, rear fan.
  paintPlaneY(s, y1, x0 + 0.05, x1 - 0.05, z0 + 1.5, z1 - 1.5, (x, z) => {
    const u = (x - x0) * 16;
    if (z < z0 + 5) return '#0f1017';
    if (z > 11 && z < 12.5 && u > 1.5) return z > 12 ? lilac : C.metal;
    return fanRing(u, z, 4.2, 18, 2.2, lilac) ?? (z > 15 ? '#2a2140' : '#211a33');
  });
  // Front: two fans stacked.
  paintPlaneX(s, x1, y0 + 0.06, y1 - 0.06, z0 + 1.5, z1 - 1.5, (y, z) => {
    const u = (y - y0) * 16;
    return fanRing(u, z, 5.4, 8, 3, lilac) ?? fanRing(u, z, 5.4, 16.5, 3, lilac) ?? '#121420';
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

/** Classic post mailbox: wooden post, rounded metal box, raised red flag and a letter waiting. */
export function mailbox() {
  const s = isoSprite(1, 1, 50);
  const metal = '#4f6f8f';
  box(s, 0.32, 0.32, 0.68, 0.68, 0, 2, C.woodDark);
  box(s, 0.43, 0.43, 0.57, 0.57, 2, 25, C.wood);
  box(s, 0.36, 0.36, 0.64, 0.64, 24, 26, C.woodDark);
  // Body with a rounded lid built from stacked, narrowing slabs.
  box(s, 0.12, 0.32, 0.88, 0.68, 26, 34, metal, { edges: false });
  box(s, 0.12, 0.35, 0.88, 0.65, 34, 36, metal, { edges: false });
  box(s, 0.12, 0.39, 0.88, 0.61, 36, 37.5, metal);
  // Door on the front-right face, with a hinge seam and a small latch.
  paintPlaneX(s, 0.88, 0.32, 0.68, 26, 37.5, (y, z) => {
    const arch = 34 + Math.sqrt(Math.max(0, 1 - ((y - 0.5) / 0.18) ** 2)) * 3.5;
    if (z > arch) return undefined;
    const edge = y < 0.36 || y > 0.64 || z < 27 || z > arch - 1;
    if (edge) return shade(metal, 0.62);
    if (Math.abs(y - 0.5) < 0.04 && Math.abs(z - 31) < 1) return C.metalLight;
    return shade(metal, 0.8);
  });
  // A letter sticking out of the door.
  box(s, 0.88, 0.4, 0.98, 0.6, 32, 33.5, '#ece6d8');
  // Raised flag on the side facing the viewer.
  box(s, 0.62, 0.68, 0.66, 0.72, 29, 45, C.metalDark, { edges: false });
  box(s, 0.38, 0.68, 0.64, 0.72, 41, 45, C.red, { edges: false });
  return s;
}

/** Glow passes applied after outlines so light does not get outlined. */
export const glows = {
  nightstand: (s) => {
    const p = s.P(0.52, 0.52, 27);
    glow(s.canvas, p[0], p[1], 12, 9, C.warm, 40, 4);
  },
};
