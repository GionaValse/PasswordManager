import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { ActionContainer } from './ActionContainer';

describe('ActionContainer Component', () => {
  test('renders its children correctly', async () => {
    await render(
      <ActionContainer>
        <Text>Action 1</Text>
        <Text>Action 2</Text>
      </ActionContainer>,
    );

    expect(screen.getByText('Action 1')).toBeOnTheScreen();
    expect(screen.getByText('Action 2')).toBeOnTheScreen();
  });

  test('applies flex: 1 to its valid React element children', async () => {
    await render(
      <ActionContainer>
        <View testID="child-view" />
      </ActionContainer>,
    );

    const child = screen.getByTestId('child-view');

    expect(child).toHaveStyle({ flex: 1 });
  });

  test('preserves existing styles on children while appending flex: 1', async () => {
    await render(
      <ActionContainer>
        <View testID="styled-child" style={{ backgroundColor: 'red', padding: 10 }} />
      </ActionContainer>,
    );

    const child = screen.getByTestId('styled-child');

    expect(child).toHaveStyle({
      backgroundColor: 'red',
      padding: 10,
      flex: 1,
    });
  });

  test('ignores invalid React elements (like booleans or null) without crashing', async () => {
    const showExtra = false;

    await render(
      <ActionContainer>
        <Text>Main Action</Text>
        {showExtra && <Text>Hidden Action</Text>}
        {null}
      </ActionContainer>,
    );

    expect(screen.getByText('Main Action')).toBeOnTheScreen();
    expect(screen.queryByText('Hidden Action')).toBeNull();
  });
});
