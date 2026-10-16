import placements from './furniture.json';
import type { Tile } from './iso';

/** Portfolio sections, each bound to one object in the room. */
export const SECTION_IDS = ['about', 'experience', 'education', 'projects', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface FurniturePlacement {
  id: string;
  sprite: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Interactable {
  section: SectionId;
  objectId: string;
  /** Free tiles from which the avatar can use the object; the closest reachable one is chosen. */
  approach: Tile[];
  /** Visual height in px, used for the hit area and the floating marker. */
  height: number;
  /** Optional marker position relative to the footprint origin (tiles, px), when the centre is ambiguous. */
  marker?: { x: number; y: number; z: number };
}

/** Positions and footprints live in furniture.json, shared with the sprite generator. */
export const FURNITURE: readonly FurniturePlacement[] = placements;

export const INTERACTABLES: readonly Interactable[] = [
  {
    section: 'about',
    objectId: 'bed',
    approach: [
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ],
    height: 30,
  },
  {
    section: 'experience',
    objectId: 'desk',
    approach: [
      { x: 6, y: 1 },
      { x: 8, y: 1 },
      { x: 5, y: 0 },
    ],
    height: 46,
  },
  {
    section: 'education',
    objectId: 'bookshelf',
    approach: [
      { x: 1, y: 8 },
      { x: 1, y: 9 },
      { x: 1, y: 10 },
    ],
    height: 66,
  },
  {
    section: 'projects',
    objectId: 'workbench',
    approach: [
      { x: 5, y: 7 },
      { x: 6, y: 7 },
      { x: 7, y: 7 },
      { x: 8, y: 5 },
      { x: 8, y: 6 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 4, y: 5 },
      { x: 4, y: 6 },
    ],
    height: 62,
    // Above the oscilloscope: a marker over the centre would float in front of the bed.
    marker: { x: 2.6, y: 0.45, z: 44 },
  },
  {
    section: 'contact',
    objectId: 'mailbox',
    approach: [
      { x: 10, y: 7 },
      { x: 11, y: 8 },
      { x: 11, y: 6 },
      { x: 10, y: 8 },
    ],
    height: 46,
  },
];

export const SPAWN_TILE: Tile = { x: 6, y: 9 };

export function furnitureById(id: string): FurniturePlacement {
  const item = FURNITURE.find((f) => f.id === id);
  if (!item) throw new Error(`Unknown furniture: ${id}`);
  return item;
}

export function interactableFor(section: SectionId): Interactable {
  const item = INTERACTABLES.find((i) => i.section === section);
  if (!item) throw new Error(`No object for section: ${section}`);
  return item;
}
