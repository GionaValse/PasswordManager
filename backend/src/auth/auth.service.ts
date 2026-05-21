import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './auth.dto';
import { UserCreateDto } from 'src/users/users.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersSerivce: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(authDto: UserCreateDto): Promise<AuthResponseDto> {
    const user = await this.usersSerivce.findByUsernameOrEmail(authDto);

    if (!user) {
      this.logger.error(`Login failed: user ${authDto.username} non found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.validateUser(authDto.password, user.password);

    if (!isPasswordValid) {
      this.logger.error(`Login failed: password non equals`);
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user._id.toString(), user.username);
  }

  async createOne(userDto: UserCreateDto): Promise<AuthResponseDto> {
    const { id, username } = await this.usersSerivce.createOne(userDto);
    return this.generateToken(id, username);
  }

  async validateUser(password: string, passwordDb: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, passwordDb);
    return isMatch;
  }

  async generateToken(userId: string, username: string): Promise<AuthResponseDto> {
    const payload = { sub: userId, username };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
