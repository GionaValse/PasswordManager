import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Button } from './Button';

describe('Button Component', () => {
  test('renders correctly with the provided title', async () => {
    await render(<Button title="Click me" onPress={() => {}} />);
    expect(screen.getByText('Click me')).toBeOnTheScreen();
  });

  test('calls the onPress function exactly once when pressed', async () => {
    const mockOnPress = jest.fn();
    await render(<Button title="Save" onPress={mockOnPress} />);

    const button = screen.getByText('Save');
    await fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
