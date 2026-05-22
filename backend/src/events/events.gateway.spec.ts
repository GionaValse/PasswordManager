import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from 'src/otp/otp.service';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

describe('EventsGateway', () => {
  let gateway: EventsGateway;
  let eventsService: jest.Mocked<Partial<EventsService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;
  let otpService: jest.Mocked<Partial<OtpService>>;

  const mockUserId = 'user-123';
  const mockPayload = { sub: mockUserId };
  const mockOtpStatus = { ttl: 15000, maxTtl: 30000 };

  const createMockClient = (id: string, token?: string) =>
    ({
      id,
      handshake: {
        auth: { token },
        headers: { 'user-agent': 'Test Agent' },
        address: '127.0.0.1',
      },
      data: {},
      emit: jest.fn(),
      disconnect: jest.fn(),
    }) as any;

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
    sockets: new Map(),
  } as any;

  beforeEach(async () => {
    eventsService = {
      addSession: jest.fn(),
      getUserSockets: jest.fn(),
      removeSession: jest.fn(),
      clearAllUserSessions: jest.fn(),
    };

    jwtService = {
      verify: jest.fn(),
    };

    otpService = {
      getInitialStatus: jest.fn().mockReturnValue(mockOtpStatus),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsGateway,
        { provide: EventsService, useValue: eventsService },
        { provide: JwtService, useValue: jwtService },
        { provide: OtpService, useValue: otpService },
      ],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
    gateway.server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockServer.sockets.clear();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should disconnect if no token is provided', () => {
      const client = createMockClient('socket-1', undefined);

      gateway.handleConnection(client);

      expect(client.emit).toHaveBeenCalledWith('error', 'unauthorized');
      expect(client.disconnect).toHaveBeenCalled();
    });

    it('should disconnect if token is invalid', () => {
      const client = createMockClient('socket-1', 'invalid-token');
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid');
      });

      gateway.handleConnection(client);

      expect(client.emit).toHaveBeenCalledWith('error', 'unauthorized');
      expect(client.disconnect).toHaveBeenCalled();
    });

    it('should authenticate, add session, notify other sockets, and sync OTP', () => {
      const client = createMockClient('socket-1', 'valid-token');
      jwtService.verify.mockReturnValue(mockPayload as any);
      eventsService.getUserSockets.mockReturnValue(['socket-old']);

      gateway.handleConnection(client);

      expect(client.data.user).toEqual(mockPayload);
      expect(eventsService.addSession).toHaveBeenCalledWith(
        mockUserId,
        'socket-1',
        expect.any(Object),
      );

      expect(mockServer.to).toHaveBeenCalledWith('socket-old');
      expect(mockServer.emit).toHaveBeenCalledWith('new_session_alert', expect.any(Object));

      expect(otpService.getInitialStatus).toHaveBeenCalled();
      expect(client.emit).toHaveBeenCalledWith('otp_syncronize', mockOtpStatus);
    });
  });

  describe('handleDisconnect', () => {
    it('should remove session and notify others if user was authenticated', () => {
      const client = createMockClient('socket-1');
      client.data.user = mockPayload;

      eventsService.getUserSockets.mockReturnValue(['socket-2']);

      gateway.handleDisconnect(client);

      expect(eventsService.removeSession).toHaveBeenCalledWith(mockUserId, 'socket-1');
      expect(mockServer.to).toHaveBeenCalledWith('socket-2');
      expect(mockServer.emit).toHaveBeenCalledWith('close_session_alert', expect.any(Object));
    });

    it('should do nothing if client was not authenticated', () => {
      const client = createMockClient('socket-1');

      gateway.handleDisconnect(client);

      expect(eventsService.removeSession).not.toHaveBeenCalled();
    });
  });

  describe('handeLogout (Request Logout)', () => {
    it('should return error if user is not identified', () => {
      const client = createMockClient('socket-1');
      const result = gateway.handeLogout(client, 'target-socket');

      expect(result.status).toBe('error');
    });

    it('should return error if target session is not found', () => {
      const client = createMockClient('socket-1');
      client.data.user = mockPayload;

      const result = gateway.handeLogout(client, 'target-socket');

      expect(result.status).toBe('error');
      expect(result.message).toBe('Session not found');
    });

    it('should force logout the target socket and remove session', () => {
      const client = createMockClient('socket-1');
      client.data.user = mockPayload;

      const targetSocket = createMockClient('target-socket');
      mockServer.sockets.set('target-socket', targetSocket);

      const result = gateway.handeLogout(client, 'target-socket');

      expect(mockServer.to).toHaveBeenCalledWith('target-socket');
      expect(mockServer.emit).toHaveBeenCalledWith('force_logout', expect.any(Object));
      expect(targetSocket.disconnect).toHaveBeenCalledWith(true);
      expect(eventsService.removeSession).toHaveBeenCalledWith(mockUserId, 'target-socket');
      expect(result.status).toBe('success');
    });
  });

  describe('handleGlobalLogout', () => {
    it('should force logout all sockets of the user', () => {
      const client = createMockClient('socket-1');
      client.data.user = mockPayload;

      eventsService.getUserSockets.mockReturnValue(['socket-1', 'socket-2']);

      const targetSocket1 = createMockClient('socket-1');
      const targetSocket2 = createMockClient('socket-2');
      mockServer.sockets.set('socket-1', targetSocket1);
      mockServer.sockets.set('socket-2', targetSocket2);

      const result = gateway.handleGlobalLogout(client);

      expect(mockServer.to).toHaveBeenCalledWith('socket-1');
      expect(mockServer.to).toHaveBeenCalledWith('socket-2');
      expect(mockServer.emit).toHaveBeenCalledWith('force_logout', expect.any(Object));

      expect(targetSocket1.disconnect).toHaveBeenCalledWith(true);
      expect(targetSocket2.disconnect).toHaveBeenCalledWith(true);

      expect(eventsService.clearAllUserSessions).toHaveBeenCalledWith(mockUserId);
      expect(result.status).toBe('success');
    });
  });

  describe('handleOtpRotatedEvent', () => {
    it('should broadcast otp_rotated event to all connected clients', () => {
      const mockPayloadEventEmitter = { maxTtl: 30000 };

      gateway.handleOtpRotatedEvent(mockPayloadEventEmitter);

      expect(mockServer.emit).toHaveBeenCalledWith(
        'otp_rotated',
        expect.objectContaining({
          message: 'OTP codes have been rotated.',
          maxTtl: 30000,
          time: expect.any(Date),
        }),
      );
    });
  });
});
