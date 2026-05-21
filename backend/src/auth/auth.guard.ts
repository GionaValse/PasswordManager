import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Socket } from 'socket.io';
import { JwtPayload, JwtRequest } from './auth.types';

export interface SocketClientWithAuth extends Socket {
  data: {
    user: JwtPayload;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'ws') {
      return await this.handleWSContext(context);
    }

    const request: JwtRequest = context.switchToHttp().getRequest<JwtRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request['user'] = payload;
      return true;
    } catch (e: unknown) {
      console.error('AuthGuard error:', e);
      throw new UnauthorizedException();
    }
  }

  private async handleWSContext(context: ExecutionContext): Promise<boolean> {
    const client: SocketClientWithAuth = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token as string | undefined;

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException();
    }

    try {
      client.data.user = await this.jwtService.verifyAsync<JwtPayload>(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
