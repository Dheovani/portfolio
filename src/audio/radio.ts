import { useRadioStore } from '../state/useRadioStore';
import { AudioPlayer } from './AudioPlayer';
import { ALBUM, TRACKS, trackUrl } from './playlist';
import { savePreferences } from './preferences';

/**
 * The single app-wide player. It lives outside React, so mounting or unmounting UI (panels,
 * language changes, the widget itself) never restarts or duplicates the music.
 */
export const radio = new AudioPlayer({
  tracks: TRACKS,
  urlFor: trackUrl,
  createElement: () => new Audio(),
  initial: useRadioStore.getState(),
  onChange: (patch) => {
    useRadioStore.setState(patch);
    if ('volume' in patch || 'muted' in patch) {
      const { volume, muted } = useRadioStore.getState();
      savePreferences({ volume, muted });
    }
    if ('index' in patch) updateMediaSession();
  },
});

/** OS media controls (lock screen, media keys) via the native Media Session API, when available. */
function updateMediaSession(): void {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: radio.currentTrack.title,
    artist: ALBUM.artist,
    album: ALBUM.title,
  });
}

if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', () => radio.play());
  navigator.mediaSession.setActionHandler('pause', () => radio.pause());
  navigator.mediaSession.setActionHandler('nexttrack', () => radio.next());
  navigator.mediaSession.setActionHandler('previoustrack', () => radio.previous());
  updateMediaSession();
}
