import { createContext } from 'react';

interface OtpContextType {
  otpTTL: number;
  otpMaxTTL: number;
}

export const OtpContext = createContext<OtpContextType | undefined>(undefined);
