import RootLayout from '@/app/_layout';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('expo-router', () => {
  const { View } = require('react-native');
  const Stack = ({ children }: any) => <View testID="expo-router-stack">{children}</View>;
  Stack.Screen = () => null;
  return { Stack };
});

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('RootLayout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly in light mode without crashing', async () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    await render(<RootLayout />);
    expect(screen.getByTestId('expo-router-stack')).toBeOnTheScreen();
  });

  test('renders correctly in dark mode without crashing', async () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    await render(<RootLayout />);
    expect(screen.getByTestId('expo-router-stack')).toBeOnTheScreen();
  });
});
