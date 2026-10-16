const STORAGE_KEY = 'portfolio.radio';

export const DEFAULT_VOLUME = 0.2;

export interface RadioPreferences {
  volume: number;
  muted: boolean;
}

export function clampVolume(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : DEFAULT_VOLUME;
}

/** Parses stored preferences, falling back to a quiet default for anything invalid. */
export function parsePreferences(raw: string | null): RadioPreferences {
  try {
    const data = raw ? (JSON.parse(raw) as Partial<RadioPreferences>) : {};
    return {
      volume: typeof data.volume === 'number' ? clampVolume(data.volume) : DEFAULT_VOLUME,
      muted: data.muted === true,
    };
  } catch {
    return { volume: DEFAULT_VOLUME, muted: false };
  }
}

export function loadPreferences(): RadioPreferences {
  try {
    return parsePreferences(localStorage.getItem(STORAGE_KEY));
  } catch {
    return parsePreferences(null);
  }
}

export function savePreferences(prefs: RadioPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Not persisted; the setting still applies to this visit.
  }
}
