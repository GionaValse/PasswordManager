export function generateColor(): string {
  const hex = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${hex}`;
}

export function generateContrastColor(): {
  background: string;
  foreground: string;
} {
  const background = generateColor();

  const r = parseInt(background.slice(1, 3), 16);
  const g = parseInt(background.slice(3, 5), 16);
  const b = parseInt(background.slice(5, 7), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  const foreground = brightness > 128 ? '000' : 'fff';

  return { background, foreground };
}
