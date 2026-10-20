import { describe, expect, it } from 'vitest';
import { AvatarMotion } from './actors/AvatarMotion';
import { interactableFrom, pickInteractable, planApproach, markerAnchor } from './interaction/targets';
import { findPath } from './nav/astar';
import { NavGrid } from './nav/grid';
import { depthOrder, isInFront } from './world/depth';
import { ROOM, tileToWorld, worldToTile } from './world/iso';
import { FURNITURE, INTERACTABLES, SECTION_IDS, SPAWN_TILE, furnitureById } from './world/layout';

const roomGrid = () => NavGrid.fromFurniture(ROOM.cols, ROOM.rows, FURNITURE);

describe('iso projection', () => {
  it('round-trips floor coordinates', () => {
    const p = tileToWorld(3.25, 7.5);
    const back = worldToTile(p);
    expect(back.x).toBeCloseTo(3.25);
    expect(back.y).toBeCloseTo(7.5);
  });
});

describe('A* pathfinding', () => {
  it('finds a straight path on an empty grid', () => {
    const grid = new NavGrid(5, 5);
    expect(findPath(grid, { x: 0, y: 0 }, { x: 3, y: 0 })).toEqual([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ]);
  });

  it('goes around obstacles and never cuts corners', () => {
    const grid = new NavGrid(5, 5);
    for (let y = 0; y < 4; y++) grid.block({ x: 2, y });
    const path = findPath(grid, { x: 0, y: 0 }, { x: 4, y: 0 })!;
    expect(path.at(-1)).toEqual({ x: 4, y: 0 });
    let prev = { x: 0, y: 0 };
    for (const step of path) {
      expect(grid.isWalkable(step)).toBe(true);
      expect(grid.canStep(prev, step.x - prev.x, step.y - prev.y)).toBe(true);
      prev = step;
    }
  });

  it('returns null when the goal is unreachable', () => {
    const grid = new NavGrid(3, 3);
    grid.block({ x: 1, y: 0 });
    grid.block({ x: 1, y: 1 });
    grid.block({ x: 1, y: 2 });
    expect(findPath(grid, { x: 0, y: 0 }, { x: 2, y: 2 })).toBeNull();
  });

  it('picks the nearest of several goals', () => {
    const grid = new NavGrid(10, 1);
    expect(findPath(grid, { x: 5, y: 0 }, [{ x: 0, y: 0 }, { x: 7, y: 0 }])?.at(-1)).toEqual({ x: 7, y: 0 });
  });
});

describe('room layout', () => {
  it('has one object per section and a free spawn tile', () => {
    expect(INTERACTABLES.map((i) => i.section).sort()).toEqual([...SECTION_IDS].sort());
    expect(roomGrid().isWalkable(SPAWN_TILE)).toBe(true);
  });

  it('keeps furniture inside the room without overlaps', () => {
    const grid = new NavGrid(ROOM.cols, ROOM.rows);
    for (const f of FURNITURE.filter((item) => !item.wall)) {
      for (let y = f.y; y < f.y + f.h; y++) {
        for (let x = f.x; x < f.x + f.w; x++) {
          expect(grid.isWalkable({ x, y }), `${f.id} at ${x},${y}`).toBe(true);
          grid.block({ x, y });
        }
      }
    }
  });

  it('can reach every object from the spawn tile', () => {
    const grid = roomGrid();
    for (const item of INTERACTABLES) {
      expect(planApproach(grid, SPAWN_TILE, item), item.section).not.toBeNull();
      for (const tile of item.approach) expect(grid.isWalkable(tile), `${item.section} approach`).toBe(true);
    }
  });

  it('identifies objects by pointer position and approach tile', () => {
    for (const item of INTERACTABLES) {
      const f = furnitureById(item.objectId);
      const centre = tileToWorld(f.x + f.w / 2, f.y + f.h / 2, item.height / 2);
      expect(pickInteractable(centre)?.section).toBe(item.section);
      expect(interactableFrom(item.approach[0]!)?.section).toBe(item.section);
      expect(markerAnchor(item).y).toBeLessThan(centre.y);
    }
    expect(pickInteractable(tileToWorld(6.5, 10.5))).toBeNull();
  });
});

describe('depth ordering', () => {
  it('draws an avatar in front of a long object it stands beside', () => {
    const shelf = { x: 0, y: 8, w: 1, h: 2 };
    const avatar = { x: 1.5, y: 8.5, w: 0, h: 0 };
    expect(isInFront(avatar, shelf)).toBe(true);
    expect(depthOrder([avatar, shelf])).toEqual([shelf, avatar]);
  });

  it('draws an avatar behind an object between it and the viewer', () => {
    const bench = { x: 5, y: 5, w: 3, h: 2 };
    const avatar = { x: 6.5, y: 4.5, w: 0, h: 0 };
    expect(depthOrder([bench, avatar])).toEqual([avatar, bench]);
  });
});

describe('avatar motion', () => {
  it('walks a path at constant speed and reports arrival once', () => {
    const motion = new AvatarMotion({ x: 0, y: 0 }, 2);
    motion.follow([
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ]);
    expect(motion.isMoving).toBe(true);
    expect(motion.update(0.5)).toBe(false);
    expect(motion.tile).toEqual({ x: 1, y: 0 });
    expect(motion.update(0.5)).toBe(true);
    expect(motion.pos).toEqual({ x: 2.5, y: 0.5 });
    expect(motion.update(0.5)).toBe(false);
    expect(motion.facing).toEqual({ front: true, right: true });
  });

  it('can be retargeted mid-step from its commit tile', () => {
    const motion = new AvatarMotion({ x: 0, y: 0 }, 2);
    motion.follow([{ x: 1, y: 0 }, { x: 2, y: 0 }]);
    motion.update(0.25);
    expect(motion.commitTile).toEqual({ x: 1, y: 0 });
    motion.follow([{ x: 1, y: 1 }]);
    while (motion.isMoving) motion.update(0.1);
    expect(motion.tile).toEqual({ x: 1, y: 1 });
  });
});
