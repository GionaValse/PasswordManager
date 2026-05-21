import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { QrCodeDTO } from 'shared-password-manager/models';
import { TicketView } from './TicketView';

const mockTicketData: QrCodeDTO = {
  id: '123-test-id',
  service: 'My Custom Service',
  username: 'johndoe89',
  password: 'superSecretPassword123!',
  website: 'https://myservice.example.com',
};

describe('Ticket Component', () => {
  test('renders basic ticket information correctly', async () => {
    await render(<TicketView data={mockTicketData} />);

    expect(screen.getByText('My Custom Service')).toBeOnTheScreen();
    expect(screen.getByText('johndoe89')).toBeOnTheScreen();
  });

  test('renders the website if provided in the data', async () => {
    await render(<TicketView data={mockTicketData} />);

    expect(screen.getByText('https://myservice.example.com')).toBeOnTheScreen();
  });

  test('does not render website section if website is undefined', async () => {
    const dataWithoutWebsite = { ...mockTicketData, website: undefined };
    await render(<TicketView data={dataWithoutWebsite} />);

    const websiteElement = screen.queryByText('https://myservice.example.com');
    expect(websiteElement).toBeNull();
  });

  test('masks the password by default', async () => {
    await render(<TicketView data={mockTicketData} />);

    expect(screen.queryByText('superSecretPassword123!')).toBeNull();
    expect(screen.getByText('••••••••••••')).toBeOnTheScreen();
  });

  test('toggles password visibility when the eye button is pressed', async () => {
    await render(<TicketView data={mockTicketData} />);

    const toggleButton = screen.getByTestId('toggle-password-button');

    await fireEvent.press(toggleButton);
    expect(screen.getByText('superSecretPassword123!')).toBeOnTheScreen();
    expect(screen.queryByText('••••••••••••')).toBeNull();

    await fireEvent.press(toggleButton);
    expect(screen.queryByText('superSecretPassword123!')).toBeNull();
    expect(screen.getByText('••••••••••••')).toBeOnTheScreen();
  });
});
