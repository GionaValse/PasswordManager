import DetailsScreen from '@/app/details';
import { PasswordService } from '@/services/password/password-service';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import { QrCodeDTO } from 'shared-password-manager/models';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock('@/services/password/password-service', () => ({
  PasswordService: {
    save: jest.fn(),
  },
}));

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return {
    AlertTriangleIcon: () => <View testID="icon-alert" />,
    SaveIcon: () => <View testID="icon-save" />,
    XCircleIcon: () => <View testID="icon-x" />,
  };
});

jest.mock('@/components/ticketview/TicketView', () => {
  const { View, Text } = require('react-native');
  return {
    TicketView: ({ data }: any) => (
      <View testID="ticket-view">
        <Text>{data?.service}</Text>
        {data?.website && <Text>{data.website}</Text>}
      </View>
    ),
  };
});

describe('DetailsScreen Component', () => {
  const mockBack = jest.fn();
  const mockDismissAll = jest.fn();

  const validQrData: QrCodeDTO = {
    id: 'test-123',
    service: 'Test Service',
    username: 'test_user',
    password: 'superSecretPassword',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
      dismissAll: mockDismissAll,
    });
  });

  test('renders the error state if qrData is missing or invalid', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({});

    await render(<DetailsScreen />);

    expect(screen.getByText('Unable to load data.')).toBeOnTheScreen();
    expect(screen.getByTestId('icon-alert')).toBeOnTheScreen();
  });

  test('renders the ticket view and action buttons when valid qrData is provided', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      qrData: JSON.stringify(validQrData),
    });

    await render(<DetailsScreen />);

    expect(screen.getByText('Cancel')).toBeOnTheScreen();
    expect(screen.getByText('Save')).toBeOnTheScreen();
    expect(screen.getByText('Test Service')).toBeOnTheScreen();
  });

  test('navigates back when the Cancel button is pressed', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      qrData: JSON.stringify(validQrData),
    });

    await render(<DetailsScreen />);

    const cancelButton = screen.getByText('Cancel');
    await fireEvent.press(cancelButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  test('saves the password and dismisses all screens when the Save button is pressed', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      qrData: JSON.stringify(validQrData),
    });

    await render(<DetailsScreen />);

    const saveButton = screen.getByText('Save');
    await fireEvent.press(saveButton);

    expect(PasswordService.save).toHaveBeenCalledWith(validQrData);
    expect(mockDismissAll).toHaveBeenCalledTimes(1);
  });

  test('shows an alert and logs an error if saving the password fails', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      qrData: JSON.stringify(validQrData),
    });

    (PasswordService.save as jest.Mock).mockRejectedValueOnce(new Error('Database full'));

    await render(<DetailsScreen />);

    const saveButton = screen.getByText('Save');
    await fireEvent.press(saveButton);

    expect(PasswordService.save).toHaveBeenCalledWith(validQrData);
    expect(consoleSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Error', 'Unable to save the password.');
    expect(mockDismissAll).not.toHaveBeenCalled();

    alertSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
