import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import FloatNavButton from './FloatNavButton';

describe('FloatNavButton Component', () => {
  test('renders correctly with the proper accessibility role', async () => {
    const mockOnBack = jest.fn();
    await render(<FloatNavButton onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: 'Go back' });
    expect(backButton).toBeOnTheScreen();
  });

  test('calls the onBack function exactly once when pressed', async () => {
    const mockOnBack = jest.fn();
    await render(<FloatNavButton onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: 'Go back' });

    await fireEvent.press(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
