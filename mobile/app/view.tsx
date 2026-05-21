import { ActionContainer } from '@/components/actioncontainer/ActionContainer';
import { Button } from '@/components/button/Button';
import { EmptyView } from '@/components/emptyview/EmptyView';
import ScrollContainer from '@/components/scrollcontainer/ScrollContainer';
import { TicketView } from '@/components/ticketview/TicketView';
import { useThemeColors } from '@/hooks/use-theme-color';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertTriangleIcon, XCircleIcon } from 'lucide-react-native';
import type { QrCodeDTO } from 'shared-password-manager/models';

export default function ViewScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const { qrData } = useLocalSearchParams<{ qrData: string }>();
  const data: QrCodeDTO | null = qrData ? JSON.parse(qrData) : null;

  if (!data) {
    return <EmptyView icon={<AlertTriangleIcon />} title="Unable to load data." isError={true} />;
  }

  return (
    <ScrollContainer>
      <TicketView data={data} />
      <ActionContainer>
        <Button
          title="Close"
          variant="outline"
          icon={<XCircleIcon size={20} color={colors.textMuted} />}
          onPress={() => router.back()}
        />
      </ActionContainer>
    </ScrollContainer>
  );
}
