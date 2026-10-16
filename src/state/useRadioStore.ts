import { create } from 'zustand';
import type { PlayerState } from '../audio/AudioPlayer';
import { loadPreferences } from '../audio/preferences';

/** Playback state mirrored from the audio player, read by the radio widget. */
export const useRadioStore = create<PlayerState>(() => ({
  index: 0,
  status: 'idle',
  ...loadPreferences(),
}));
