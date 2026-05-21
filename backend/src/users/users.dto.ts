import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({ example: 'mario_rossi', minLength: 3 })
  @IsString()
  @MinLength(3, { message: 'Username is too short' })
  username: string;

  @ApiProperty({
    example: 'P@ssword123',
    description: 'Must contain at least 8 characters, one uppercase letter and one number',
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  password: string;

  @ApiProperty({ example: 'mario@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

export class UserUpdateDto extends PartialType(UserCreateDto) {}

export class UserResponseDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user-icon-01.png' })
  @IsString()
  icon: string;
}
