import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/auth.guard';
import { PasswordResponseDto } from '../passwords/passwords.dto';
import { PasswordsService } from '../passwords/passwords.service';
import { VaultsController } from './vaults.controller';
import { VaultCreateDto, VaultResponseDto, VaultUpdateDto } from './vaults.dto';
import { VaultsService } from './vaults.service';

interface MockJwtPayload {
  sub: string;
  [key: string]: any;
}

describe('VaultsController', () => {
  let controller: VaultsController;
  let vaultsService: jest.Mocked<Partial<VaultsService>>;
  let passwordsService: jest.Mocked<Partial<PasswordsService>>;

  const mockUserId = 'user-123';
  const mockUser: MockJwtPayload = { sub: mockUserId };
  const mockVaultId = 'vault-999';

  beforeEach(async () => {
    vaultsService = {
      createOne: jest.fn(),
      findAll: jest.fn(),
      findOneWithUser: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    passwordsService = {
      findByVault: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaultsController],
      providers: [
        { provide: VaultsService, useValue: vaultsService },
        { provide: PasswordsService, useValue: passwordsService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<VaultsController>(VaultsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should call vaultsService.createOne', async () => {
      const dto: VaultCreateDto = { name: 'Work' };
      const expectedResult = {
        id: mockVaultId,
        ...dto,
      } as VaultResponseDto;
      vaultsService.createOne.mockResolvedValue(expectedResult);

      const result = await controller.createOne(dto, mockUser as any);

      expect(vaultsService.createOne).toHaveBeenCalledWith(dto, mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call vaultsService.findAll', async () => {
      const expectedResult = [{ id: mockVaultId, name: 'Work' }] as VaultResponseDto[];
      vaultsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockUser as any);

      expect(vaultsService.findAll).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call vaultsService.findOne', async () => {
      const expectedResult = {
        id: mockVaultId,
        name: 'Work',
      } as VaultResponseDto;
      vaultsService.findOneWithUser.mockResolvedValue(expectedResult);

      const result = await controller.findOne(mockVaultId, mockUser as any);

      expect(vaultsService.findOneWithUser).toHaveBeenCalledWith(mockVaultId, mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findVaultPasswords', () => {
    it('should call passwordsService.findByVault', async () => {
      const expectedResult = [{ id: 'pass-1', service: 'Netflix' }] as PasswordResponseDto[];
      passwordsService.findByVault.mockResolvedValue(expectedResult);

      const result = await controller.findVaultPasswords(mockVaultId, mockUser as any);

      expect(passwordsService.findByVault).toHaveBeenCalledWith(mockVaultId, mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateOne', () => {
    it('should call vaultsService.updateOne', async () => {
      const dto: VaultUpdateDto = { name: 'Updated Vault' };
      const expectedResult = {
        id: mockVaultId,
        ...dto,
      } as VaultResponseDto;
      vaultsService.updateOne.mockResolvedValue(expectedResult);

      const result = await controller.updateOne(mockVaultId, dto, mockUser as any);

      expect(vaultsService.updateOne).toHaveBeenCalledWith(mockVaultId, mockUserId, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteOne', () => {
    it('should call vaultsService.deleteOne', async () => {
      const expectedResult = { id: mockVaultId } as VaultResponseDto;
      vaultsService.deleteOne.mockResolvedValue(expectedResult);

      const result = await controller.deleteOne(mockVaultId, mockUser as any);

      expect(vaultsService.deleteOne).toHaveBeenCalledWith(mockVaultId, mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });
});
