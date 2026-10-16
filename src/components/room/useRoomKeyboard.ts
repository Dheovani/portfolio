import { useEffect } from 'react';
import type { Direction, RoomEngine } from '../../game/engine/RoomEngine';
import { useAppStore } from '../../state/useAppStore';

const KEY_DIRECTIONS: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};

/** Arrow keys/WASD walk; Enter, Space or E use the adjacent object. Disabled while a panel is open. */
export function useRoomKeyboard(engine: RoomEngine | null): void {
  useEffect(() => {
    if (!engine) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const { activeSection, helpOpen } = useAppStore.getState();
      if (activeSection || helpOpen || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      // Form fields (e.g. the radio volume slider) keep their own arrow-key behaviour.
      if (target?.closest('input, select, textarea')) return;
      const onControl = !!target?.closest('button, a');
      const direction = KEY_DIRECTIONS[event.key.length === 1 ? event.key.toLowerCase() : event.key];
      if (direction) {
        event.preventDefault();
        engine.nudge(direction);
        return;
      }
      if (!onControl && (event.key === 'Enter' || event.key === ' ' || event.key.toLowerCase() === 'e')) {
        if (engine.interactHere()) event.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [engine]);
}
