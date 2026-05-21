import { generateColor, generateContrastColor } from './color';

describe('Color Utilities', () => {
  let randomSpy: jest.SpyInstance;

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  describe('generateColor', () => {
    it('should generate a valid 6-character hex color starting with #', () => {
      randomSpy.mockReturnValue(0.5);
      const color = generateColor();
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('should pad with zeros if the random number is very small', () => {
      randomSpy.mockReturnValue(0);
      const color = generateColor();
      expect(color).toBe('#000000');
    });
  });

  describe('generateContrastColor', () => {
    it('should return white foreground (fff) for a dark background', () => {
      randomSpy.mockReturnValue(0);
      const result = generateContrastColor();

      expect(result.background).toBe('#000000');
      expect(result.foreground).toBe('fff');
    });

    it('should return black foreground (000) for a light background', () => {
      randomSpy.mockReturnValue(0.9999999);
      const result = generateContrastColor();
      expect(result.foreground).toBe('000');
    });
  });
});
