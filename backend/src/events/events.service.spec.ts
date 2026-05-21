import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;

  const mockUserId = 'user-123';
  const mockSocketId1 = 'socket-001';
  const mockSocketId2 = 'socket-002';

  const mockMetadata = {
    userAgent: 'Mozilla/5.0',
    ip: '127.0.0.1',
    connectedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addSession and getUserSockets', () => {
    it('should add a session and return the socket ID', () => {
      service.addSession(mockUserId, mockSocketId1, mockMetadata);

      const sockets = service.getUserSockets(mockUserId);
      expect(sockets).toContain(mockSocketId1);
      expect(sockets.length).toBe(1);
    });

    it('should handle multiple sessions for the same user', () => {
      service.addSession(mockUserId, mockSocketId1, mockMetadata);
      service.addSession(mockUserId, mockSocketId2, mockMetadata);

      const sockets = service.getUserSockets(mockUserId);
      expect(sockets.length).toBe(2);
      expect(sockets).toEqual([mockSocketId1, mockSocketId2]);
    });

    it('should return empty array for unknown user', () => {
      const sockets = service.getUserSockets('unknown-user');
      expect(sockets).toEqual([]);
    });
  });

  describe('getUserSessions', () => {
    it('should return full session objects', () => {
      service.addSession(mockUserId, mockSocketId1, mockMetadata);

      const sessions = service.getUserSessions(mockUserId);
      expect(sessions.length).toBe(1);
      expect(sessions[0].socketId).toBe(mockSocketId1);
      expect(sessions[0].ip).toBe(mockMetadata.ip);
    });
  });

  describe('removeSession', () => {
    it('should remove a specific session', () => {
      service.addSession(mockUserId, mockSocketId1, mockMetadata);
      service.addSession(mockUserId, mockSocketId2, mockMetadata);

      service.removeSession(mockUserId, mockSocketId1);

      const sockets = service.getUserSockets(mockUserId);
      expect(sockets).toEqual([mockSocketId2]);
    });

    it('should remove the user completely if no sessions are left', () => {
      service.addSession(mockUserId, mockSocketId1, mockMetadata);
      service.removeSession(mockUserId, mockSocketId1);

      const map = (service as any).usersSockets;
      expect(map.has(mockUserId)).toBe(false);
    });
  });

  describe('clearAllUserSessions', () => {
    it('should remove all sessions for a user', () => {
      service.addSession(mockUserId, mockSocketId1, mockMetadata);
      service.addSession(mockUserId, mockSocketId2, mockMetadata);

      service.clearAllUserSessions(mockUserId);

      const sockets = service.getUserSockets(mockUserId);
      expect(sockets).toEqual([]);
    });
  });
});
