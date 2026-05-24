import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PasswordResponseDto } from 'shared-password-manager/api';
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

  const startLocalCountdown = useCallback((initialTtl: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const targetEndTime = Date.now() + initialTtl;
    setOtpTTL(initialTtl);

    timerRef.current = setInterval(() => {
      const remainingTtl = targetEndTime - Date.now();

      if (remainingTtl <= 0) {
        setOtpTTL(0);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setOtpTTL(remainingTtl);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleOtpSynchronize = ({ ttl, maxTtl }: { ttl: number; maxTtl: number }) => {
      setOtpMaxTTL(maxTtl);
      startLocalCountdown(ttl);
    };

    const handleOtpRotated = ({
      maxTtl,
      codes,
    }: {
      maxTtl: number;
      codes: Record<string, string>;
    }) => {
      setOtpMaxTTL(maxTtl);

      Object.entries(codes).forEach(([passwordId, newOtpCode]) => {
        queryClient.setQueryData(['password', passwordId], (oldData: PasswordResponseDto) => {
          if (!oldData) return oldData;
          return { ...oldData, otpCode: newOtpCode };
        });
      });

      queryClient.invalidateQueries({ queryKey: ['passwords'], refetchType: 'none' });

      startLocalCountdown(maxTtl);
    };

    socket.on('otp_syncronize', handleOtpSynchronize);
    socket.on('otp_rotated', handleOtpRotated);

    if (socket.connected) {
      socket.emit('request_otp_sync');
    } else {
      socket.on('connect', () => {
        socket.emit('request_otp_sync');
      });
    }

    return () => {
      socket.off('otp_syncronize', handleOtpSynchronize);
      socket.off('otp_rotated', handleOtpRotated);
      socket.off('connect');

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [socket, queryClient, startLocalCountdown]);

  return <OtpContext.Provider value={{ otpTTL, otpMaxTTL }}>{children}</OtpContext.Provider>;
}
