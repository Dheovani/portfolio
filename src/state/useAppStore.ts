import { create } from 'zustand';
import type { TimeOfDay } from '../game/engine/RoomEngine';
import type { SectionId } from '../game/world/layout';
import { initialTimeOfDay, saveTimeOfDay } from './timeOfDay';

interface AppState {
  /** Section whose panel is open, or null while exploring. */
  activeSection: SectionId | null;
  /** Object currently under the mouse. */
  hoveredSection: SectionId | null;
  helpOpen: boolean;
  /** Room lighting chosen with the day/night switch. */
  timeOfDay: TimeOfDay;
  /** Becomes true after the first walk or interaction; hides the onboarding hint. */
  hasExplored: boolean;
  openSection: (section: SectionId) => void;
  closeSection: () => void;
  setHovered: (section: SectionId | null) => void;
  setHelpOpen: (open: boolean) => void;
  markExplored: () => void;
  setTimeOfDay: (time: TimeOfDay) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: null,
  hoveredSection: null,
  helpOpen: false,
  hasExplored: false,
  timeOfDay: initialTimeOfDay(),
  openSection: (section) => set({ activeSection: section, helpOpen: false, hasExplored: true }),
  closeSection: () => set({ activeSection: null }),
  setHovered: (section) => set({ hoveredSection: section }),
  setHelpOpen: (open) => set({ helpOpen: open }),
  markExplored: () => set({ hasExplored: true }),
  setTimeOfDay: (time) => {
    saveTimeOfDay(time);
    set({ timeOfDay: time });
  },
}));
