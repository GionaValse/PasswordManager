import FloatNavButton from '@/components/floatnavbutton/FloatNavButton';
import { PermissionView } from '@/components/permissionview/PermissionView';
import ScannerView from '@/components/scannerview/ScannerView';
import { useThemeColors } from '@/hooks/use-theme-color';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { QrCodeService } from 'shared-password-manager/utils';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const colors = useThemeColors();

  if (!permission) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  if (!permission.granted) {
    return (
      <PermissionView
        text="We need permission to use the camera to scan the QR Code"
        requestPermission={requestPermission}
      />
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);

    try {
      const parsedData = QrCodeService.parseAndValidate(data);

      router.push({
        pathname: '/details',
        params: { qrData: JSON.stringify(parsedData) },
      });
    } catch (e: unknown) {
      alert((e as Error).message);
      setTimeout(() => setScanned(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      <ScannerView />
      <FloatNavButton onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
