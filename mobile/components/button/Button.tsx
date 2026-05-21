import { useThemeColors } from '@/hooks/use-theme-color';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: ReactNode;
  variant?: 'primary' | 'outline';
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, onPress, icon, variant = 'primary', style }: ButtonProps) {
  const colors = useThemeColors();
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.base,
        isPrimary
          ? [styles.primary, { backgroundColor: colors.primary }]
          : [styles.outline, { borderColor: colors.divider }],
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, { color: isPrimary ? colors.onPrimary : colors.textMuted }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primary: {
    shadowColor: '#357DED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  outline: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
