import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserCreateDto } from '../users/users.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<Partial<AuthService>>;

  beforeEach(async () => {
    authService = {
      signIn: jest.fn(),
      createOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call authService.signIn and return token', async () => {
      const dto: UserCreateDto = {
        username: 'test',
        email: 't@t.com',
        password: '123',
      };
      authService.signIn.mockResolvedValue({ accessToken: 'token' });

      const result = await controller.signIn(dto);

      expect(authService.signIn).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'token' });
    });
  });

  describe('register', () => {
    it('should call authService.createOne and return token', async () => {
      const dto: UserCreateDto = {
        username: 'test',
        email: 't@t.com',
        password: '123',
      };
      authService.createOne.mockResolvedValue({ accessToken: 'token' });

      const result = await controller.register(dto);

      expect(authService.createOne).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'token' });
    });
  });
});
