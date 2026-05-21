import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './auth.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserCreateDto } from 'src/users/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Log in and return the JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Login successfullty done',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(@Body() authDto: UserCreateDto): Promise<AuthResponseDto> {
    return this.authService.signIn(authDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user and return the JWT immediately',
  })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 409, description: 'User alredy exist' })
  async register(@Body() userDto: UserCreateDto): Promise<AuthResponseDto> {
    return this.authService.createOne(userDto);
  }
}
