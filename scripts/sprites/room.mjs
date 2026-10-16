// Room shell: floor, two back walls, windows and wall-mounted decoration, baked into one sprite.
import { PixelCanvas, shade, mix } from './lib/canvas.mjs';
import { projector, box, paintPlaneX, paintPlaneY, paintPlaneZ, onPlaneZ, glow, HALF_W, HALF_H } from './lib/iso.mjs';
import { C } from './palette.mjs';

export function hash2(a, b) {
  let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// 3x5 glyphs for the small neon sign.
const GLYPHS = {
  '<': ['..#', '.#.', '#..', '.#.', '..#'],
  '/': ['..#', '..#', '.#.', '#..', '#..'],
  '>': ['#..', '.#.', '..#', '.#.', '#..'],
};

/** Draws the room shell for `time` = 'night' (default art) or 'day'. */
export function drawRoom(config, time = 'night') {
  const day = time === 'day';
  const N = config.cols;
  const H = config.wallHeight;
  const t = config.wallThickness;
  const ft = config.floorThickness;
  const margin = 2;
  const ax = margin + Math.ceil((t + N) * HALF_W);
  const ay = margin + Math.ceil(2 * t * HALF_H + H);
  const width = ax * 2;
  const height = ay + 2 * N * HALF_H + ft + margin;
  const canvas = new PixelCanvas(width, height);
  const P = projector(ax, ay);
  const sprite = { canvas, anchor: [ax, ay], P };

  drawFloor(sprite, N);
  drawRug(sprite);
  drawWalls(sprite, N, H, t, ft);

  // Left wall (x = 0): window, curtains, string lights, a framed print.
  windowOnWall(sprite, 'x', 4.4, 6.6, 28, 62, day);
  curtain(sprite, 'x', 3.95, 4.4, 22, 67);
  curtain(sprite, 'x', 6.6, 7.05, 22, 67);
  framedPrint(sprite, 1.45, 2.55, 34, 50);
  stringLights(sprite, 0.4, 3.9, 66, 7, !day);

  // Right wall (y = 0): window, blueprint, neon sign, floating shelf.
  windowOnWall(sprite, 'y', 1.9, 4.1, 28, 62, day);
  curtain(sprite, 'y', 1.45, 1.9, 22, 67);
  curtain(sprite, 'y', 4.1, 4.55, 22, 67);
  blueprint(sprite, 4.95, 6.05, 34, 60);
  neonSign(sprite, 7.05, 60, day ? 16 : 34);
  wallShelf(sprite, 9.1, 10.7, 48);

  if (day) {
    sunBeams(sprite);
    const monitor = P(7.5, 0.3, 30);
    glow(canvas, monitor[0], monitor[1], 20, 12, C.cyan, 10, 4);
    applyDayGrade(canvas);
    return { canvas, anchor: [ax, ay] };
  }

  // Night light pools baked on the floor and walls.
  moonBeam(sprite);
  const lamp = P(0.5, 3.5, 22);
  glow(canvas, lamp[0], lamp[1], 34, 22, C.warm, 46, 6);
  const lampFloor = P(1.2, 3.6, 0);
  glow(canvas, lampFloor[0], lampFloor[1], 30, 14, C.warm, 26, 5);
  const monitor = P(7.5, 0.3, 30);
  glow(canvas, monitor[0], monitor[1], 30, 18, C.cyan, 22, 5);

  return { canvas, anchor: [ax, ay] };
}

function drawFloor(sprite, N) {
  const plankId = (x, y) => {
    const row = Math.floor(y * 3);
    const offset = hash2(row, 7) * 2;
    const seg = Math.floor((x + offset) / 2.2);
    return [row, seg];
  };
  const inv = onPlaneZ(sprite, 0);
  paintPlaneZ(sprite, 0, 0, N, 0, N, (x, y, sx, sy) => {
    const [row, seg] = plankId(x, y);
    const [rowUp, segUp] = plankId(...inv(sx, sy - 1));
    if (row !== rowUp || seg !== segUp) return C.floorSeam;
    let color = shade(C.floor, 0.9 + hash2(row, seg) * 0.18);
    // Fine grain dither.
    if (hash2(sx * 3, sy * 5) > 0.93) color = shade(color, 0.9);
    // Gentle falloff toward the open front of the room.
    const depth = (x + y) / (2 * N);
    return shade(color, 1.05 - depth * 0.3);
  });
}

function drawRug(sprite) {
  const [x0, x1, y0, y1] = [3.6, 9.4, 3.8, 9.2];
  paintPlaneZ(sprite, 0, x0, x1, y0, y1, (x, y, sx, sy) => {
    const d = Math.min(x - x0, x1 - x, y - y0, y1 - y);
    if (d < 0.22) return hash2(sx, sy) > 0.85 ? shade(C.rugBorder, 0.9) : C.rugBorder;
    if (d < 0.3) return C.rugLine;
    // Quiet diamond motif in the middle.
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const m = Math.abs(x - cx) + Math.abs(y - cy);
    if (Math.abs(m - 1.6) < 0.06 || Math.abs(m - 2.6) < 0.05) return shade(C.rugLine, 0.75);
    return hash2(sx * 7, sy * 3) > 0.9 ? shade(C.rug, 1.1) : C.rug;
  });
}

function wallPattern(base, wainscot, along, z, sx, neighbourAlong, wallTop) {
  if (z < 3) return C.baseboard;
  if (z < 26) {
    if (Math.floor(along * 2) !== Math.floor(neighbourAlong * 2)) return shade(wainscot, 0.8);
    if (z > 23) return shade(wainscot, 1.1);
    return wainscot;
  }
  if (z < 28) return C.trim;
  let color = base;
  // Ambient occlusion near the room corner and the ceiling line.
  if (along < 0.35) color = shade(color, 0.85);
  if (z > wallTop - 4) color = shade(color, 0.9);
  if (hash2(sx * 11, Math.round(z) * 13) > 0.95) color = shade(color, 1.06);
  return color;
}

function drawWalls(sprite, N, H, t, ft) {
  const { canvas, P } = sprite;
  // Left wall (plane x = 0), lit more by the window light.
  paintPlaneX(sprite, 0, 0, N, 0, H, (y, z, sx) => wallPattern(C.wallLeft, C.wainscotLeft, y, z, sx, y - 1 / HALF_W, H));
  // Right wall (plane y = 0).
  paintPlaneY(sprite, 0, 0, N, 0, H, (x, z, sx) => wallPattern(C.wallRight, C.wainscotRight, x, z, sx, x + 1 / HALF_W, H));

  // Wall caps.
  canvas.poly([P(-t, -t, H), P(0, -t, H), P(0, N, H), P(-t, N, H)], C.wallTop);
  canvas.poly([P(0, -t, H), P(N, -t, H), P(N, 0, H), P(0, 0, H)], C.wallTop);
  // Exposed wall ends and floor slab.
  canvas.poly([P(-t, N, H), P(0, N, H), P(0, N, -ft), P(-t, N, -ft)], C.slab);
  canvas.poly([P(N, -t, H), P(N, 0, H), P(N, 0, -ft), P(N, -t, -ft)], C.slabDark);
  canvas.poly([P(0, N, 0), P(N, N, 0), P(N, N, -ft), P(0, N, -ft)], C.slab);
  canvas.poly([P(N, 0, 0), P(N, N, 0), P(N, N, -ft), P(N, 0, -ft)], C.slabDark);
  // Floor edge highlight.
  const a = P(0, N, 0);
  const b = P(N, N, 0);
  const c = P(N, 0, 0);
  canvas.line(a[0], a[1], b[0], b[1], shade(C.floor, 0.8));
  canvas.line(b[0], b[1], c[0] - 1, c[1], shade(C.floor, 0.65));
  // Cap edges.
  const capA = P(0, N, H);
  const capB = P(0, 0, H);
  const capC = P(N, 0, H);
  canvas.line(capA[0], capA[1], capB[0], capB[1], shade(C.wallTop, 1.25));
  canvas.line(capB[0], capB[1], capC[0], capC[1], shade(C.wallTop, 1.25));
}

/** Paints a rectangle on one of the walls. `along` spans the wall axis in tiles, z in px. */
function onWall(sprite, wall, a0, a1, z0, z1, fn) {
  if (wall === 'x') paintPlaneX(sprite, 0, a0, a1, z0, z1, (y, z, sx, sy) => fn((y - a0) * HALF_W, z - z0, sx, sy));
  else paintPlaneY(sprite, 0, a0, a1, z0, z1, (x, z, sx, sy) => fn((x - a0) * HALF_W, z - z0, sx, sy));
}

function windowOnWall(sprite, wall, a0, a1, z0, z1, day = false) {
  const w = (a1 - a0) * HALF_W;
  const h = z1 - z0;
  const frame = shade(C.woodDark, 0.9);
  onWall(sprite, wall, a0, a1, z0, z1, (u, v, sx, sy) => {
    const uu = wall === 'x' ? w - u : u; // keep skyline orientation consistent on both walls
    if (u < 2 || u > w - 2 || v < 2 || v > h - 2) return frame;
    if (Math.abs(u - w / 2) < 0.6 || Math.abs(v - h * 0.58) < 0.6) return shade(frame, 1.2);
    const t = v / h;
    if (day) return daySky(uu, v, h, wall === 'x' ? 40 : 0);
    // Night sky with a hazy horizon.
    let color = mix(C.skyLow, C.skyTop, Math.min(1, t * 1.3));
    if (t > 0.55 && hash2(sx * 17, sy * 31) > 0.985) color = [220, 226, 255, 255];
    // Distant skyline.
    const col = Math.floor(uu / 4) + (wall === 'x' ? 40 : 0);
    const bh = 6 + hash2(col, 3) * 13;
    if (v < bh) {
      color = C.city;
      if (Math.round(uu) % 2 === 0 && Math.round(v) % 3 === 1) {
        const lit = hash2(Math.round(uu) * 5 + col, Math.round(v) * 9);
        if (lit > 0.8) color = lit > 0.95 ? C.cyan : shade(C.warm, 0.85);
      }
    }
    return color;
  });
  // Sill.
  const P = sprite.P;
  if (wall === 'x') box({ canvas: sprite.canvas, P }, 0, a0 - 0.1, 0.22, a1 + 0.1, z0 - 3, z0, C.woodLight);
  else box({ canvas: sprite.canvas, P }, a0 - 0.1, 0, a1 + 0.1, 0.22, z0 - 3, z0, C.woodLight);
}

function curtain(sprite, wall, a0, a1, z0, z1) {
  onWall(sprite, wall, a0, a1, z0, z1, (u, v) => {
    if (v > z1 - z0 - 1.5) return shade(C.metal, 1.1); // rod
    const fold = Math.floor(u / 2) % 2 === 0 ? 1 : 0.8;
    return shade(C.curtain, fold * (v < 2 ? 0.85 : 1));
  });
}

function framedPrint(sprite, a0, a1, z0, z1) {
  const w = (a1 - a0) * HALF_W;
  const h = z1 - z0;
  onWall(sprite, 'x', a0, a1, z0, z1, (u, v) => {
    if (u < 1.5 || u > w - 1.5 || v < 1.5 || v > h - 1.5) return C.woodDark;
    if (u < 3 || u > w - 3 || v < 3 || v > h - 3) return C.pillow;
    // Minimal print: a planet over a horizon line.
    const du = u - w / 2;
    const dv = v - h * 0.58;
    if (du * du + dv * dv < 14) return shade(C.warm, 0.95);
    if (Math.abs(v - h * 0.32) < 0.6) return C.cyanDim;
    return '#22283a';
  });
}

function blueprint(sprite, a0, a1, z0, z1) {
  const w = (a1 - a0) * HALF_W;
  const h = z1 - z0;
  // Simple robot arm schematic, in poster pixels (u right, v up).
  const segs = [
    [w * 0.3, 5, w * 0.7, 5],
    [w * 0.5, 5, w * 0.5, 10],
    [w * 0.5, 10, w * 0.3, 17],
    [w * 0.3, 17, w * 0.62, 21],
    [w * 0.62, 21, w * 0.72, 19],
  ];
  onWall(sprite, 'y', a0, a1, z0, z1, (u, v) => {
    if (u < 1.2 || u > w - 1.2 || v < 1.2 || v > h - 1.2) return shade(C.metalDark, 0.9);
    for (const [x0, y0, x1, y1] of segs) {
      if (distToSegment(u, v, x0, y0, x1, y1) < 0.8) return shade(C.cyan, 0.9);
    }
    if (Math.round(u) % 4 === 0 || Math.round(v) % 4 === 0) return '#20365a';
    return '#1a2b4a';
  });
}

function distToSegment(px, py, x0, y0, x1, y1) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / len));
  return Math.hypot(px - (x0 + t * dx), py - (y0 + t * dy));
}

function neonSign(sprite, a0, z0, glowStrength) {
  const text = '</>';
  const scale = 2;
  const w = text.length * 4 * scale;
  const h = 5 * scale;
  const a1 = a0 + w / HALF_W;
  const { canvas } = sprite;
  const center = sprite.P((a0 + a1) / 2, 0, z0 + h / 2);
  glow(canvas, center[0], center[1], 26, 14, C.cyan, glowStrength, 5);
  onWall(sprite, 'y', a0, a1, z0, z0 + h, (u, v) => {
    const gi = Math.floor(u / (4 * scale));
    const glyph = GLYPHS[text[gi]];
    if (!glyph) return undefined;
    const gx = Math.floor((u - gi * 4 * scale) / scale);
    const gy = 4 - Math.floor(v / scale);
    if (gx < 3 && glyph[gy]?.[gx] === '#') return '#c9fbff';
    return undefined;
  });
}

function wallShelf(sprite, a0, a1, z) {
  const s = sprite;
  box(s, a0, 0, a1, 0.45, z - 2, z, C.woodLight);
  // Books leaning on the shelf.
  const colors = ['#3f5f7a', '#8a4b45', '#c9a35f', '#4d6b52'];
  let x = a0 + 0.1;
  colors.forEach((c, i) => {
    const bw = 0.14;
    box(s, x, 0.05, x + bw, 0.38, z, z + 9 + (i % 2) * 2, c, { edges: false });
    x += bw + 0.02;
  });
  // A tiny robot figure.
  const rx = a1 - 0.55;
  box(s, rx, 0.1, rx + 0.3, 0.35, z, z + 5, C.metalLight);
  box(s, rx + 0.03, 0.12, rx + 0.27, 0.33, z + 5, z + 9, C.metalLight);
  const eye = s.P(rx + 0.2, 0.33, z + 7.5);
  s.canvas.set(eye[0], eye[1], C.cyan);
  s.canvas.set(eye[0] - 3, eye[1] + 1, C.cyan);
}

function stringLights(sprite, a0, a1, z, count, lit = true) {
  const { canvas, P } = sprite;
  let prev = null;
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const along = a0 + (a1 - a0) * t;
    const sag = Math.sin(t * Math.PI * 2) ** 2 * 7;
    const p = P(0, along, z - sag);
    if (prev) canvas.line(prev[0], prev[1], p[0], p[1], '#2a2420');
    prev = p;
  }
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const along = a0 + (a1 - a0) * t;
    const sag = Math.sin(t * Math.PI * 2) ** 2 * 7;
    const [x, y] = P(0, along, z - sag);
    if (!lit) {
      canvas.set(x, y + 1, '#8f7a63');
      canvas.set(x, y + 2, '#d9cbb6');
      continue;
    }
    glow(canvas, x, y + 2, 5, 4, C.warm, 50, 3);
    canvas.set(x, y + 1, C.warmDeep);
    canvas.set(x, y + 2, C.warm);
    canvas.set(x + 1, y + 2, '#fff1d6');
  }
}

function moonBeam(sprite) {
  const { canvas, P } = sprite;
  canvas.poly([P(0, 4.6, 0), P(0, 6.5, 0), P(4.2, 8.3, 0), P(4.2, 6.4, 0)], [190, 205, 255, 16]);
}

/** Daytime window view: clear sky, a few clouds and a hazy skyline (u right, v up, in px). */
function daySky(u, v, h, seed) {
  const t = v / h;
  let color = mix('#cfe6f2', '#6fb3e3', Math.min(1, t * 1.2));
  const clouds = [
    [6 + seed / 8, h * 0.78, 6, 2.2],
    [24 - seed / 10, h * 0.66, 8, 2.6],
  ];
  for (const [cx, cy, rx, ry] of clouds) {
    const dx = (u - cx) / rx;
    const dy = (v - cy) / ry;
    if (dx * dx + dy * dy < 1) color = dy > 0.2 ? '#ffffff' : '#e3eef5';
  }
  const col = Math.floor(u / 4) + seed;
  const bh = 6 + hash2(col, 3) * 13;
  if (v < bh) {
    color = hash2(col, 5) > 0.5 ? '#7d93ad' : '#8aa0b8';
    if (Math.round(u) % 2 === 0 && Math.round(v) % 3 === 1) color = '#a9bdd1';
  }
  return color;
}

function sunBeams(sprite) {
  const { canvas, P } = sprite;
  canvas.poly([P(0, 4.6, 0), P(0, 6.5, 0), P(4.6, 8.6, 0), P(4.6, 6.7, 0)], [255, 238, 200, 34]);
  canvas.poly([P(2.0, 0, 0), P(4.0, 0, 0), P(5.9, 4.4, 0), P(3.9, 4.4, 0)], [255, 238, 200, 24]);
}

/** Lifts the whole shell for daylight: brighter, slightly warmer, shadows kept. */
function applyDayGrade(canvas) {
  const d = canvas.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    d[i] = Math.min(255, d[i] * 1.32 + 10);
    d[i + 1] = Math.min(255, d[i + 1] * 1.3 + 8);
    d[i + 2] = Math.min(255, d[i + 2] * 1.22 + 6);
  }
}
