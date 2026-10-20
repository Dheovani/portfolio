import { Application, ColorMatrixFilter, Container, Sprite, type FederatedPointerEvent } from 'pixi.js';
import { AvatarMotion } from '../actors/AvatarMotion';
import { AvatarView } from '../actors/AvatarView';
import { loadRoomTextures, type RoomTextures } from '../assets/textures';
import {
  interactableFrom,
  markerAnchor,
  objectCenter,
  pickInteractable,
  planApproach,
} from '../interaction/targets';
import { findPath } from '../nav/astar';
import { NavGrid } from '../nav/grid';
import { depthOrder, type DepthBox } from '../world/depth';
import { ROOM, tileToWorld, worldToTile, type Point, type Tile } from '../world/iso';
import { FURNITURE, INTERACTABLES, SPAWN_TILE, interactableFor, type SectionId } from '../world/layout';
import { ORIGIN, WORLD_HEIGHT, WORLD_WIDTH } from './dimensions';


export type Direction = 'up' | 'down' | 'left' | 'right';
export type TimeOfDay = 'day' | 'night';

/** Seconds of the day/night crossfade. */
const DAYLIGHT_FADE = 0.6;
/** Extra brightness applied to furniture and avatar in full daylight. */
const DAYLIGHT_BOOST = 0.2;
/** Screen directions mapped onto diagonal grid steps. */
const DIRECTION_STEPS: Record<Direction, Tile> = {
  up: { x: -1, y: -1 },
  down: { x: 1, y: 1 },
  left: { x: -1, y: 1 },
  right: { x: 1, y: -1 },
};

export interface RoomEngineEvents {
  onHover(section: SectionId | null): void;
  onInteract(section: SectionId): void;
  onWalk(): void;
}

export interface RoomEngineOptions {
  reducedMotion: boolean;
  timeOfDay: TimeOfDay;
}

interface Entity {
  box: DepthBox;
  view: Container;
}

/**
 * Owns the Pixi application: draws the room, runs the avatar and turns pointer input into
 * walking or interactions. Everything it reports goes through `events`; it knows nothing about React.
 */
export class RoomEngine {
  private readonly grid = NavGrid.fromFurniture(ROOM.cols, ROOM.rows, FURNITURE);
  private readonly motion = new AvatarMotion(SPAWN_TILE);
  private readonly world = new Container();
  private readonly entities = new Container();
  private readonly furnitureViews = new Map<string, Container>();
  private readonly markers = new Map<SectionId, Sprite>();
  private readonly highlight = new ColorMatrixFilter();
  private readonly daylight = new ColorMatrixFilter();
  private roomDay!: Sprite;
  /** 0 = night, 1 = day; eased towards `daylightTarget`. */
  private daylightMix = 0;
  private daylightTarget = 0;
  private avatar!: AvatarView;
  private avatarEntity!: Entity;
  private staticEntities: Entity[] = [];
  private hoverCursor!: Sprite;
  private targetCursor!: Sprite;
  private arm!: Sprite;
  private hovered: SectionId | null = null;
  private pendingSection: SectionId | null = null;
  private clock = 0;
  private destroyed = false;

  private constructor(
    private readonly app: Application,
    private readonly textures: RoomTextures,
    private readonly events: RoomEngineEvents,
    private readonly options: RoomEngineOptions,
  ) {
    this.highlight.brightness(1.22, false);
    this.daylightTarget = options.timeOfDay === 'day' ? 1 : 0;
    this.daylightMix = this.daylightTarget;
  }

  static async create(host: HTMLElement, events: RoomEngineEvents, options: RoomEngineOptions): Promise<RoomEngine> {
    const app = new Application();
    await app.init({
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
      backgroundAlpha: 0,
      antialias: false,
      resolution: 1,
      autoDensity: false,
      roundPixels: true,
    });
    const textures = await loadRoomTextures();
    const engine = new RoomEngine(app, textures, events, options);
    engine.build();
    host.appendChild(app.canvas);
    return engine;
  }

  get canvas(): HTMLCanvasElement {
    return this.app.canvas;
  }

  /** Canvas-pixel position of the marker above the object bound to a section. */
  markerPosition(section: SectionId): Point {
    const p = markerAnchor(interactableFor(section));
    return { x: ORIGIN.x + p.x, y: ORIGIN.y + p.y };
  }

  /** Switches the room lighting; crossfades unless reduced motion is requested. */
  setTimeOfDay(time: TimeOfDay): void {
    this.daylightTarget = time === 'day' ? 1 : 0;
    if (this.options.reducedMotion) this.daylightMix = this.daylightTarget;
  }

  /** Walks to the object of a section and opens it on arrival. */
  goToSection(section: SectionId): void {
    const item = interactableFor(section);
    const path = planApproach(this.grid, this.motion.commitTile, item);
    if (!path) return;
    this.targetCursor.visible = false;
    if (this.options.reducedMotion) {
      this.motion.teleport(path.at(-1) ?? this.motion.commitTile);
      this.pendingSection = section;
      this.arrive();
      return;
    }
    this.pendingSection = section;
    this.startRoute(path);
  }

  /** Moves one tile in a screen direction (keyboard control). */
  nudge(direction: Direction): void {
    const { x: dx, y: dy } = DIRECTION_STEPS[direction];
    const from = this.motion.commitTile;
    const options: Tile[] = [
      { x: dx, y: dy },
      { x: dx, y: 0 },
      { x: 0, y: dy },
    ];
    const step = options.find((d) => this.grid.canStep(from, d.x, d.y));
    if (!step) return;
    this.pendingSection = null;
    this.targetCursor.visible = false;
    this.startRoute([{ x: from.x + step.x, y: from.y + step.y }]);
  }

  /** Uses the object next to the avatar, if any. Returns whether something was opened. */
  interactHere(): boolean {
    const item = interactableFrom(this.motion.commitTile);
    if (!item) return false;
    this.goToSection(item.section);
    return true;
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.app.destroy(true, { children: true });
  }

  private build(): void {
    const { app, textures } = this;
    this.world.position.set(ORIGIN.x, ORIGIN.y);
    app.stage.addChild(this.world);

    const room = new Sprite(textures.room.texture);
    room.position.set(-textures.room.anchor[0], -textures.room.anchor[1]);
    this.roomDay = new Sprite(textures.roomDay);
    this.roomDay.position.copyFrom(room.position);
    this.world.addChild(room, this.roomDay);

    const floorFx = new Container();
    this.hoverCursor = this.tileSprite(textures.fx['tile-hover']);
    this.targetCursor = this.tileSprite(textures.fx['tile-target']);
    floorFx.addChild(this.hoverCursor, this.targetCursor);
    this.world.addChild(floorFx);

    this.entities.sortableChildren = true;
    this.world.addChild(this.entities);
    for (const f of FURNITURE) {
      const { texture, anchor } = textures.furniture[f.sprite]!;
      const view = new Container();
      const sprite = new Sprite(texture);
      sprite.position.set(-anchor[0], -anchor[1]);
      view.addChild(sprite);
      const p = tileToWorld(f.x, f.y);
      view.position.set(p.x, p.y);
      this.entities.addChild(view);
      this.furnitureViews.set(f.id, view);
      // Wall decorations stay behind everything on the floor and skip depth sorting.
      if (f.wall) view.zIndex = -1;
      else this.staticEntities.push({ box: f, view });
    }
    this.addAmbientDetails();

    this.avatar = new AvatarView(textures);
    this.avatarEntity = { box: { x: 0, y: 0, w: 0, h: 0 }, view: this.avatar.container };
    this.entities.addChild(this.avatar.container);

    const markerLayer = new Container();
    for (const item of INTERACTABLES) {
      const marker = new Sprite(textures.fx.marker);
      marker.anchor.set(0.5, 1);
      marker.alpha = 0.6;
      markerLayer.addChild(marker);
      this.markers.set(item.section, marker);
    }
    this.world.addChild(markerLayer);

    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointermove', (e) => this.onPointerMove(e));
    app.stage.on('pointertap', (e) => this.onPointerTap(e));
    app.canvas.addEventListener('pointerleave', () => this.setHovered(null));
    app.ticker.add((ticker) => this.update(Math.min(ticker.deltaMS / 1000, 0.1)));
    this.update(0);
  }

  private tileSprite(texture: Sprite['texture']): Sprite {
    const s = new Sprite(texture);
    s.anchor.set(0.5, 0);
    s.visible = false;
    return s;
  }

  /** Robot arm on the workbench. */
  private addAmbientDetails(): void {
    const bench = this.furnitureViews.get('workbench');
    if (bench) {
      this.arm = new Sprite(this.textures.arm[0]);
      const [ax, ay] = this.textures.armAnchor;
      const base = tileToWorld(1.4, 1.0, 25);
      this.arm.position.set(base.x - ax, base.y - ay);
      bench.addChild(this.arm);
    }
  }

  private toWorld(e: FederatedPointerEvent): Point {
    return this.world.toLocal(e.global);
  }

  private floorTile(world: Point): Tile {
    const t = worldToTile(world);
    return { x: Math.floor(t.x), y: Math.floor(t.y) };
  }

  private onPointerMove(e: FederatedPointerEvent): void {
    if (e.pointerType !== 'mouse') return;
    const world = this.toWorld(e);
    const item = pickInteractable(world);
    this.setHovered(item?.section ?? null);
    const tile = this.floorTile(world);
    const showTile = !item && this.grid.isWalkable(tile);
    this.hoverCursor.visible = showTile;
    if (showTile) this.placeOnTile(this.hoverCursor, tile);
    this.app.canvas.style.cursor = item ? 'pointer' : showTile ? 'pointer' : 'default';
  }

  private onPointerTap(e: FederatedPointerEvent): void {
    const world = this.toWorld(e);
    const item = pickInteractable(world);
    if (item) {
      this.goToSection(item.section);
      return;
    }
    const tile = this.floorTile(world);
    if (!this.grid.inBounds(tile)) return;
    const target = this.grid.isWalkable(tile) ? tile : this.grid.nearestWalkable(tile);
    if (!target) return;
    const path = findPath(this.grid, this.motion.commitTile, target);
    if (!path) return;
    this.pendingSection = null;
    this.placeOnTile(this.targetCursor, target);
    this.targetCursor.visible = true;
    this.targetCursor.alpha = 1;
    this.startRoute(path);
  }

  private startRoute(path: Tile[]): void {
    this.motion.follow(path);
    if (path.length) this.events.onWalk();
    if (!this.motion.isMoving) this.arrive();
  }

  private arrive(): void {
    const section = this.pendingSection;
    this.pendingSection = null;
    if (!section) return;
    const item = interactableFor(section);
    this.motion.faceTowards(objectCenter(item));
    const marker = this.markers.get(section);
    if (marker) marker.scale.set(1.6);
    this.events.onInteract(section);
  }

  private setHovered(section: SectionId | null): void {
    if (section === this.hovered) return;
    const previous = this.hovered && this.objectView(this.hovered);
    if (previous) previous.filters = [];
    this.hovered = section;
    const next = section && this.objectView(section);
    if (next) next.filters = [this.highlight];
    if (!section) this.app.canvas.style.cursor = 'default';
    this.events.onHover(section);
  }

  private objectView(section: SectionId): Container | undefined {
    return this.furnitureViews.get(interactableFor(section).objectId);
  }

  private placeOnTile(sprite: Sprite, tile: Tile): void {
    const p = tileToWorld(tile.x, tile.y);
    sprite.position.set(p.x, p.y);
  }

  private update(dt: number): void {
    this.clock += dt;
    if (this.motion.update(dt)) {
      this.targetCursor.visible = false;
      this.arrive();
    }
    this.avatar.sync(this.motion, dt);
    this.avatarEntity.box = { x: this.motion.pos.x, y: this.motion.pos.y, w: 0, h: 0 };
    depthOrder([...this.staticEntities, this.avatarEntity].map((e) => ({ ...e.box, e }))).forEach((item, index) => {
      item.e.view.zIndex = index;
    });
    this.updateDaylight(dt);
    this.animateAmbient();
  }

  private updateDaylight(dt: number): void {
    const step = dt / DAYLIGHT_FADE;
    const delta = this.daylightTarget - this.daylightMix;
    this.daylightMix += Math.sign(delta) * Math.min(Math.abs(delta), step);
    this.roomDay.alpha = this.daylightMix;
    this.roomDay.visible = this.daylightMix > 0;
    const lit = this.daylightMix > 0;
    if (lit) this.daylight.brightness(1 + DAYLIGHT_BOOST * this.daylightMix, false);
    if (lit !== (this.entities.filters?.length ?? 0) > 0) this.entities.filters = lit ? [this.daylight] : [];
  }

  private animateAmbient(): void {
    const t = this.clock;
    const still = this.options.reducedMotion;
    INTERACTABLES.forEach((item, i) => {
      const marker = this.markers.get(item.section)!;
      const anchor = markerAnchor(item);
      const bob = still ? 0 : Math.round(Math.sin(t * 2.4 + i * 1.3) * 1.5);
      marker.position.set(anchor.x, anchor.y + bob);
      const hovered = this.hovered === item.section;
      marker.alpha = hovered ? 1 : 0.55;
      const s = Math.max(1, marker.scale.x - 0.05);
      marker.scale.set(s);
    });
    if (this.arm && !still) {
      // Ping-pong through the frames with a short hold at each end.
      const frames = this.textures.arm.length;
      const cycle = (frames - 1) * 2 + 8;
      const step = Math.floor(t * 7) % cycle;
      const index = step < frames ? step : step < frames + 4 ? frames - 1 : Math.max(0, frames - 1 - (step - frames - 4));
      this.arm.texture = this.textures.arm[Math.min(frames - 1, index)]!;
    }
  }
}
