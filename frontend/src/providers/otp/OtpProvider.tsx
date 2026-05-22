import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startLocalCountdown = useCallback(
    (initialTtl: number) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      let currentTtl = initialTtl;
      setOtpTTL(currentTtl);

      timerRef.current = setInterval(() => {
        currentTtl -= 100;

        if (currentTtl <= 0) {
          setOtpTTL(0);
          if (timerRef.current) clearInterval(timerRef.current);

          queryClient.invalidateQueries({ queryKey: ['passwords'] });
          queryClient.invalidateQueries({ queryKey: ['password'] });
        } else {
          setOtpTTL(currentTtl);
        }
      }, 100);
    },
    [queryClient],
  );

  useEffect(() => {
    if (!socket) return;

    const handleOtpSynchronize = ({ ttl, maxTtl }: { ttl: number; maxTtl: number }) => {
      setOtpMaxTTL(maxTtl);
      startLocalCountdown(ttl);
    };

    const handleOtpRotated = ({ maxTtl }: { maxTtl: number }) => {
      setOtpMaxTTL(maxTtl);

      startLocalCountdown(maxTtl);
    };

    socket.on('otp_syncronize', handleOtpSynchronize);
    socket.on('otp_rotated', handleOtpRotated);

    return () => {
      socket.off('otp_syncronize', handleOtpSynchronize);
      socket.off('otp_rotated', handleOtpRotated);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [socket, startLocalCountdown]);

  return <OtpContext.Provider value={{ otpTTL, otpMaxTTL }}>{children}</OtpContext.Provider>;
}
