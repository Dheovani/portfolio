import { describe, expect, it } from 'vitest';
import { AudioPlayer, type MediaElementLike, type PlayerState } from './AudioPlayer';
import { TRACKS, trackUrl, wrapIndex } from './playlist';
import { DEFAULT_VOLUME, parsePreferences } from './preferences';

class FakeAudio implements MediaElementLike {
  src = '';
  volume = 1;
  muted = false;
  currentTime = 0;
  preload = 'auto';
  played: string[] = [];
  /** What the next play() calls do. */
  outcome: 'ok' | 'blocked' | 'fail' = 'ok';
  private listeners = new Map<string, (() => void)[]>();

  play(): Promise<void> {
    this.played.push(this.src);
    if (this.outcome === 'blocked') return Promise.reject(new DOMException('no gesture', 'NotAllowedError'));
    if (this.outcome === 'fail') {
      queueMicrotask(() => this.fire('error'));
      return Promise.reject(new DOMException('missing', 'NotSupportedError'));
    }
    queueMicrotask(() => this.fire('playing'));
    return Promise.resolve();
  }

  pause(): void {
    this.fire('pause');
  }

  addEventListener(type: string, listener: () => void): void {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  fire(type: string): void {
    for (const l of this.listeners.get(type) ?? []) l();
  }
}

const flush = () => new Promise((r) => setTimeout(r, 0));

function setup(initial = { volume: 0.2, muted: false }) {
  const elements: FakeAudio[] = [];
  const state: PlayerState = { index: 0, status: 'idle', ...initial };
  const player = new AudioPlayer({
    tracks: TRACKS,
    urlFor: (t) => `/audio/${t.file}`,
    createElement: () => {
      const el = new FakeAudio();
      elements.push(el);
      return el;
    },
    initial,
    onChange: (patch) => Object.assign(state, patch),
  });
  return { player, state, elements };
}

describe('playlist', () => {
  it('has the ten tracks of the album with static URLs', () => {
    expect(TRACKS).toHaveLength(10);
    expect(TRACKS[0]!.title).toBe('Beach Resort');
    expect(TRACKS[9]!.title).toBe('Look on the Bright Side');
    expect(trackUrl(TRACKS[0]!)).toBe('/audio/purrple-cat/01-beach-resort.mp3');
  });

  it('wraps indexes in both directions', () => {
    expect(wrapIndex(10, 10)).toBe(0);
    expect(wrapIndex(-1, 10)).toBe(9);
  });
});

describe('AudioPlayer', () => {
  it('creates no audio element until the visitor presses play', async () => {
    const { player, state, elements } = setup();
    player.next();
    expect(elements).toHaveLength(0);
    expect(state.index).toBe(1);
    player.play();
    await flush();
    expect(elements).toHaveLength(1);
    expect(elements[0]!.preload).toBe('none');
    expect(elements[0]!.volume).toBe(0.2);
    expect(elements[0]!.src).toBe('/audio/02-just-relax.mp3');
    expect(state.status).toBe('playing');
  });

  it('advances on ended and loops from the last track to the first, reusing one element', async () => {
    const { player, state, elements } = setup();
    player.play();
    await flush();
    for (let i = 0; i < 10; i++) {
      elements[0]!.fire('ended');
      await flush();
    }
    expect(state.index).toBe(0);
    expect(state.status).toBe('playing');
    expect(elements).toHaveLength(1);
    expect(elements[0]!.played.at(-2)).toBe('/audio/10-look-on-the-bright-side.mp3');
    expect(elements[0]!.played.at(-1)).toBe('/audio/01-beach-resort.mp3');
  });

  it('pauses, and changing track while paused does not start playback', async () => {
    const { player, state, elements } = setup();
    player.play();
    await flush();
    player.toggle();
    expect(state.status).toBe('paused');
    const plays = elements[0]!.played.length;
    player.next();
    expect(state.index).toBe(1);
    expect(elements[0]!.played.length).toBe(plays);
  });

  it('previous restarts a track that is under way, otherwise goes back (wrapping)', async () => {
    const { player, state, elements } = setup();
    player.play();
    await flush();
    elements[0]!.currentTime = 42;
    player.previous();
    expect(elements[0]!.currentTime).toBe(0);
    expect(state.index).toBe(0);
    player.previous();
    expect(state.index).toBe(9);
  });

  it('reports a blocked autoplay instead of failing', async () => {
    const { player, state, elements } = setup();
    player.play();
    elements[0]!.outcome = 'blocked';
    player.next();
    await flush();
    expect(state.status).toBe('blocked');
  });

  it('skips tracks that fail to load and stops after every track failed', async () => {
    const { player, state, elements } = setup();
    player.play();
    await flush();
    const el = elements[0]!;
    el.outcome = 'fail';
    el.fire('error');
    await flush();
    await flush();
    expect(state.status).toBe('error');
    // Every track was tried exactly once before giving up.
    expect(new Set(el.played.slice(1))).toHaveProperty('size', TRACKS.length - 1);
    expect(el.played.length).toBe(TRACKS.length);
  });

  it('applies volume and mute, and raising the volume unmutes', async () => {
    const { player, state, elements } = setup({ volume: 0.2, muted: true });
    player.play();
    await flush();
    expect(elements[0]!.muted).toBe(true);
    player.setVolume(0.6);
    expect(elements[0]!.volume).toBe(0.6);
    expect(state.muted).toBe(false);
    player.setVolume(7);
    expect(state.volume).toBe(1);
  });
});

describe('radio preferences', () => {
  it('defaults to a quiet volume and ignores invalid data', () => {
    expect(parsePreferences(null)).toEqual({ volume: DEFAULT_VOLUME, muted: false });
    expect(parsePreferences('not json')).toEqual({ volume: DEFAULT_VOLUME, muted: false });
    expect(parsePreferences('{"volume":0.5,"muted":true}')).toEqual({ volume: 0.5, muted: true });
    expect(parsePreferences('{"volume":-3}').volume).toBe(0);
  });
});
