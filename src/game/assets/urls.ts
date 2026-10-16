// URLs of the generated sprites (see scripts/sprites). Replace the PNGs to swap the art.
const urls = import.meta.glob<string>('./generated/*.png', { eager: true, import: 'default', query: '?url' });

export function spriteUrl(file: string): string {
  const url = urls[`./generated/${file}`];
  if (!url) throw new Error(`Missing sprite: ${file}`);
  return url;
}
