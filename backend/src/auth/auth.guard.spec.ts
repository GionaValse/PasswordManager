import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<Partial<JwtService>>;

  beforeEach(async () => {
    jwtService = {
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, { provide: JwtService, useValue: jwtService }],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  const createMockExecutionContext = (
    type: 'http' | 'ws',
    requestOrClient: any,
  ): ExecutionContext =>
    ({
      getType: jest.fn().mockReturnValue(type),
      switchToHttp: jest.fn().mockReturnValue({ getRequest: () => requestOrClient }),
      switchToWs: jest.fn().mockReturnValue({ getClient: () => requestOrClient }),
    }) as any;

  describe('HTTP Context', () => {
    it('should throw UnauthorizedException if no token is provided', async () => {
      const mockContext = createMockExecutionContext('http', {
        headers: {},
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const mockContext = createMockExecutionContext('http', {
        headers: { authorization: 'Bearer bad_token' },
      });
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid'));

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should return true and assign user to request if token is valid', async () => {
      const mockRequest: any = {
        headers: { authorization: 'Bearer good_token' },
      };
      const mockContext = createMockExecutionContext('http', mockRequest);
      const mockPayload = { sub: '123' };
      jwtService.verifyAsync.mockResolvedValue(mockPayload as any);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockRequest.user).toEqual(mockPayload);
    });
  });

  describe('WS Context', () => {
    it('should throw UnauthorizedException if no token in handshake', async () => {
      const mockClient = { handshake: { auth: {} }, data: {} };
      const mockContext = createMockExecutionContext('ws', mockClient);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should return true and assign user to client.data if token is valid', async () => {
      const mockClient = {
        handshake: { auth: { token: 'good_token' } },
        data: {} as any,
      };
      const mockContext = createMockExecutionContext('ws', mockClient);
      const mockPayload = { sub: '123' };
      jwtService.verifyAsync.mockResolvedValue(mockPayload as any);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockClient.data.user).toEqual(mockPayload);
    });
  });
});
