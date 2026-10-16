// Generates the placeholder pixel-art sprites into src/game/assets/generated.
// Usage: npm run sprites [-- --preview <file.png>]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PixelCanvas } from './lib/canvas.mjs';
import { drawRoom } from './room.mjs';
import * as furniture from './furniture.mjs';
import { C } from './palette.mjs';
import {
  AVATAR_FRAME,
  ARM_FRAME,
  avatarSheet,
  robotArmStrip,
  markerSprite,
  tileCursor,
  shadowSprite,
} from './actors.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = join(root, 'src/game/assets/generated');
const config = JSON.parse(readFileSync(join(root, 'src/game/world/room.config.json'), 'utf8'));
const placements = JSON.parse(readFileSync(join(root, 'src/game/world/furniture.json'), 'utf8'));

mkdirSync(outDir, { recursive: true });
const manifest = { room: null, roomDay: null, furniture: {}, avatar: null, arm: null, fx: {} };
const write = (name, canvas) => writeFileSync(join(outDir, `${name}.png`), canvas.toPNG());

const room = drawRoom(config);
write('room', room.canvas);
manifest.room = { file: 'room.png', anchor: room.anchor, width: room.canvas.width, height: room.canvas.height };
const roomDay = drawRoom(config, 'day');
write('room-day', roomDay.canvas);
manifest.roomDay = { file: 'room-day.png' };

const builders = {
  bed: furniture.bed,
  nightstand: furniture.nightstand,
  bookshelf: furniture.bookshelf,
  desk: furniture.desk,
  chair: furniture.chair,
  pcTower: furniture.pcTower,
  plantTall: furniture.plantTall,
  plantBushy: furniture.plantBushy,
  workbench: furniture.workbench,
  mailbox: furniture.mailbox,
};
const built = {};
for (const [name, build] of Object.entries(builders)) {
  const sprite = build();
  sprite.canvas.outline(C.outline);
  furniture.glows[name]?.(sprite);
  write(name, sprite.canvas);
  built[name] = sprite;
  manifest.furniture[name] = { file: `${name}.png`, anchor: sprite.anchor, footprint: sprite.footprint };
}

for (const p of placements) {
  const fp = manifest.furniture[p.sprite]?.footprint;
  if (!fp || fp[0] !== p.w || fp[1] !== p.h) {
    throw new Error(`Footprint mismatch for ${p.id}: layout ${p.w}x${p.h}, sprite ${fp}`);
  }
}

const avatar = avatarSheet();
write('avatar', avatar);
manifest.avatar = { file: 'avatar.png', ...AVATAR_FRAME, columns: 6, rows: 2, anchor: [9, AVATAR_FRAME.height - 1] };

const arm = robotArmStrip();
write('robot-arm', arm);
manifest.arm = { file: 'robot-arm.png', ...ARM_FRAME };

const fx = {
  marker: markerSprite(),
  'tile-hover': tileCursor([230, 236, 255, 120]),
  'tile-target': tileCursor(C.cyan),
  shadow: shadowSprite(),
};
for (const [name, canvas] of Object.entries(fx)) {
  write(name, canvas);
  manifest.fx[name] = { file: `${name}.png`, width: canvas.width, height: canvas.height };
}

writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Sprites written to ${outDir}`);

const previewIndex = process.argv.indexOf('--preview');
if (previewIndex > -1) writePreview(process.argv[previewIndex + 1]);

function writePreview(file) {
  const pad = 10;
  const scene = new PixelCanvas(room.canvas.width + pad * 2, room.canvas.height + pad * 2);
  scene.rect(0, 0, scene.width, scene.height, '#0b0c12');
  const ox = pad + room.anchor[0];
  const oy = pad + room.anchor[1];
  scene.blit((process.argv.includes('--day') ? roomDay : room).canvas, pad, pad);
  const iso = (x, y) => [ox + (x - y) * 16, oy + (x + y) * 8];
  const avatarAt = { x: 6, y: 9, w: 1, h: 1 };
  const items = [...placements.map((p) => ({ ...p })), { id: 'avatar', ...avatarAt }];
  items.sort((a, b) => a.x + a.w + a.y + a.h - (b.x + b.w + b.y + b.h));
  for (const item of items) {
    if (item.id === 'avatar') {
      const [x, y] = iso(item.x + 0.5, item.y + 0.5);
      const frame = new PixelCanvas(AVATAR_FRAME.width, AVATAR_FRAME.height);
      frame.blit(cropped(avatar, 0, 0, AVATAR_FRAME.width, AVATAR_FRAME.height), 0, 0);
      scene.blit(shadowSprite(), x - 9, y - 4);
      scene.blit(frame, x - 9, y - (AVATAR_FRAME.height - 1));
      continue;
    }
    const s = built[item.sprite];
    const [x, y] = iso(item.x, item.y);
    scene.blit(s.canvas, x - s.anchor[0], y - s.anchor[1]);
    if (item.id === 'workbench') {
      const [bx, by] = iso(item.x + 1.4, item.y + 1.0);
      scene.blit(cropped(arm, ARM_FRAME.width * 3, 0, ARM_FRAME.width, ARM_FRAME.height), bx - ARM_FRAME.anchor[0], by - 25 - ARM_FRAME.anchor[1]);
    }
  }
  writeFileSync(file, scene.scaled(3).toPNG());
  console.log(`Preview written to ${file}`);
}

function cropped(src, sx, sy, w, h) {
  const out = new PixelCanvas(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out.set(x, y, src.get(sx + x, sy + y));
  return out;
}
