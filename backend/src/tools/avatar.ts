import { generateContrastColor } from './color';

export function generateAvatar(name: string): string {
  const { background, foreground } = generateContrastColor();
  const aName = name.replaceAll(' ', '+');
  const aBackground = background.substring(1);

  return `https://ui-avatars.com/api/?name=${aName}&background=${aBackground}&color=${foreground}`;
}
