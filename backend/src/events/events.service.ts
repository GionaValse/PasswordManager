import { Injectable } from '@nestjs/common';
import { EventSessionDto } from './events.dto';

@Injectable()
export class EventsService {
  private usersSockets: Map<string, Map<string, EventSessionDto>> = new Map();

  addSession(userId: string, socketId: string, metadata: Omit<EventSessionDto, 'socketId'>) {
    if (!this.usersSockets.has(userId)) {
      this.usersSockets.set(userId, new Map());
    }
    this.usersSockets.get(userId)?.set(socketId, { ...metadata, socketId });
  }

  getUserSockets(userId: string): string[] {
    const sockets = this.usersSockets.get(userId);
    if (!sockets) return [];
    return Array.from(sockets.keys());
  }

  getUserSessions(userId: string): EventSessionDto[] {
    const sockets = this.usersSockets.get(userId);
    if (!sockets) return [];
    return Array.from(sockets.values());
  }

  removeSession(userId: string, socketId: string) {
    const sockets = this.usersSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.usersSockets.delete(userId);
      }
    }
  }

  clearAllUserSessions(userId: string) {
    this.usersSockets.delete(userId);
  }
}
