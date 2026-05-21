import { generateAvatar } from './avatar';
import * as colorModule from './color';

jest.mock('./color', () => ({
  generateContrastColor: jest.fn(),
}));

describe('Avatar Utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a correct ui-avatars URL replacing spaces and removing the #', () => {
    jest.spyOn(colorModule, 'generateContrastColor').mockReturnValue({
      background: '#ff0055',
      foreground: 'fff',
    });

    const result = generateAvatar('Mario Rossi');

    expect(result).toBe('https://ui-avatars.com/api/?name=Mario+Rossi&background=ff0055&color=fff');
    expect(colorModule.generateContrastColor).toHaveBeenCalledTimes(1);
  });

  it('should handle names with multiple spaces correctly', () => {
    jest.spyOn(colorModule, 'generateContrastColor').mockReturnValue({
      background: '#000000',
      foreground: 'fff',
    });

    const result = generateAvatar('Maria De Filippi');
    expect(result).toContain('name=Maria+De+Filippi');
  });
});
