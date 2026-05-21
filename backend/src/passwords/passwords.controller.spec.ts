import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/auth.guard';
import { PasswordsController } from './passwords.controller';
import { PasswordCreateDto, PasswordResponseDto, PasswordUpdateDto } from './passwords.dto';
import { PasswordsService } from './passwords.service';

interface MockJwtPayload {
  sub: string;
  [key: string]: any;
}

describe('PasswordsController', () => {
  let controller: PasswordsController;
  let service: jest.Mocked<Partial<PasswordsService>>;

  const mockUserId = 'user-123';
  const mockUser: MockJwtPayload = { sub: mockUserId };
  const mockPasswordId = 'pass-999';

  beforeEach(async () => {
    service = {
      createOne: jest.fn(),
      findAll: jest.fn(),
      findFavorites: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
      updateFavorite: jest.fn(),
      deleteOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordsController],
      providers: [
        {
          provide: PasswordsService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<PasswordsController>(PasswordsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should call service.createOne with correct parameters', async () => {
      const dto: PasswordCreateDto = {
        vaultId: 'vault-1',
        service: 'GitHub',
        website: 'https://github.com',
        username: 'dev_user',
        password: 'SecurePassword123!',
        favorite: true,
      };

      const expectedResult = {
        id: mockPasswordId,
        ...dto,
      } as PasswordResponseDto;
      service.createOne.mockResolvedValue(expectedResult);

      const result = await controller.createOne(dto, mockUser as any);

      expect(service.createOne).toHaveBeenCalledWith(dto, mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return an array of passwords', async () => {
      const expectedResult: PasswordResponseDto[] = [
        { id: mockPasswordId, service: 'Test' } as PasswordResponseDto,
      ];
      service.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockUser as any);

      expect(service.findAll).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findFavorites', () => {
    it('should call service.findFavorites and return favorite passwords', async () => {
      const expectedResult: PasswordResponseDto[] = [
        {
          id: mockPasswordId,
          service: 'Test',
          favorite: true,
        } as PasswordResponseDto,
      ];
      service.findFavorites.mockResolvedValue(expectedResult);

      const result = await controller.findFavorites(mockUser as any);

      expect(service.findFavorites).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id and userId', async () => {
      const expectedResult = {
        id: mockPasswordId,
        service: 'Test',
      } as PasswordResponseDto;
      service.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(mockPasswordId, mockUser as any);

      expect(service.findOne).toHaveBeenCalledWith(mockPasswordId, mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateOne', () => {
    it('should call service.updateOne with id, userId, true for updateDate, and dto', async () => {
      const dto: PasswordUpdateDto = { service: 'Updated Name' };
      const expectedResult = {
        id: mockPasswordId,
        ...dto,
      } as PasswordResponseDto;
      service.updateOne.mockResolvedValue(expectedResult);

      const result = await controller.updateOne(mockPasswordId, dto, mockUser as any);

      expect(service.updateOne).toHaveBeenCalledWith(mockPasswordId, mockUserId, true, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateFavorite', () => {
    it('should call service.updateFavorite with correct id, userId and boolean', async () => {
      const expectedResult = {
        id: mockPasswordId,
        favorite: true,
      } as PasswordResponseDto;
      service.updateFavorite.mockResolvedValue(expectedResult);

      const result = await controller.updateFavorite(mockPasswordId, true, mockUser as any);

      expect(service.updateFavorite).toHaveBeenCalledWith(mockPasswordId, mockUserId, true);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteOne', () => {
    it('should call service.deleteOne with correct id and userId', async () => {
      const expectedResult = {
        id: mockPasswordId,
      } as PasswordResponseDto;
      service.deleteOne.mockResolvedValue(expectedResult);

      const result = await controller.deleteOne(mockPasswordId, mockUser as any);

      expect(service.deleteOne).toHaveBeenCalledWith(mockPasswordId, mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });
});
