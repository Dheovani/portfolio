import type { Tile } from '../world/iso';
import type { FurniturePlacement } from '../world/layout';

/** Walkability grid of the room floor. */
export class NavGrid {
  private readonly blocked: Uint8Array;
  readonly cols: number;
  readonly rows: number;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.blocked = new Uint8Array(cols * rows);
  }

  static fromFurniture(cols: number, rows: number, furniture: readonly FurniturePlacement[]): NavGrid {
    const grid = new NavGrid(cols, rows);
    for (const f of furniture) {
      if (f.wall) continue;
      for (let y = f.y; y < f.y + f.h; y++) for (let x = f.x; x < f.x + f.w; x++) grid.block({ x, y });
    }
    return grid;
  }

  inBounds(t: Tile): boolean {
    return t.x >= 0 && t.y >= 0 && t.x < this.cols && t.y < this.rows;
  }

  block(t: Tile): void {
    if (this.inBounds(t)) this.blocked[t.y * this.cols + t.x] = 1;
  }

  isWalkable(t: Tile): boolean {
    return this.inBounds(t) && this.blocked[t.y * this.cols + t.x] === 0;
  }

  /** A step is valid when the target is free and a diagonal does not cut a corner. */
  canStep(from: Tile, dx: number, dy: number): boolean {
    if (!this.isWalkable({ x: from.x + dx, y: from.y + dy })) return false;
    if (dx !== 0 && dy !== 0) {
      return this.isWalkable({ x: from.x + dx, y: from.y }) && this.isWalkable({ x: from.x, y: from.y + dy });
    }
    return true;
  }

  /** Closest walkable tile to `target` (breadth-first), or null when there is none. */
  nearestWalkable(target: Tile): Tile | null {
    const seen = new Set<number>();
    const queue: Tile[] = [target];
    while (queue.length) {
      const t = queue.shift()!;
      if (!this.inBounds(t)) continue;
      const key = t.y * this.cols + t.x;
      if (seen.has(key)) continue;
      seen.add(key);
      if (this.isWalkable(t)) return t;
      queue.push({ x: t.x + 1, y: t.y }, { x: t.x - 1, y: t.y }, { x: t.x, y: t.y + 1 }, { x: t.x, y: t.y - 1 });
    }
    return null;
  }
}
