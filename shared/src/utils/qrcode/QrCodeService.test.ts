import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type QrCodeDTO } from '../../models/QrCodeDTO';
import { QrCodeService } from './QrCodeService';

describe('QrCodeService Utility', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('parseAndValidate', () => {
    it('successfully parses and returns a valid QR Code payload without a website', () => {
      const validPayload: QrCodeDTO = {
        id: 'user-123',
        service: 'GitHub',
        username: 'dev_giona',
        password: 'securePassword123!',
      };

      const rawString = JSON.stringify(validPayload);
      const result = QrCodeService.parseAndValidate(rawString);

      expect(result).toEqual(validPayload);
    });

    it('successfully parses and returns a valid QR Code payload including the optional website', () => {
      const validPayloadWithWebsite: QrCodeDTO = {
        id: 'user-456',
        service: 'My Service',
        website: 'https://myservice.com',
        username: 'giona',
        password: 'password321',
      };

      const rawString = JSON.stringify(validPayloadWithWebsite);
      const result = QrCodeService.parseAndValidate(rawString);

      expect(result).toEqual(validPayloadWithWebsite);
    });

    it('throws an error if the provided string is not a valid JSON', () => {
      const malformedJsonString = '{ "id": "123", "name": "Test", }';

      expect(() => QrCodeService.parseAndValidate(malformedJsonString)).toThrow('Invalid QR Code.');
    });

    it('throws an error if required fields are missing', () => {
      const incompletePayload = {
        id: 'user-789',
        service: 'Incomplete Service',
        username: 'giona',
      };

      const rawString = JSON.stringify(incompletePayload);

      expect(() => QrCodeService.parseAndValidate(rawString)).toThrow('Invalid QR Code.');
    });

    it('throws an error if required fields are present but falsy (e.g. empty strings)', () => {
      const falsyPayload = {
        id: 'user-101',
        service: 'Service',
        username: '',
        password: 'pwd',
      };

      const rawString = JSON.stringify(falsyPayload);

      expect(() => QrCodeService.parseAndValidate(rawString)).toThrow('Invalid QR Code.');
    });
  });

  describe('getQrCodeFromPassword', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {});
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    const mockPassword = {
      id: 'p1',
      service: 'Google',
      username: 'user@test.com',
      website: 'https://google.com',
      password: 'password123',
      favorite: false,
      creationDate: new Date(),
      modifiedDate: new Date(),
    };

    it('should extract correct data format for QR generation', () => {
      const result = QrCodeService.getQrCodeFromPassword(mockPassword as any);
      expect(result).toEqual(mockPassword);
    });
  });
});
