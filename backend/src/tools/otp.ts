import * as crypto from 'crypto';

export function rotateOtpCode(passwordId: string, expiration: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const otpLength = 6;

  const saltData = `${passwordId}:${expiration}`;
  const hash = crypto.createHash('sha256').update(saltData).digest('hex');

  let otpCode = '';

  for (let i = 0; i < otpLength; i++) {
    const hexSegment = hash.substring(i * 4, i * 4 + 4);
    const decimalValue = parseInt(hexSegment, 16);

    const charIndex = decimalValue % chars.length;
    otpCode += chars[charIndex];
  }

  return otpCode;
}
