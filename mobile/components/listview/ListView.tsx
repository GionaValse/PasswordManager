import { Fonts } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-color';
import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ListViewProps {
  children: ReactNode;
}

export function ListView({ children }: ListViewProps) {
  return <View style={styles.listView}>{children}</View>;
}

interface ListItemViewProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  isSelected?: boolean;
  onItemClick?: () => void;
  extras?: ReactNode[];
}

export function ListItemView({
  title,
  subtitle,
  icon,
  isSelected = false,
  onItemClick,
  extras = [],
}: ListItemViewProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onItemClick}
      style={[
        styles.listItemView,
        subtitle && styles.withSubtitle,
        isSelected && { backgroundColor: colors.listItemHover },
      ]}
    >
      {isSelected && (
        <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
      )}
      {icon && <View style={styles.listItemIcon}>{icon}</View>}
      <View style={styles.listItemInfo}>
        <Text
          style={[styles.listItemTitle, { color: colors.onBackground, fontFamily: Fonts.sans }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.listItemSubtitle, { color: colors.textMuted, fontFamily: Fonts.sans }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {extras.length > 0 && (
        <View style={styles.extrasContainer}>
          {extras.map((item, index) => (
            <View key={index}>{item}</View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'column',
    gap: 3,
  },
  listItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 48,
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  withSubtitle: {
    height: 72,
  },
  selectedIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  listItemIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  listItemInfo: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemSubtitle: {
    fontSize: 14,
  },
  extrasContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});
