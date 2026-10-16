import { wrapIndex, type Track } from './playlist';
import { clampVolume } from './preferences';

export type RadioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'blocked' | 'error';

export interface PlayerState {
  index: number;
  status: RadioStatus;
  volume: number;
  muted: boolean;
}

/** The subset of HTMLAudioElement the player uses (lets tests supply a fake). */
export interface MediaElementLike {
  src: string;
  volume: number;
  muted: boolean;
  currentTime: number;
  preload: string;
  play(): Promise<void>;
  pause(): void;
  addEventListener(type: string, listener: () => void): void;
}

export interface AudioPlayerOptions {
  tracks: readonly Track[];
  urlFor: (track: Track) => string;
  createElement: () => MediaElementLike;
  initial: Pick<PlayerState, 'volume' | 'muted'>;
  onChange: (patch: Partial<PlayerState>) => void;
}

/** Seconds into a track after which "previous" restarts it instead of going back. */
const RESTART_THRESHOLD = 3;

/**
 * Looping playlist on a single audio element. The element is created on the first play, never
 * before, and only the current track is requested (`preload = none`).
 */
export class AudioPlayer {
  private element: MediaElementLike | null = null;
  private index = 0;
  private volume: number;
  private muted: boolean;
  /** Whether the visitor wants music: survives track changes, cleared by pause and blocking. */
  private wantsToPlay = false;
  private consecutiveFailures = 0;
  /** Increments whenever a new source is assigned; a load can fail only once. */
  private loadId = 0;
  private failedLoadId = -1;

  constructor(private readonly options: AudioPlayerOptions) {
    this.volume = clampVolume(options.initial.volume);
    this.muted = options.initial.muted;
  }

  get currentTrack(): Track {
    return this.options.tracks[this.index]!;
  }

  play(): void {
    this.wantsToPlay = true;
    const el = this.ensureElement();
    if (!el.src) this.load(el);
    this.emit({ status: 'loading' });
    el.play().catch((error: unknown) => {
      const name = error instanceof DOMException ? error.name : '';
      if (name === 'AbortError') return; // superseded by a track change
      if (name === 'NotAllowedError') {
        this.wantsToPlay = false;
        this.emit({ status: 'blocked' });
        return;
      }
      this.handleFailure();
    });
  }

  pause(): void {
    this.wantsToPlay = false;
    this.element?.pause();
    this.emit({ status: this.element ? 'paused' : 'idle' });
  }

  toggle(): void {
    if (this.wantsToPlay) this.pause();
    else this.play();
  }

  next(): void {
    this.consecutiveFailures = 0;
    this.select(this.index + 1);
  }

  previous(): void {
    this.consecutiveFailures = 0;
    if (this.element && this.element.currentTime > RESTART_THRESHOLD) {
      this.element.currentTime = 0;
      return;
    }
    this.select(this.index - 1);
  }

  setVolume(value: number): void {
    this.volume = clampVolume(value);
    if (this.element) this.element.volume = this.volume;
    // Moving the slider up while muted is a request to hear it again.
    if (this.muted && this.volume > 0) this.setMuted(false);
    this.emit({ volume: this.volume });
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.element) this.element.muted = muted;
    this.emit({ muted });
  }

  private select(index: number): void {
    this.index = wrapIndex(index, this.options.tracks.length);
    this.emit({ index: this.index });
    if (this.element) this.load(this.element);
    if (this.wantsToPlay) this.play();
    else if (this.element) this.emit({ status: 'paused' });
  }

  private load(el: MediaElementLike): void {
    this.loadId++;
    el.src = this.options.urlFor(this.currentTrack);
  }

  private ensureElement(): MediaElementLike {
    if (this.element) return this.element;
    const el = this.options.createElement();
    el.preload = 'none';
    el.volume = this.volume;
    el.muted = this.muted;
    el.addEventListener('playing', () => {
      this.consecutiveFailures = 0;
      this.emit({ status: 'playing' });
    });
    el.addEventListener('waiting', () => {
      if (this.wantsToPlay) this.emit({ status: 'loading' });
    });
    el.addEventListener('pause', () => {
      if (!this.wantsToPlay) this.emit({ status: 'paused' });
    });
    el.addEventListener('ended', () => this.select(this.index + 1));
    el.addEventListener('error', () => this.handleFailure());
    this.element = el;
    return el;
  }

  /** Skips a track that cannot be loaded; gives up after every track has failed in a row. */
  private handleFailure(): void {
    // A broken file both rejects play() and fires `error`: count it once.
    if (this.failedLoadId === this.loadId) return;
    this.failedLoadId = this.loadId;
    this.consecutiveFailures++;
    if (!this.wantsToPlay || this.consecutiveFailures >= this.options.tracks.length) {
      this.wantsToPlay = false;
      this.emit({ status: 'error' });
      return;
    }
    this.select(this.index + 1);
  }

  private emit(patch: Partial<PlayerState>): void {
    this.options.onChange(patch);
  }
}
