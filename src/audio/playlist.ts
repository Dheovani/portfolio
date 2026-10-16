// Purrple Cat — "Just Relax" (CC BY-SA 4.0). Files live in public/audio/purrple-cat/; see CREDITS.md there.

export const ALBUM = {
  artist: 'Purrple Cat',
  title: 'Just Relax',
  url: 'https://purrplecat.itch.io/just-relax',
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
} as const;

export interface Track {
  title: string;
  file: string;
}

export const TRACKS: readonly Track[] = [
  { title: 'Beach Resort', file: '01-beach-resort.mp3' },
  { title: 'Just Relax', file: '02-just-relax.mp3' },
  { title: 'Road Trip', file: '03-road-trip.mp3' },
  { title: 'Disassociate', file: '04-disassociate.mp3' },
  { title: 'Foggy Window', file: '05-foggy-window.mp3' },
  { title: 'Quiet Night', file: '06-quiet-night.mp3' },
  { title: 'Getting a Haircut', file: '07-getting-a-haircut.mp3' },
  { title: 'The Golden Ratio', file: '08-the-golden-ratio.mp3' },
  { title: 'Riding My Bike to the End of the World', file: '09-riding-my-bike-to-the-end-of-the-world.mp3' },
  { title: 'Look on the Bright Side', file: '10-look-on-the-bright-side.mp3' },
];

/** Static URL of a track, honouring Vite's `base`. */
export function trackUrl(track: Track): string {
  return `${import.meta.env.BASE_URL}audio/purrple-cat/${track.file}`;
}

/** Index arithmetic for a looping playlist. */
export function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}
