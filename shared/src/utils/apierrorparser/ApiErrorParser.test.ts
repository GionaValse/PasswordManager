import { describe, expect, it, vi } from 'vitest';
import { ResponseError } from '../../api';
import { parseApiError } from './ApiErrorParser';

describe('parseApiError', () => {
  const createMockResponseError = (status: number, jsonBody: unknown, isJsonValid = true) => {
    const mockResponse = {
      status,
      json: vi.fn().mockImplementation(() => {
        if (isJsonValid) {
          return Promise.resolve(jsonBody);
        }
        return Promise.reject(new SyntaxError('Unexpected token < in JSON at position 0'));
      }),
    } as unknown as Response;

    return new ResponseError(mockResponse, 'Response Error');
  };

  describe('when the error is a ResponseError (from backend API)', () => {
    it('should parse a NestJS validation error (array of messages)', async () => {
      const errorBody = {
        statusCode: 400,
        message: ['Password is too short', 'Invalid email address'],
        error: 'Bad Request',
      };
      const responseError = createMockResponseError(400, errorBody);

      const result = await parseApiError(responseError);

      expect(result).toEqual({
        message: 'Password is too short, Invalid email address',
        status: 400,
        details: errorBody,
      });
    });

    it('should parse a standard NestJS error (string message)', async () => {
      const errorBody = {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      };
      const responseError = createMockResponseError(404, errorBody);

      const result = await parseApiError(responseError);

      expect(result).toEqual({
        message: 'User not found',
        status: 404,
        details: errorBody,
      });
    });

    it('should fallback to the "error" field if "message" is missing', async () => {
      const errorBody = {
        statusCode: 500,
        error: 'Internal Server Error',
      };
      const responseError = createMockResponseError(500, errorBody);

      const result = await parseApiError(responseError);

      expect(result).toEqual({
        message: 'Internal Server Error',
        status: 500,
        details: errorBody,
      });
    });

    it('should use a generic message if JSON lacks known fields', async () => {
      const errorBody = { someOtherField: 'Something went wrong' };
      const responseError = createMockResponseError(418, errorBody);

      const result = await parseApiError(responseError);

      expect(result).toEqual({
        message: 'Server error occurred',
        status: 418,
        details: errorBody,
      });
    });

    it('should handle non-JSON responses (e.g., 502 Bad Gateway HTML from Nginx)', async () => {
      const responseError = createMockResponseError(502, null, false);

      const result = await parseApiError(responseError);

      expect(result).toEqual({
        message: 'Network error or server unreachable (502)',
        status: 502,
      });
    });
  });

  describe('when the error is NOT a ResponseError', () => {
    it('should handle a standard JavaScript Error (e.g., NetworkError)', async () => {
      const jsError = new Error('Failed to fetch');

      const result = await parseApiError(jsError);

      expect(result).toEqual({
        message: 'Failed to fetch',
      });
    });

    it('should handle a raw string thrown as an error', async () => {
      const stringError = 'Fatal database error';

      const result = await parseApiError(stringError);

      expect(result).toEqual({
        message: 'Fatal database error',
      });
    });

    it('should safely handle unknown types or null', async () => {
      const unknownError = { strange: 'object' };

      const result = await parseApiError(unknownError);

      expect(result).toEqual({
        message: 'An unexpected error occurred',
      });
    });

    it('should safely handle a thrown "null"', async () => {
      const result = await parseApiError(null);

      expect(result).toEqual({
        message: 'An unexpected error occurred',
      });
    });
  });
});
