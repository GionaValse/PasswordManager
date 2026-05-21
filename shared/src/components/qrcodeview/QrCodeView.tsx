import { useQuery } from '@tanstack/react-query';
import QRCode, { type QRCodeToDataURLOptions } from 'qrcode';
import { LoadingView } from '../loadingview/LoadingView';
import styles from './QrCodeView.module.css';

interface QrCodeViewProps {
  url: string;
}

const qrOptions: QRCodeToDataURLOptions = {
  margin: 2,
  errorCorrectionLevel: 'H',
};

export function QrCodeView({ url }: QrCodeViewProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['qrcode', url],
    queryFn: () => QRCode.toDataURL(url, qrOptions),
  });

  return (
    <div className={styles.qrCodeContainer}>
      {isLoading ? (
        <LoadingView />
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        <img className={styles.qrCodeImage} src={data} alt="QR Code" />
      )}
    </div>
  );
}
