/** Floor-space bounding box used for isometric draw ordering. */
export interface DepthBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** True when `a` lies beyond one of `b`'s front faces and must be drawn after it. */
export function isInFront(a: DepthBox, b: DepthBox): boolean {
  return a.x >= b.x + b.w || a.y >= b.y + b.h;
}

/**
 * Orders non-overlapping boxes back-to-front with a topological sort.
 * Pre-sorting by the far corner keeps the result stable for unrelated boxes.
 */
export function depthOrder<T extends DepthBox>(items: readonly T[]): T[] {
  const key = (b: DepthBox) => b.x + b.w + b.y + b.h;
  const sorted = [...items].sort((a, b) => key(a) - key(b));
  const n = sorted.length;
  const after: number[][] = Array.from({ length: n }, () => []);
  const pending = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && isInFront(sorted[i]!, sorted[j]!) && !isInFront(sorted[j]!, sorted[i]!)) {
        after[j]!.push(i);
        pending[i]!++;
      }
    }
  }
  const result: T[] = [];
  const done = new Array<boolean>(n).fill(false);
  while (result.length < n) {
    let next = pending.findIndex((p, i) => p === 0 && !done[i]);
    if (next === -1) next = done.findIndex((d) => !d); // cycle guard, not expected for valid layouts
    done[next] = true;
    result.push(sorted[next]!);
    for (const k of after[next]!) pending[k]!--;
  }
  return result;
}
