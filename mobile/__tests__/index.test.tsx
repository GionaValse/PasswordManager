import Home from '@/app/index';
import { PasswordService } from '@/services/password/password-service';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { QrCodeDTO } from 'shared-password-manager/models';

jest.mock('@/services/password/password-service', () => ({
  PasswordService: {
    getAll: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('expo-router', () => {
  const React = require('react');
  return {
    useRouter: jest.fn(),
    useFocusEffect: jest.fn((callback) => {
      React.useEffect(() => {
        return callback();
      }, [callback]);
    }),
  };
});

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return {
    KeyRoundIcon: () => <View testID="icon-key" />,
    QrCodeIcon: () => <View testID="icon-qr" />,
    Trash2Icon: () => <View testID="icon-trash" />,
  };
});

describe('Home Screen (index.tsx)', () => {
  const mockPush = jest.fn();

  const mockPasswords: QrCodeDTO[] = [
    { id: '1', service: 'My Bank', username: 'user1', password: 'pwd', website: 'bank.com' },
    { id: '2', service: 'GitHub', username: 'dev', password: '123' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('renders the empty state when no passwords are found', async () => {
    (PasswordService.getAll as jest.Mock).mockResolvedValueOnce([]);

    render(<Home />);

    expect(screen.getByTestId('test-loading-view')).toBeOnTheScreen();

    await waitFor(() => {
      expect(screen.queryByTestId('test-loading-view')).not.toBeOnTheScreen();
    });

    expect(screen.getByText('No password saved.')).toBeOnTheScreen();
    expect(screen.getByText('Scan a QR code to get started!')).toBeOnTheScreen();
  });

  test('renders the list of passwords when data is available', async () => {
    (PasswordService.getAll as jest.Mock).mockResolvedValueOnce(mockPasswords);

    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByTestId('test-loading-view')).not.toBeOnTheScreen();
    });

    expect(screen.getByText('My Bank')).toBeOnTheScreen();
    expect(screen.getByText('GitHub')).toBeOnTheScreen();
    expect(screen.getByText('user1')).toBeOnTheScreen();
  });

  test('navigates to the scan screen when the FAB is pressed', async () => {
    (PasswordService.getAll as jest.Mock).mockResolvedValueOnce([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByTestId('test-loading-view')).not.toBeOnTheScreen();
    });

    const fabIcon = screen.getByTestId('icon-qr');
    fireEvent.press(fabIcon);

    expect(mockPush).toHaveBeenCalledWith('/scan');
  });

  test('navigates to the view details screen with stringified params when a password is clicked', async () => {
    (PasswordService.getAll as jest.Mock).mockResolvedValueOnce(mockPasswords);

    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByTestId('test-loading-view')).not.toBeOnTheScreen();
    });

    const bankItem = screen.getByText('My Bank');
    fireEvent.press(bankItem);

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/view',
      params: { qrData: JSON.stringify(mockPasswords[0]) },
    });
  });

  test('deletes a password and reloads the list when the trash icon is pressed', async () => {
    (PasswordService.getAll as jest.Mock)
      .mockResolvedValueOnce([mockPasswords[0]])
      .mockResolvedValueOnce([]);

    render(<Home />);

    await waitFor(() => expect(screen.queryByTestId('test-loading-view')).not.toBeOnTheScreen());

    const trashIcon = screen.getByTestId('icon-trash');
    fireEvent.press(trashIcon);
    expect(PasswordService.delete).toHaveBeenCalledWith('1');

    await waitFor(() => expect(screen.queryByTestId('test-loading-view')).not.toBeOnTheScreen());

    expect(screen.getByText('No password saved.')).toBeOnTheScreen();
  });

  test('handles errors during loadPasswords gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (PasswordService.getAll as jest.Mock).mockRejectedValueOnce(new Error('Database corrupted!'));

    render(<Home />);

    await waitFor(() => expect(screen.queryByTestId('test-loading-view')).not.toBeOnTheScreen());

    expect(screen.getByText('No password saved.')).toBeOnTheScreen();
    expect(consoleSpy).toHaveBeenCalledWith('Error while loading passwords:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
