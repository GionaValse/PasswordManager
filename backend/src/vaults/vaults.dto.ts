import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VaultCreateDto {
  @ApiProperty({
    example: 'Work',
    description: 'The name of the vault',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Password for business services',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '#FF5733',
    description: 'Color identifier in HEX format',
    required: false,
    default: '#000000',
  })
  @IsOptional()
  @IsString()
  color?: string;
}

export class VaultUpdateDto extends PartialType(VaultCreateDto) {}

export class VaultResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'user-uuid-123' })
  @IsString()
  ownerId: string;

  @ApiProperty({ example: 'Work' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Company passwords', required: false })
  @IsString()
  description?: string;

  @ApiProperty({ example: '#FF5733' })
  @IsString()
  color: string;
}
