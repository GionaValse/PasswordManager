import { EmptyView } from '@/components/emptyview/EmptyView';
import { FabButton } from '@/components/fabbutton/FabButton';
import { ListItemView, ListView } from '@/components/listview/ListView';
import { useThemeColors } from '@/hooks/use-theme-color';
import { PasswordService } from '@/services/password/password-service';
import { useFocusEffect, useRouter } from 'expo-router';
import { KeyRoundIcon, QrCodeIcon, Trash2Icon } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { QrCodeDTO } from 'shared-password-manager/models';

export default function Home() {
  const colors = useThemeColors();
  const router = useRouter();

  const [passwords, setPasswords] = useState<QrCodeDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPasswords = async () => {
    setIsLoading(true);
    try {
      const loadedPasswords: QrCodeDTO[] = await PasswordService.getAll();
      setPasswords(loadedPasswords);
    } catch (e) {
      console.error('Error while loading passwords:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPasswords();
    }, []),
  );

  const deletePassword = async (id: string) => {
    await PasswordService.delete(id);
    loadPasswords();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View testID="test-loading-view" style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : passwords.length === 0 ? (
        <EmptyView
          title="No password saved."
          subtitle="Scan a QR code to get started!"
          icon={<KeyRoundIcon />}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ListView>
            {passwords.map((item) => (
              <ListItemView
                key={item.id}
                title={item.service}
                subtitle={item.username}
                icon={<KeyRoundIcon size={20} color={colors.primary} />}
                onItemClick={() => {
                  router.push({ pathname: '/view', params: { qrData: JSON.stringify(item) } });
                }}
                extras={[
                  <TouchableOpacity key="del" onPress={() => deletePassword(item.id)}>
                    <Trash2Icon size={18} color={colors.error} />
                  </TouchableOpacity>,
                ]}
              />
            ))}
          </ListView>
        </ScrollView>
      )}
      <FabButton icon={<QrCodeIcon />} onPress={() => router.push('/scan')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  scrollContent: { paddingVertical: 16 },
});
