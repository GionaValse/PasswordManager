import { useThemeColors } from '@/hooks/use-theme-color';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PermissionViewProps {
  text: string;
  requestPermission: () => void;
}

export const PermissionView = ({ text, requestPermission }: PermissionViewProps) => {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
      ]}
    >
      <Text
        style={{
          color: colors.onBackground,
          fontSize: 18,
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        {text}
      </Text>
      <TouchableOpacity
        style={[styles.permissionButton, { backgroundColor: colors.primary }]}
        onPress={requestPermission}
      >
        <Text style={{ color: colors.onPrimary, fontWeight: 'bold', fontSize: 16 }}>
          Grant Permission
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
});
