import { useThemeColors } from '@/hooks/use-theme-color';
import { cloneElement, isValidElement, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StyleableChildProps } from '../StyleableChildProps';

interface EmptyViewProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  isError?: boolean;
}

export function EmptyView({ title, subtitle, icon, isError = false }: EmptyViewProps) {
  const colors = useThemeColors();
  const activeColor = isError ? colors.error : colors.textMuted;

  return (
    <View style={styles.center}>
      {isValidElement(icon)
        ? cloneElement(icon as React.ReactElement<StyleableChildProps>, {
            size: 48,
            color: activeColor,
            style: { marginBottom: 16 },
          })
        : icon}
      <Text style={[styles.title, { color: activeColor }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: activeColor }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
