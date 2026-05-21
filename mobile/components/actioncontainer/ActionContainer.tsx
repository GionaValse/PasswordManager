import { Children, cloneElement, isValidElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { StyleableChildProps } from '../StyleableChildProps';

interface ActionContainerProps {
  children: ReactNode;
}

export function ActionContainer({ children }: ActionContainerProps) {
  return (
    <View style={styles.container}>
      {Children.map(children, (child) => {
        if (isValidElement<StyleableChildProps>(child)) {
          return cloneElement(child, {
            style: [child.props.style, { flex: 1 }],
          });
        }
        return child;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
});
