import { ActionContainer } from '@/components/actioncontainer/ActionContainer';
import { Button } from '@/components/button/Button';
import { EmptyView } from '@/components/emptyview/EmptyView';
import ScrollContainer from '@/components/scrollcontainer/ScrollContainer';
import { TicketView } from '@/components/ticketview/TicketView';
import { useThemeColors } from '@/hooks/use-theme-color';
import { PasswordService } from '@/services/password/password-service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertTriangleIcon, SaveIcon, XCircleIcon } from 'lucide-react-native';
import { Alert } from 'react-native';
import type { QrCodeDTO } from 'shared-password-manager/models';

export default function DetailsScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const { qrData } = useLocalSearchParams<{ qrData: string }>();
  const data: QrCodeDTO | null = qrData ? JSON.parse(qrData) : null;

  if (!data) {
    return <EmptyView icon={<AlertTriangleIcon />} title="Unable to load data." isError={true} />;
  }

  const handleSave = async () => {
    try {
      await PasswordService.save(data);
      router.dismissAll();
    } catch (error) {
      console.error('Error while saving the password:', error);
      Alert.alert('Error', 'Unable to save the password.');
    }
  };

  return (
    <ScrollContainer>
      <TicketView data={data} />
      <ActionContainer>
        <Button
          title="Cancel"
          variant="outline"
          icon={<XCircleIcon size={20} color={colors.textMuted} />}
          onPress={() => router.back()}
        />
        <Button
          title="Save"
          variant="primary"
          icon={<SaveIcon size={20} color={colors.onPrimary} />}
          onPress={handleSave}
        />
      </ActionContainer>
    </ScrollContainer>
  );
}
