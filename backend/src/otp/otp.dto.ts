import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class OtpEventDto {
  maxTtl: number;
  userId: string;
  codes: Record<string, string>;
}

export class OtpResponseDto {
  @ApiProperty({
    example: 30000,
    description: 'Time in milliseconds until the next OTP rotation',
  })
  @IsNumber()
  maxTtl: number;

  @ApiProperty({
    example: { code1: 'value1', code2: 'value2' },
    description: 'Record of OTP codes',
  })
  codes: Record<string, string>;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Timestamp of the OTP rotation',
  })
  @IsDate()
  time: Date;
}
