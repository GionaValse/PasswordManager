import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { OtpContext } from '../../context/otp/OtpContext';
import { useOtp } from './OtpHook';

describe('useOtp Custom Hook', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return context value when used within OtpContext', async () => {
    const mockContextValue = {
      otpTTL: vi.fn(),
      otpMaxTTL: vi.fn(),
    } as any;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OtpContext.Provider value={mockContextValue}>{children}</OtpContext.Provider>
    );

    const { result } = await renderHook(() => useOtp(), { wrapper });

    expect(result.current).toBe(mockContextValue);
    expect(result.current.otpTTL).toBe(mockContextValue.otpTTL);
    expect(result.current.otpMaxTTL).toBe(mockContextValue.otpMaxTTL);
  });

  it('should throw an error when used outside of OtpContext', async () => {
    await expect(async () => {
      await renderHook(() => useOtp());
    }).rejects.toThrow('useOtp must be used within an OtpContext');
  });
});
