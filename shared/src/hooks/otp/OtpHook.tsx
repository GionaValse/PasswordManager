import { useContext } from 'react';
import { OtpContext } from '../../context';

export function useOtp() {
  const context = useContext(OtpContext);
  if (!context) {
    throw new Error('useOtp must be used within an OtpContext');
  }
  return context;
}
