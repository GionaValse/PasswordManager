import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import { EmptyView } from './EmptyView';

describe('EmptyView Component', () => {
  test('renders the title and icon correctly', async () => {
    await render(<EmptyView title="No data found" icon={<View testID="empty-icon" />} />);

    expect(screen.getByText('No data found')).toBeOnTheScreen();
    expect(screen.getByTestId('empty-icon')).toBeOnTheScreen();
  });

  test('renders the subtitle when provided', async () => {
    await render(
      <EmptyView
        title="No data found"
        subtitle="Please try again later"
        icon={<View testID="empty-icon" />}
      />,
    );

    expect(screen.getByText('Please try again later')).toBeOnTheScreen();
  });

  test('does not render a subtitle if not provided', async () => {
    await render(<EmptyView title="Just a title" icon={<View testID="empty-icon" />} />);

    const subtitle = screen.queryByText('Please try again later');
    expect(subtitle).toBeNull();
  });

  test('injects size, color, and style props into a valid React Element icon', async () => {
    await render(<EmptyView title="Empty" icon={<View testID="empty-icon" />} />);

    const icon = screen.getByTestId('empty-icon');

    expect(icon.props.size).toBe(48);
    expect(icon.props.style).toEqual({ marginBottom: 16 });
    expect(icon.props.color).toBeDefined();
  });

  test('applies the error configuration without crashing when isError is true', async () => {
    await render(
      <EmptyView title="An error occurred" icon={<View testID="error-icon" />} isError={true} />,
    );

    const icon = screen.getByTestId('error-icon');

    expect(screen.getByText('An error occurred')).toBeOnTheScreen();
    expect(icon.props.color).toBeDefined();
  });

  test('renders correctly without a subtitle and with a non-valid element icon', async () => {
    await render(<EmptyView title="Only Title" icon={null as any} />);

    expect(screen.getByText('Only Title')).toBeOnTheScreen();
    expect(screen.queryByText('subtitle')).toBeNull();
  });
});
