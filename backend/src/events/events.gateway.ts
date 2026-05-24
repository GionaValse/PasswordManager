import { UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/auth.types';
import { OtpEventDto, OtpResponseDto } from 'src/otp/otp.dto';
import { OtpService } from 'src/otp/otp.service';
import { type AuthenticatedSocket } from './events.dto';
import { EventsService } from './events.service';

@UseGuards(AuthGuard)
@WebSocketGateway(parseInt(process.env.WS_PORT || '3001', 10), {
  namespace: 'events',
  cors: true,
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Namespace;

  constructor(
    private jwtService: JwtService,
    private readonly eventsService: EventsService,
    private readonly otpService: OtpService,
  ) {}

  handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    const token = client.handshake?.auth?.token as string | undefined;
    const userAgent = client.handshake.headers['user-agent'] || 'Unknown device';
    const ipAddress = client.handshake.address;

    if (!token) {
      client.emit('error', 'unauthorized');
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      console.log('Valid token: ', payload);
      client.data.user = payload;

      const userSockets = this.eventsService.getUserSockets(payload.sub);
      this.eventsService.addSession(payload.sub, client.id, {
        userAgent: userAgent,
        ip: ipAddress,
        connectedAt: new Date(),
      });

      userSockets.forEach((socketId) => {
        this.server.to(socketId).emit('new_session_alert', {
          message: 'A new device has signed in to your account.',
          time: new Date(),
        });
      });

      const otpStatus = this.otpService.getInitialStatus();
      client.emit('otp_syncronize', otpStatus);
    } catch (e: unknown) {
      console.error('Invalid token: ', e);
      client.emit('error', 'unauthorized');
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    console.log('Client disconnected: ', client.id);
    const user = client.data?.user;

    if (user && user.sub) {
      this.eventsService.removeSession(user.sub, client.id);
      console.log('Session removed from user');

      const userSockets = this.eventsService.getUserSockets(user.sub);
      userSockets.forEach((socketId) => {
        this.server.to(socketId).emit('close_session_alert', {
          message: 'A new device has signed out to your account.',
          time: new Date(),
        });
      });
    }
  }

  @SubscribeMessage('request_logout')
  handeLogout(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody('socketId') socketId: string,
  ) {
    const user = client.data?.user;

    if (!user || !user.sub) {
      return { status: 'error', message: 'User not identified' };
    }

    const targetSocket = this.server.sockets.get(socketId);

    if (!targetSocket) {
      return { status: 'error', message: 'Session not found' };
    }

    this.server.to(socketId).emit('force_logout', {
      message: 'You have logged out from another device.',
    });

    targetSocket.disconnect(true);
    this.eventsService.removeSession(user.sub, socketId);
    return { status: 'success', message: 'Logged out from device' };
  }

  @SubscribeMessage('request_global_logout')
  handleGlobalLogout(@ConnectedSocket() client: AuthenticatedSocket) {
    const user = client.data?.user;

    if (!user || !user.sub) {
      return { status: 'error', message: 'User not identified' };
    }

    console.log(`Global logout requested by user: ${user.sub}`);
    const allUserSockets = this.eventsService.getUserSockets(user.sub);

    allUserSockets.forEach((socketId) => {
      this.server.to(socketId).emit('force_logout', {
        message: 'You have logged out from another device.',
      });

      const targetSocket = this.server.sockets.get(socketId);
      if (targetSocket) {
        targetSocket.disconnect(true);
      }
    });

    this.eventsService.clearAllUserSessions(user.sub);
    return { status: 'success', message: 'Logged out from all devices' };
  }

  @SubscribeMessage('request_otp_sync')
  handleRequestOtpSync(@ConnectedSocket() client: AuthenticatedSocket) {
    const otpStatus = this.otpService.getInitialStatus();
    client.emit('otp_syncronize', otpStatus);
  }

  @OnEvent('otp.rotated')
  handleOtpRotatedEvent({ maxTtl, userId, codes }: OtpEventDto) {
    const userSockets = this.eventsService.getUserSockets(userId);

    userSockets.forEach((socketId) => {
      const otpResponseData: OtpResponseDto = {
        maxTtl,
        codes,
        time: new Date(),
      };

      this.server.to(socketId).emit('otp_rotated', otpResponseData);
    });
  }
}
