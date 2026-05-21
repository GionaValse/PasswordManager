import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import { FabButton } from './FabButton';

describe('FabButton Component', () => {
  test('renders the provided icon correctly', async () => {
    const mockOnPress = jest.fn();

    await render(<FabButton icon={<View testID="fab-mock-icon" />} onPress={mockOnPress} />);
    expect(screen.getByTestId('fab-mock-icon')).toBeOnTheScreen();
  });

  test('calls the onPress function exactly once when pressed', async () => {
    const mockOnPress = jest.fn();
    await render(<FabButton icon={<View testID="fab-mock-icon" />} onPress={mockOnPress} />);

    const icon = screen.getByTestId('fab-mock-icon');

    await fireEvent.press(icon);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('injects size and color props into the icon if it is a valid React Element', async () => {
    const mockOnPress = jest.fn();

    await render(<FabButton icon={<View testID="fab-mock-icon" />} onPress={mockOnPress} />);

    const icon = screen.getByTestId('fab-mock-icon');

    expect(icon.props.size).toBe(26);
    expect(icon.props.color).toBeDefined();
  });

  test('renders without crashing when a non-valid element (like null) is passed as icon', async () => {
    await render(<FabButton icon={null as any} onPress={() => {}} />);
    expect(screen.getByRole('button')).toBeOnTheScreen();
  });
});
