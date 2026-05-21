import { useThemeColors } from '@/hooks/use-theme-color';
import { cloneElement, isValidElement, ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { StyleableChildProps } from '../StyleableChildProps';

interface FabButtonProps {
  icon: ReactNode;
  onPress: () => void;
}

export function FabButton({ icon, onPress }: FabButtonProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: colors.primary }]}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
    >
      {isValidElement(icon)
        ? cloneElement(icon as React.ReactElement<StyleableChildProps>, {
            size: 26,
            color: colors.onPrimary,
          })
        : icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 64,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
