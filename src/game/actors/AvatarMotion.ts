import type { Point, Tile } from '../world/iso';

export interface Facing {
  /** Facing the viewer (true) or the back walls (false). */
  front: boolean;
  /** Facing screen-right (true) or screen-left (false). */
  right: boolean;
}

/** Grid movement of the avatar: follows a tile path at constant speed, independent of rendering. */
export class AvatarMotion {
  /** Last tile reached. */
  tile: Tile;
  /** Current position in tile units (a tile centre is tile + 0.5). */
  pos: Point;
  facing: Facing = { front: true, right: true };
  speed: number;
  private step: Tile | null = null;
  private path: Tile[] = [];

  constructor(start: Tile, speed = 3.2) {
    this.tile = { ...start };
    this.pos = { x: start.x + 0.5, y: start.y + 0.5 };
    this.speed = speed;
  }

  get isMoving(): boolean {
    return this.step !== null;
  }

  /** Tile a new route must start from: the current step's target while moving. */
  get commitTile(): Tile {
    return this.step ?? this.tile;
  }

  /** Replaces the remaining route; `path` must start next to `commitTile`. */
  follow(path: Tile[]): void {
    this.path = [...path];
    if (!this.step) this.advance();
  }

  /** Places the avatar instantly (used with reduced motion). */
  teleport(tile: Tile): void {
    this.path = [];
    this.step = null;
    this.tile = { ...tile };
    this.pos = { x: tile.x + 0.5, y: tile.y + 0.5 };
  }

  /** Turns towards a floor point in tile units. */
  faceTowards(target: Point): void {
    this.setFacing(target.x - this.pos.x, target.y - this.pos.y);
  }

  /** Advances the motion; returns true on the frame the route is completed. */
  update(dtSeconds: number): boolean {
    let budget = this.speed * dtSeconds;
    while (this.step && budget > 0) {
      const tx = this.step.x + 0.5;
      const ty = this.step.y + 0.5;
      const dx = tx - this.pos.x;
      const dy = ty - this.pos.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= budget) {
        this.pos = { x: tx, y: ty };
        this.tile = this.step;
        budget -= dist;
        this.advance();
        if (!this.step) return true;
      } else {
        this.pos = { x: this.pos.x + (dx / dist) * budget, y: this.pos.y + (dy / dist) * budget };
        budget = 0;
      }
    }
    return false;
  }

  private advance(): void {
    this.step = this.path.shift() ?? null;
    if (this.step) this.setFacing(this.step.x - this.tile.x, this.step.y - this.tile.y);
  }

  private setFacing(dx: number, dy: number): void {
    const screenX = dx - dy;
    const screenY = dx + dy;
    if (Math.abs(screenY) > 1e-6) this.facing.front = screenY > 0;
    if (Math.abs(screenX) > 1e-6) this.facing.right = screenX > 0;
  }
}
