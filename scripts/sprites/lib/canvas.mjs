// Minimal RGBA pixel canvas with PNG export. No dependencies: zlib only.
import { deflateSync } from 'node:zlib';

export function hex(color, alpha = 255) {
  if (Array.isArray(color)) return color;
  const n = parseInt(color.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, alpha];
}

/** Multiplies RGB by `factor` (>1 lightens, <1 darkens). */
export function shade(color, factor) {
  const [r, g, b, a] = hex(color);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * factor)));
  return [f(r), f(g), f(b), a];
}

export function mix(a, b, t) {
  const ca = hex(a);
  const cb = hex(b);
  return ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
}

export class PixelCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }

  inside(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  get(x, y) {
    if (!this.inside(x, y)) return [0, 0, 0, 0];
    const i = (y * this.width + x) * 4;
    return [this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]];
  }

  /** Sets a pixel; colors with alpha < 255 are blended over the existing pixel. */
  set(x, y, color) {
    x = Math.round(x);
    y = Math.round(y);
    if (!this.inside(x, y)) return;
    const [r, g, b, a] = hex(color);
    const i = (y * this.width + x) * 4;
    if (a >= 255 || this.data[i + 3] === 0) {
      this.data.set([r, g, b, a], i);
      return;
    }
    const t = a / 255;
    this.data[i] = this.data[i] + (r - this.data[i]) * t;
    this.data[i + 1] = this.data[i + 1] + (g - this.data[i + 1]) * t;
    this.data[i + 2] = this.data[i + 2] + (b - this.data[i + 2]) * t;
    this.data[i + 3] = Math.max(this.data[i + 3], a);
  }

  isOpaque(x, y) {
    return this.get(x, y)[3] > 0;
  }

  rect(x, y, w, h, color) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, color);
  }

  /** Bresenham line. */
  line(x0, y0, x1, y1, color) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, color);
      if (x0 === x1 && y0 === y1) return;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  /** Thick line made of stamped squares. */
  thickLine(x0, y0, x1, y1, size, color) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    const half = Math.floor(size / 2);
    for (let s = 0; s <= steps; s++) {
      const x = Math.round(x0 + ((x1 - x0) * s) / steps);
      const y = Math.round(y0 + ((y1 - y0) * s) / steps);
      this.rect(x - half, y - half, size, size, color);
    }
  }

  /** Fills a polygon sampling pixel centres (even-odd rule). */
  poly(points, color, pattern) {
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const minX = Math.floor(Math.min(...xs));
    const maxX = Math.ceil(Math.max(...xs));
    const minY = Math.floor(Math.min(...ys));
    const maxY = Math.ceil(Math.max(...ys));
    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        if (!pointInPolygon(x + 0.5, y + 0.5, points)) continue;
        this.set(x, y, pattern ? pattern(x, y) ?? color : color);
      }
    }
  }

  ellipse(cx, cy, rx, ry, color) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const nx = (x + 0.5 - cx) / rx;
        const ny = (y + 0.5 - cy) / ry;
        if (nx * nx + ny * ny <= 1) this.set(x, y, color);
      }
    }
  }

  /** Paints a string grid where each character maps to a palette color. */
  grid(x, y, rows, palette, { flip = false } = {}) {
    rows.forEach((row, j) => {
      [...row].forEach((ch, i) => {
        const color = palette[ch];
        if (!color) return;
        const px = flip ? x + row.length - 1 - i : x + i;
        this.set(px, y + j, color);
      });
    });
  }

  /** Draws a 1px outline around every opaque region. */
  outline(color) {
    const marks = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.isOpaque(x, y)) continue;
        if (
          this.isOpaque(x - 1, y) ||
          this.isOpaque(x + 1, y) ||
          this.isOpaque(x, y - 1) ||
          this.isOpaque(x, y + 1)
        ) {
          marks.push([x, y]);
        }
      }
    }
    for (const [x, y] of marks) this.set(x, y, color);
  }

  blit(src, dx, dy) {
    for (let y = 0; y < src.height; y++) {
      for (let x = 0; x < src.width; x++) {
        const c = src.get(x, y);
        if (c[3] > 0) this.set(dx + x, dy + y, c);
      }
    }
  }

  scaled(factor) {
    const out = new PixelCanvas(this.width * factor, this.height * factor);
    for (let y = 0; y < out.height; y++) {
      for (let x = 0; x < out.width; x++) {
        const c = this.get(Math.floor(x / factor), Math.floor(y / factor));
        const i = (y * out.width + x) * 4;
        out.data.set(c, i);
      }
    }
    return out;
  }

  toPNG() {
    const raw = Buffer.alloc((this.width * 4 + 1) * this.height);
    for (let y = 0; y < this.height; y++) {
      const row = y * (this.width * 4 + 1);
      raw[row] = 0;
      Buffer.from(this.data.buffer, y * this.width * 4, this.width * 4).copy(raw, row + 1);
    }
    const header = Buffer.alloc(13);
    header.writeUInt32BE(this.width, 0);
    header.writeUInt32BE(this.height, 4);
    header.set([8, 6, 0, 0, 0], 8);
    return Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk('IHDR', header),
      chunk('IDAT', deflateSync(raw, { level: 9 })),
      chunk('IEND', Buffer.alloc(0)),
    ]);
  }
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** Deterministic pseudo-random generator (mulberry32) so sprites are reproducible. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
