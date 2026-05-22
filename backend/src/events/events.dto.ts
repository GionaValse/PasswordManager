import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/auth.types';

export class EventSessionDto {
  @ApiProperty({ example: 'session-12' })
  @IsString()
  socketId: string;

  @ApiProperty({
    example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  })
  @IsString()
  userAgent: string;

  @ApiProperty({ example: '192.168.1.12' })
  @IsString()
  ip: string;

  @ApiProperty()
  @IsDate()
  connectedAt: Date;
}

export interface AuthenticatedSocket extends Socket {
  data: {
    user: JwtPayload;
  };
}
