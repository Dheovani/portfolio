import { Container, Sprite } from 'pixi.js';
import type { RoomTextures } from '../assets/textures';
import { tileToWorld } from '../world/iso';
import type { AvatarMotion } from './AvatarMotion';

const WALK_FPS = 9;
const IDLE_PERIOD = 0.7;

/** Pixi representation of the avatar: shadow plus an animated, mirrorable body sprite. */
export class AvatarView {
  readonly container = new Container();
  private readonly body: Sprite;
  private readonly frames: RoomTextures['avatar'];
  private clock = 0;

  constructor(textures: RoomTextures) {
    this.frames = textures.avatar;
    const shadow = new Sprite(textures.fx.shadow);
    shadow.anchor.set(0.5);
    this.body = new Sprite(this.frames[0]![0]);
    const [ax, ay] = textures.avatarAnchor;
    this.body.anchor.set(ax / this.body.texture.width, ay / this.body.texture.height);
    this.container.addChild(shadow, this.body);
  }

  sync(motion: AvatarMotion, dt: number): void {
    this.clock += dt;
    const p = tileToWorld(motion.pos.x, motion.pos.y);
    this.container.position.set(Math.round(p.x), Math.round(p.y));
    const row = this.frames[motion.facing.front ? 0 : 1]!;
    const column = motion.isMoving
      ? 2 + (Math.floor(this.clock * WALK_FPS) % 4)
      : Math.floor(this.clock / IDLE_PERIOD) % 2;
    this.body.texture = row[column]!;
    this.body.scale.x = motion.facing.right ? 1 : -1;
  }
}
