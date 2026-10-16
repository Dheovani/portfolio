import { findPath } from '../nav/astar';
import type { NavGrid } from '../nav/grid';
import { isInFront } from '../world/depth';
import { tileToWorld, type Point, type Tile } from '../world/iso';
import { furnitureById, INTERACTABLES, type Interactable } from '../world/layout';

/** Screen-space silhouette of an object's bounding box (hexagon), in world pixels. */
export function objectHull(item: Interactable): Point[] {
  const f = furnitureById(item.objectId);
  const z = item.height;
  return [
    tileToWorld(f.x, f.y, z),
    tileToWorld(f.x + f.w, f.y, z),
    tileToWorld(f.x + f.w, f.y, 0),
    tileToWorld(f.x + f.w, f.y + f.h, 0),
    tileToWorld(f.x, f.y + f.h, 0),
    tileToWorld(f.x, f.y + f.h, z),
  ];
}

/** Centre of the object's footprint in tile units. */
export function objectCenter(item: Interactable): Point {
  const f = furnitureById(item.objectId);
  return { x: f.x + f.w / 2, y: f.y + f.h / 2 };
}

/** Point above the object where its marker floats, in world pixels. */
export function markerAnchor(item: Interactable): Point {
  if (item.marker) {
    const f = furnitureById(item.objectId);
    return tileToWorld(f.x + item.marker.x, f.y + item.marker.y, item.marker.z);
  }
  const c = objectCenter(item);
  return tileToWorld(c.x, c.y, item.height + 6);
}

export function pointInPolygon(p: Point, poly: readonly Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]!;
    const b = poly[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/** Front-most interactable whose silhouette contains the world point. */
export function pickInteractable(world: Point): Interactable | null {
  const hits = INTERACTABLES.filter((item) => pointInPolygon(world, objectHull(item)));
  if (!hits.length) return null;
  return hits.reduce((front, item) =>
    isInFront(furnitureById(item.objectId), furnitureById(front.objectId)) ? item : front,
  );
}

/** Interactable that the avatar can use from the given tile, if any. */
export function interactableFrom(tile: Tile): Interactable | null {
  return INTERACTABLES.find((item) => item.approach.some((a) => a.x === tile.x && a.y === tile.y)) ?? null;
}

/** Route to the closest reachable approach tile of an object. */
export function planApproach(grid: NavGrid, from: Tile, item: Interactable): Tile[] | null {
  return findPath(grid, from, item.approach);
}
