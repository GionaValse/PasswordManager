import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsString } from 'class-validator';

export class PasswordCreateDto {
  @ApiProperty({
    example: 'uuid-v4-vault-123',
    description: 'Vault ID of the vault you belong to',
  })
  @IsString()
  vaultId: string;

  @ApiProperty({ example: 'Netflix' })
  @IsString()
  service: string;

  @ApiProperty({ example: 'https://netflix.com', required: false })
  @IsString()
  website: string;

  @ApiProperty({ example: 'mario_rossi' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'S3cureP@ss!', format: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'ABC 123', format: 'password' })
  @IsString()
  otpCode: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  favorite: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  haveOtp: boolean;
}

export class PasswordUpdateDto extends PartialType(PasswordCreateDto) {}

export class PasswordResponseDto extends PasswordCreateDto {
  @ApiProperty({ example: 'uuid-v4-pass-999' })
  @IsString()
  id: string;

  @ApiProperty()
  @IsDate()
  creationDate: Date;

  @ApiProperty()
  @IsDate()
  modifiedDate: Date;
}
