import config from './room.config.json';

export const ROOM = config;
export const HALF_W = config.tileWidth / 2;
export const HALF_H = config.tileHeight / 2;

export interface Point {
  x: number;
  y: number;
}

/** Integer grid coordinate. */
export interface Tile {
  x: number;
  y: number;
}

/** Projects floor coordinates (tiles) and height (px) to world pixels relative to the room's back corner. */
export function tileToWorld(x: number, y: number, z = 0): Point {
  return { x: (x - y) * HALF_W, y: (x + y) * HALF_H - z };
}

/** Inverse of tileToWorld at floor level; returns fractional tile coordinates. */
export function worldToTile(p: Point): Point {
  const a = p.x / HALF_W;
  const b = p.y / HALF_H;
  return { x: (a + b) / 2, y: (b - a) / 2 };
}

export function sameTile(a: Tile, b: Tile): boolean {
  return a.x === b.x && a.y === b.y;
}
