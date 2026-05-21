import { useThemeColors } from '@/hooks/use-theme-color';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

interface ScrollContainerProps {
  children: ReactNode;
}

export default function ScrollContainer({ children }: ScrollContainerProps) {
  const colors = useThemeColors();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
  },
});
