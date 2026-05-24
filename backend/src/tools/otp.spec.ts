import { rotateOtpCode } from './otp';

describe('rotateOtpCode', () => {
  const mockPasswordId = '664c92a1e4b0f9a2b1c3d4e5';
  const mockExpiration = 30000;

  it('should be defined', () => {
    expect(rotateOtpCode).toBeDefined();
  });

  it('should return a string of exactly 6 characters', () => {
    const code = rotateOtpCode(mockPasswordId, mockExpiration);

    expect(typeof code).toBe('string');
    expect(code).toHaveLength(6);
  });

  it('should only contain uppercase alphanumeric characters allowed in the pool', () => {
    const code = rotateOtpCode(mockPasswordId, mockExpiration);

    expect(code).toMatch(/^[A-Z0-9]{6}$/);
  });

  it('should be deterministic (return the exact same code for the same inputs)', () => {
    const code1 = rotateOtpCode(mockPasswordId, mockExpiration);
    const code2 = rotateOtpCode(mockPasswordId, mockExpiration);

    expect(code1).toBe(code2);
  });

  it('should generate a completely different code if the expiration timestamp changes', () => {
    const code1 = rotateOtpCode(mockPasswordId, mockExpiration);
    const code2 = rotateOtpCode(mockPasswordId, mockExpiration + 1);

    expect(code1).not.toBe(code2);
  });

  it('should generate different codes for different passwords at the same expiration time', () => {
    const code1 = rotateOtpCode(mockPasswordId, mockExpiration);
    const code2 = rotateOtpCode('another-password-id-123', mockExpiration);

    expect(code1).not.toBe(code2);
  });
});
