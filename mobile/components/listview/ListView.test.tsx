import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { ListItemView, ListView } from './ListView';

describe('ListView Component', () => {
  test('renders children correctly', async () => {
    await render(
      <ListView>
        <Text>Child Item 1</Text>
        <Text>Child Item 2</Text>
      </ListView>,
    );

    expect(screen.getByText('Child Item 1')).toBeOnTheScreen();
    expect(screen.getByText('Child Item 2')).toBeOnTheScreen();
  });
});

describe('ListItemView Component', () => {
  test('renders the title correctly', async () => {
    await render(<ListItemView title="My Title" />);

    expect(screen.getByText('My Title')).toBeOnTheScreen();
  });

  test('renders the subtitle when provided', async () => {
    await render(<ListItemView title="My Title" subtitle="My Subtitle" />);

    expect(screen.getByText('My Subtitle')).toBeOnTheScreen();
  });

  test('calls onItemClick function exactly once when pressed', async () => {
    const mockOnClick = jest.fn();

    await render(<ListItemView title="Clickable Item" onItemClick={mockOnClick} />);

    const item = screen.getByText('Clickable Item');
    await fireEvent.press(item);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('renders the icon when provided', async () => {
    await render(<ListItemView title="Item with Icon" icon={<View testID="list-item-icon" />} />);

    expect(screen.getByTestId('list-item-icon')).toBeOnTheScreen();
  });

  test('renders extras correctly', async () => {
    await render(
      <ListItemView
        title="Item with Extras"
        extras={[<Text key="extra-1">Extra One</Text>, <Text key="extra-2">Extra Two</Text>]}
      />,
    );

    expect(screen.getByText('Extra One')).toBeOnTheScreen();
    expect(screen.getByText('Extra Two')).toBeOnTheScreen();
  });

  test('renders correctly when isSelected is true', async () => {
    await render(<ListItemView title="Selected Item" isSelected={true} />);

    expect(screen.getByText('Selected Item')).toBeOnTheScreen();
  });
});
