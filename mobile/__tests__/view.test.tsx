import ViewScreen from '@/app/view';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { QrCodeDTO } from 'shared-password-manager/models';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return {
    AlertTriangleIcon: () => <View testID="icon-alert" />,
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

describe('ViewScreen Component', () => {
  const mockBack = jest.fn();

  const validQrData: QrCodeDTO = {
    id: 'test-789',
    service: 'Read Only Service',
    username: 'viewer',
    password: 'readOnlyPassword',
    website: 'https://readonly.example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
    });
  });

  test('renders the error state if qrData is missing or invalid', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({});

    await render(<ViewScreen />);

    expect(screen.getByText('Unable to load data.')).toBeOnTheScreen();
    expect(screen.getByTestId('icon-alert')).toBeOnTheScreen();
  });

  test('renders the ticket view and close button when valid qrData is provided', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      qrData: JSON.stringify(validQrData),
    });

    await render(<ViewScreen />);

    expect(screen.getByText('Read Only Service')).toBeOnTheScreen();
    expect(screen.getByText('https://readonly.example.com')).toBeOnTheScreen();
    expect(screen.getByText('Close')).toBeOnTheScreen();
    expect(screen.getByTestId('icon-x')).toBeOnTheScreen();
  });

  test('navigates back when the Close button is pressed', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      qrData: JSON.stringify(validQrData),
    });

    await render(<ViewScreen />);

    const closeButton = screen.getByText('Close');
    await fireEvent.press(closeButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
