import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from '../users/users.dto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;

  beforeEach(async () => {
    usersService = {
      findByUsernameOrEmail: jest.fn(),
      createOne: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const authDto: UserCreateDto = {
      username: 'test',
      email: 't@t.com',
      password: 'password123',
    };

    it('should throw UnauthorizedException if user is not found', async () => {
      usersService.findByUsernameOrEmail.mockResolvedValue(null as any);

      await expect(service.signIn(authDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      usersService.findByUsernameOrEmail.mockResolvedValue({
        _id: '1',
        password: 'hash',
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(authDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return a token if credentials are valid', async () => {
      usersService.findByUsernameOrEmail.mockResolvedValue({
        _id: '1',
        username: 'test',
        password: 'hash',
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('mocked_token');

      const result = await service.signIn(authDto);

      expect(result).toEqual({ accessToken: 'mocked_token' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: '1',
        username: 'test',
      });
    });
  });

  describe('createOne', () => {
    it('should create a user and return a token', async () => {
      const dto: UserCreateDto = {
        username: 'test',
        email: 't@t.com',
        password: '123',
      };
      usersService.createOne.mockResolvedValue({
        id: '1',
        username: 'test',
      } as any);
      jwtService.signAsync.mockResolvedValue('mocked_token');

      const result = await service.createOne(dto);

      expect(usersService.createOne).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'mocked_token' });
    });
  });
});
