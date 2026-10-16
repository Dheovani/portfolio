import { Assets, Rectangle, Texture, TextureStyle } from 'pixi.js';
import manifest from './generated/manifest.json';
import { spriteUrl } from './urls';

export type SpriteManifest = typeof manifest;

export interface AnchoredTexture {
  texture: Texture;
  anchor: [number, number];
}

export interface RoomTextures {
  room: AnchoredTexture;
  /** Daytime version of the room shell; same size and anchor as `room`. */
  roomDay: Texture;
  furniture: Record<string, AnchoredTexture>;
  /** avatar[row][column]; row 0 faces the viewer, row 1 faces away. */
  avatar: Texture[][];
  avatarAnchor: [number, number];
  arm: Texture[];
  armAnchor: [number, number];
  fx: Record<keyof SpriteManifest['fx'], Texture>;
}

function load(file: string): Promise<Texture> {
  return Assets.load<Texture>(spriteUrl(file));
}

function slice(base: Texture, x: number, y: number, w: number, h: number): Texture {
  return new Texture({ source: base.source, frame: new Rectangle(x, y, w, h) });
}

const asPair = (v: number[]): [number, number] => [v[0] ?? 0, v[1] ?? 0];

export async function loadRoomTextures(): Promise<RoomTextures> {
  TextureStyle.defaultOptions.scaleMode = 'nearest';

  const furnitureEntries = await Promise.all(
    Object.entries(manifest.furniture).map(async ([key, entry]) => {
      return [key, { texture: await load(entry.file), anchor: asPair(entry.anchor) }] as const;
    }),
  );

  const { avatar: a, arm: r } = manifest;
  const [room, roomDay, avatarBase, armBase] = await Promise.all([
    load(manifest.room.file),
    load(manifest.roomDay.file),
    load(a.file),
    load(r.file),
  ]);
  const avatar = Array.from({ length: a.rows }, (_, row) =>
    Array.from({ length: a.columns }, (_, col) => slice(avatarBase, col * a.width, row * a.height, a.width, a.height)),
  );
  const arm = Array.from({ length: r.frames }, (_, i) => slice(armBase, i * r.width, 0, r.width, r.height));

  const fxKeys = Object.keys(manifest.fx) as (keyof SpriteManifest['fx'])[];
  const fxTextures = await Promise.all(fxKeys.map((k) => load(manifest.fx[k].file)));

  return {
    room: { texture: room, anchor: asPair(manifest.room.anchor) },
    roomDay,
    furniture: Object.fromEntries(furnitureEntries),
    avatar,
    avatarAnchor: asPair(a.anchor),
    arm,
    armAnchor: asPair(r.anchor),
    fx: Object.fromEntries(fxKeys.map((k, i) => [k, fxTextures[i]!])) as RoomTextures['fx'],
  };
}
