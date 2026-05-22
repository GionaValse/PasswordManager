import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { OtpContext } from 'shared-password-manager/context';
import { useSocket } from 'shared-password-manager/hooks';

interface OtpProviderProps {
  children?: React.ReactNode;
}

export function OtpProvider({ children }: OtpProviderProps) {
  const [otpTTL, setOtpTTL] = useState(0);
  const [otpMaxTTL, setOtpMaxTTL] = useState(0);

  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleOtpUpdate = ({ ttl, maxTtl }: { ttl: number; maxTtl: number }) => {
      setOtpTTL(ttl);
      setOtpMaxTTL(maxTtl);

      if (ttl <= 0 && queryClient) {
        // Invalidate OTP-related queries when the OTP expires
        queryClient.invalidateQueries({ queryKey: ['passwords'] });
      }
    };

    socket.on('otp-update', handleOtpUpdate);

    return () => {
      socket.off('otp-update', handleOtpUpdate);
    };
  }, [socket, queryClient]);

  return <OtpContext.Provider value={{ otpTTL, otpMaxTTL }}>{children}</OtpContext.Provider>;
}
