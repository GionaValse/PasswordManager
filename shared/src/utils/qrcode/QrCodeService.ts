import type { PasswordResponseDto } from '../../api';
import { type QrCodeDTO } from '../../models/QrCodeDTO';

export const QrCodeService = {
  parseAndValidate(rawQrData: string): QrCodeDTO {
    try {
      const parsedData = JSON.parse(rawQrData);

      if (!parsedData.id || !parsedData.service || !parsedData.username || !parsedData.password) {
        throw new Error('Invalid QR Code format.');
      }

      return parsedData as QrCodeDTO;
    } catch (error) {
      throw new Error('Invalid QR Code.', { cause: error });
    }
  },
  getQrCodeFromPassword(data: PasswordResponseDto): QrCodeDTO {
    return { ...data };
  },
};
