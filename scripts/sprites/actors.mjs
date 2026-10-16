// Avatar sprite sheet, robot arm animation strip and small effect sprites.
import { PixelCanvas, shade } from './lib/canvas.mjs';
import { C } from './palette.mjs';

export const AVATAR_FRAME = { width: 18, height: 40 };

const AVATAR_PALETTE = {
  o: C.outline,
  h: '#2e211c',
  H: '#4a352b',
  s: '#e3b896',
  S: '#c28f6e',
  b: '#8a6650', // beard shadow
  e: '#1d1a22',
  j: '#2b3044',
  J: '#1f2333',
  k: '#3a4260',
  c: C.blue,
  p: '#2a3350',
  P: '#1d243a',
  f: '#e6e6ea',
  F: '#a3a7b5',
};

// Head and neck (15 rows, 18 columns). Front = 3/4 view facing the viewer, turned to screen right.
const FRONT_HEAD = [
  '......oooooo......',
  '....oohhhhhhoo....',
  '...ohhhHHHhhhho...',
  '..ohhhHHhhhhhhho..',
  '..ohhhhhhhhhhhho..',
  '..ohhhhhhhhhhhho..',
  '..ohhhhhsshhshho..',
  '..ohhsssssssssso..',
  '..ohSssesssesso...',
  '..ohSssesssesso...',
  '..oSsssssssssso...',
  '...oSbssssssbso...',
  '...obbbbsSbbbo....',
  '....obbbbbbbo.....',
  '.....oossSoo......',
];

const BACK_HEAD = [
  '......oooooo......',
  '....oohhhhhhoo....',
  '...ohhhHHHhhhho...',
  '..ohhhHHhhhhhhho..',
  '..ohhhhhhhhhhhho..',
  '..ohhhhhhhhhhhho..',
  '..ohhhhhhhhhhhho..',
  '..ohhhhhhhhhhhho..',
  '..ohhhhhhhhhhhho..',
  '..oShhhhhhhhhhSo..',
  '..oShhhhhhhhhhSo..',
  '...ohhhhhhhhhho...',
  '...oShhhhhhhhSo...',
  '....oSSSSSSSSo....',
  '.....oossSoo......',
];

// Torso with arms hanging to hip level (12 rows). `c` is the zipper, only visible from the front.
const TORSO = [
  '..ooojjjcjjjjooo..',
  '.okkjjjjcjjjjjkko.',
  '.okJjjjjcjjjjjJko.',
  '.okJojjjcjjjjoJko.',
  '.okJojjjcjjjjoJko.',
  '.okJojjjjjjjjoJko.',
  '.okJojjjjjjjjoJko.',
  '.okJoJjjjjjjJoJko.',
  '.oJJoJJJJJJJJoJJo.',
  '.osSopppppppposSo.',
  '.oSSoppppppppoSSo.',
  '..oooppppppppooo..',
];

// Legs and shoes (9 rows). Index 0 = standing, then the walk cycle.
const STAND = [
  '....oppPoopPpo....',
  '....oppPoopPpo....',
  '....oppPoopPpo....',
  '....oppPoopPpo....',
  '....oppPoopPpo....',
  '....oppPoopPpo....',
  '....offfoofffo....',
  '....oFFFooFFFo....',
  '....oooooooooo....',
];
const STRIDE_WIDE = [
  '....oppPoopPpo....',
  '....oppPoopPpo....',
  '...oppPo..opPpo...',
  '...oppPo..opPpo...',
  '..oppPo....opPpo..',
  '..oppPo....opPpo..',
  '.offfo......offfo.',
  '.oFFFo......oFFFo.',
  '.ooooo......ooooo.',
];
const STRIDE_NARROW = [
  '....oppPoopPpo....',
  '....oppPoopPpo....',
  '....oppPoopPpo....',
  '...oppPo..opPpo...',
  '...oppPo..opPpo...',
  '...oppPo..opPpo...',
  '..offfo....offfo..',
  '..oFFFo....oFFFo..',
  '..ooooo....ooooo..',
];
const LEGS = [STAND, STRIDE_WIDE, STAND, STRIDE_NARROW, STAND];

const HEAD_ROWS = 15;
const TORSO_ROWS = TORSO.length;
/** Pixel row of the feet inside a frame (used as the sprite anchor). */
export const AVATAR_FEET_Y = HEAD_ROWS + TORSO_ROWS + STAND.length - 1;

/**
 * Sheet layout: row 0 = facing viewer, row 1 = facing away. Columns: idle, idle-breathe, walk 1..4.
 * Sprites face screen-right; the game mirrors them for left-facing directions.
 */
export function avatarSheet() {
  const { width, height } = AVATAR_FRAME;
  const cols = 6;
  const sheet = new PixelCanvas(width * cols, height * 2);
  const backTorso = TORSO.map((row) => row.replaceAll('c', 'j'));
  [
    [FRONT_HEAD, TORSO],
    [BACK_HEAD, backTorso],
  ].forEach(([head, torso], row) => {
    for (let col = 0; col < cols; col++) {
      const legs = col < 2 ? LEGS[0] : LEGS[col - 1];
      const bob = col === 1 || col === 3 || col === 5 ? 1 : 0;
      const ox = col * width;
      const oy = row * height + (height - 1 - AVATAR_FEET_Y);
      sheet.grid(ox, oy + HEAD_ROWS + TORSO_ROWS, legs, AVATAR_PALETTE);
      sheet.grid(ox, oy + HEAD_ROWS + bob, torso, AVATAR_PALETTE);
      sheet.grid(ox, oy + bob, head, AVATAR_PALETTE);
    }
  });
  return sheet;
}

export const ARM_FRAME = { width: 44, height: 46, frames: 8, anchor: [16, 42] };

/** Robot arm frames: shoulder and elbow sweep, gripper opening and closing. */
export function robotArmStrip() {
  const { width, height, frames, anchor } = ARM_FRAME;
  const strip = new PixelCanvas(width * frames, height);
  const white = '#d9dce4';
  const dark = '#3a3f4d';
  for (let f = 0; f < frames; f++) {
    const t = f / (frames - 1);
    const frame = new PixelCanvas(width, height);
    const [bx, by] = anchor;
    // Base: iso disc and turret.
    frame.ellipse(bx, by, 8, 4, dark);
    frame.ellipse(bx, by - 1, 7, 3.5, C.metal);
    frame.rect(bx - 4, by - 8, 9, 7, dark);
    frame.rect(bx - 3, by - 8, 7, 6, C.metal);
    frame.ellipse(bx, by - 8, 4.5, 2.2, C.metalLight);
    const shoulder = [bx, by - 11];
    const a1 = (-112 + t * 42) * (Math.PI / 180);
    const elbow = [shoulder[0] + Math.cos(a1) * 15, shoulder[1] + Math.sin(a1) * 15];
    const a2 = a1 + (95 - t * 55) * (Math.PI / 180);
    const wrist = [elbow[0] + Math.cos(a2) * 13, elbow[1] + Math.sin(a2) * 13];
    const a3 = a2 + 0.6;
    const tip = [wrist[0] + Math.cos(a3) * 4, wrist[1] + Math.sin(a3) * 4];
    frame.thickLine(shoulder[0], shoulder[1], elbow[0], elbow[1], 4, white);
    frame.thickLine(elbow[0], elbow[1], wrist[0], wrist[1], 3, white);
    frame.thickLine(wrist[0], wrist[1], tip[0], tip[1], 2, C.metalLight);
    // Gripper fingers.
    const open = 1.5 + Math.sin(t * Math.PI) * 1.5;
    const nx = -Math.sin(a3);
    const ny = Math.cos(a3);
    for (const side of [-1, 1]) {
      const fx = tip[0] + nx * open * side;
      const fy = tip[1] + ny * open * side;
      frame.line(fx, fy, fx + Math.cos(a3) * 3, fy + Math.sin(a3) * 3, dark);
    }
    for (const [x, y, r] of [[...shoulder, 2.6], [...elbow, 2.2], [...wrist, 1.6]]) {
      frame.ellipse(x, y, r, r, dark);
      frame.set(x, y, C.cyan);
    }
    // Shading on the upper edges.
    for (let y = 1; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const c = frame.get(x, y);
        if (c[3] && c[0] === 217 && frame.get(x, y - 1)[3] === 0) frame.set(x, y, '#f4f6fb');
        if (c[3] && c[0] === 217 && frame.get(x, y + 1)[3] === 0) frame.set(x, y, shade(white, 0.78));
      }
    }
    frame.outline(C.outline);
    strip.blit(frame, f * width, 0);
  }
  return strip;
}

/** Bobbing indicator shown above interactive objects. */
export function markerSprite() {
  const c = new PixelCanvas(9, 9);
  c.grid(0, 0, [
    '.ooooooo.',
    'occccccco',
    'oCcccccCo',
    '.oCcccCo.',
    '..oCccO..',
    '...oCo...',
    '....o....',
    '.........',
    '.........',
  ], { o: C.outline, c: C.cyan, C: '#2fa9b8', O: C.outline });
  return c;
}

/** Iso diamond outline used for the hover and destination tile cursors. */
export function tileCursor(color) {
  const c = new PixelCanvas(32, 16);
  for (let x = 0; x < 16; x++) {
    const y = Math.floor(x / 2);
    c.set(15 - x, y + 8, color);
    c.set(16 + x, y + 8, color);
    c.set(15 - x, 7 - y, color);
    c.set(16 + x, 7 - y, color);
  }
  return c;
}

export function shadowSprite() {
  const c = new PixelCanvas(18, 8);
  c.ellipse(9, 4, 8, 3.5, [8, 8, 14, 90]);
  c.ellipse(9, 4, 5, 2.2, [8, 8, 14, 50]);
  return c;
}
