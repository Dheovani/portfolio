import type { Tile } from '../world/iso';
import type { NavGrid } from './grid';

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const;

function octile(a: Tile, b: Tile): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
}

/**
 * A* on an 8-connected grid without corner cutting, towards the nearest of one or more goals.
 * Returns the steps after `start` (empty when already on a goal) or null when unreachable.
 */
export function findPath(grid: NavGrid, start: Tile, goals: Tile | readonly Tile[]): Tile[] | null {
  const targets = (Array.isArray(goals) ? goals : [goals]).filter((g: Tile) => grid.isWalkable(g));
  if (!targets.length || !grid.isWalkable(start)) return null;
  const id = (t: Tile) => t.y * grid.cols + t.x;
  const goalIds = new Set(targets.map(id));
  const h = (t: Tile) => Math.min(...targets.map((g: Tile) => octile(t, g)));

  const cost = new Map<number, number>([[id(start), 0]]);
  const parent = new Map<number, Tile>();
  const open: { tile: Tile; f: number }[] = [{ tile: start, f: h(start) }];
  const closed = new Set<number>();

  // The room is small (< 200 tiles), so a linear scan of the open list is enough.
  while (open.length) {
    let best = 0;
    for (let i = 1; i < open.length; i++) if (open[i]!.f < open[best]!.f) best = i;
    const { tile } = open.splice(best, 1)[0]!;
    const tid = id(tile);
    if (closed.has(tid)) continue;
    if (goalIds.has(tid)) return rebuild(parent, tile, start, id);
    closed.add(tid);
    for (const [dx, dy] of DIRS) {
      if (!grid.canStep(tile, dx, dy)) continue;
      const next = { x: tile.x + dx, y: tile.y + dy };
      const nid = id(next);
      if (closed.has(nid)) continue;
      const g = cost.get(tid)! + (dx && dy ? Math.SQRT2 : 1);
      if (g < (cost.get(nid) ?? Infinity)) {
        cost.set(nid, g);
        parent.set(nid, tile);
        open.push({ tile: next, f: g + h(next) });
      }
    }
  }
  return null;
}

function rebuild(parent: Map<number, Tile>, end: Tile, start: Tile, id: (t: Tile) => number): Tile[] {
  const path: Tile[] = [];
  let cur: Tile | undefined = end;
  while (cur && id(cur) !== id(start)) {
    path.unshift(cur);
    cur = parent.get(id(cur));
  }
  return path;
}
