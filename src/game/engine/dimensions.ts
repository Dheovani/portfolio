import manifest from '../assets/generated/manifest.json';

/** Empty border around the room sprite, in art pixels. */
export const PADDING = 4;
/** Logical canvas size in art pixels; the DOM scales it up with nearest-neighbour filtering. */
export const WORLD_WIDTH = manifest.room.width + PADDING * 2;
export const WORLD_HEIGHT = manifest.room.height + PADDING * 2;
/** Canvas position of the room's back floor corner (tile 0,0). */
export const ORIGIN = { x: PADDING + (manifest.room.anchor[0] ?? 0), y: PADDING + (manifest.room.anchor[1] ?? 0) };
