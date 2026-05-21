import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { PermissionView } from './PermissionView';

describe('PermissionView Component', () => {
  test('renders the provided text message correctly', async () => {
    const mockRequestPermission = jest.fn();
    const testMessage = 'We need access to your camera to take photos.';

    await render(<PermissionView text={testMessage} requestPermission={mockRequestPermission} />);

    expect(screen.getByText(testMessage)).toBeOnTheScreen();
  });

  test('renders the grant permission button', async () => {
    const mockRequestPermission = jest.fn();

    await render(<PermissionView text="Test message" requestPermission={mockRequestPermission} />);

    expect(screen.getByText('Grant Permission')).toBeOnTheScreen();
  });

  test('calls requestPermission function exactly once when the button is pressed', async () => {
    const mockRequestPermission = jest.fn();

    await render(<PermissionView text="Test message" requestPermission={mockRequestPermission} />);

    const button = screen.getByText('Grant Permission');

    await fireEvent.press(button);

    expect(mockRequestPermission).toHaveBeenCalledTimes(1);
  });
});
