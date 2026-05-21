import { Colors } from '@/constants/theme';
import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import { useThemeColors } from './use-theme-color';

jest.mock('react-native', () => {
  const actualReactNative = jest.requireActual('react-native');
  return Object.setPrototypeOf(
    {
      useColorScheme: jest.fn(),
    },
    actualReactNative,
  );
});

describe('useThemeColors', () => {
  test('returns the default light theme when useColorScheme returns null', async () => {
    (useColorScheme as jest.Mock).mockReturnValue(null);
    const { result } = await renderHook(() => useThemeColors());

    expect(result.current).toEqual(Colors.light);
  });
});
