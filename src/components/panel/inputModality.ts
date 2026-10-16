// Tracks whether the visitor is using the keyboard or a pointer, to decide where panel focus lands.
let lastInput: 'keyboard' | 'pointer' = 'pointer';

window.addEventListener('keydown', () => (lastInput = 'keyboard'), true);
window.addEventListener('pointerdown', () => (lastInput = 'pointer'), true);

export function lastInputWasKeyboard(): boolean {
  return lastInput === 'keyboard';
}
