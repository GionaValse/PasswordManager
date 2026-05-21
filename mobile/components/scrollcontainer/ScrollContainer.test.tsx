import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import ScrollContainer from './ScrollContainer';

describe('ScrollContainer Component', () => {
  test('renders its children correctly', async () => {
    await render(
      <ScrollContainer>
        <Text>First Content Block</Text>
        <View testID="second-content-block" />
      </ScrollContainer>,
    );

    expect(screen.getByText('First Content Block')).toBeOnTheScreen();
    expect(screen.getByTestId('second-content-block')).toBeOnTheScreen();
  });

  test('renders multiple children without crashing', async () => {
    await render(
      <ScrollContainer>
        <Text>Item A</Text>
        <Text>Item B</Text>
        <Text>Item C</Text>
      </ScrollContainer>,
    );

    expect(screen.getByText('Item A')).toBeOnTheScreen();
    expect(screen.getByText('Item B')).toBeOnTheScreen();
    expect(screen.getByText('Item C')).toBeOnTheScreen();
  });
});
