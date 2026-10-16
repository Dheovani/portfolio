import type { TimeOfDay } from '../game/engine/RoomEngine';

const STORAGE_KEY = 'portfolio.timeOfDay';

/** Saved choice, or the visitor's local time on a first visit (day from 7:00 to 18:59). */
export function initialTimeOfDay(): TimeOfDay {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'day' || stored === 'night') return stored;
  } catch {
    // Storage unavailable: fall back to the clock.
  }
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? 'day' : 'night';
}

export function saveTimeOfDay(time: TimeOfDay): void {
  try {
    localStorage.setItem(STORAGE_KEY, time);
  } catch {
    // Not persisted; the choice still applies to this visit.
  }
}
