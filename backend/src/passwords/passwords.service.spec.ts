import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { VaultsRepository } from '../vaults/vaults.repository';
import { PasswordCreateDto } from './passwords.dto';
import { PasswordEntity } from './passwords.entity';
import { PasswordsRepository } from './passwords.repository';
import { PasswordsService } from './passwords.service';

describe('PasswordsService', () => {
  let service: PasswordsService;
  let passwordsRepo: jest.Mocked<Partial<PasswordsRepository>>;
  let vaultsRepo: jest.Mocked<Partial<VaultsRepository>>;

  const mockUserId = 'user-123';
  const mockVaultId = 'vault-123';

  beforeEach(async () => {
    passwordsRepo = {
      save: jest.fn(),
      findAllByVaultIds: jest.fn(),
      findFavoritesByVaultIds: jest.fn(),
      findAllByVaultId: jest.fn(),
      findById: jest.fn(),
      remove: jest.fn(),
    };

    vaultsRepo = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordsService,
        { provide: PasswordsRepository, useValue: passwordsRepo },
        { provide: VaultsRepository, useValue: vaultsRepo },
      ],
    }).compile();

    service = module.get<PasswordsService>(PasswordsService);
  });

  afterEach(() => {
    // Pulisce la memoria delle chiamate ai mock dopo ogni test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    const createDto: PasswordCreateDto = {
      vaultId: mockVaultId,
      service: 'Netflix',
      username: 'mario_rossi',
      password: 'SuperSecretPassword!',
      website: 'https://netflix.com',
      favorite: false,
    };

    it('should create and return a password if the vault exists', async () => {
      vaultsRepo.findById.mockResolvedValue({
        _id: new ObjectId(),
      } as any);

      const savedEntity = new PasswordEntity();
      Object.assign(savedEntity, createDto);
      savedEntity._id = new ObjectId();
      savedEntity.creationDate = new Date();
      savedEntity.modifiedDate = new Date();

      passwordsRepo.save.mockResolvedValue(savedEntity);

      const result = await service.createOne(createDto, mockUserId);

      expect(vaultsRepo.findById).toHaveBeenCalledWith(mockVaultId, mockUserId);
      expect(passwordsRepo.save).toHaveBeenCalled();
      expect(result.id).toEqual(savedEntity._id.toString());
    });

    it('should throw NotFoundException if vault does not exist', async () => {
      vaultsRepo.findById.mockResolvedValue(null);

      await expect(service.createOne(createDto, mockUserId)).rejects.toThrow(NotFoundException);
      expect(passwordsRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an empty array if the user has no vaults', async () => {
      vaultsRepo.findAll.mockResolvedValue([]);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([]);
      expect(passwordsRepo.findAllByVaultIds).not.toHaveBeenCalled();
    });

    it('should return an array of passwords if the user has vaults', async () => {
      const mockVault = { _id: new ObjectId() } as any;
      vaultsRepo.findAll.mockResolvedValue([mockVault]);

      const mockPassword = new PasswordEntity();
      mockPassword._id = new ObjectId();
      passwordsRepo.findAllByVaultIds.mockResolvedValue([mockPassword]);

      const result = await service.findAll(mockUserId);

      expect(passwordsRepo.findAllByVaultIds).toHaveBeenCalledWith([mockVault._id.toString()]);
      expect(result.length).toBe(1);
    });
  });

  describe('findByVault', () => {
    it('should throw a NotFoundException if vault does not exist', async () => {
      vaultsRepo.findById.mockResolvedValue(null);

      await expect(service.findByVault(mockVaultId, mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('should return passwords for a specific valid vault', async () => {
      vaultsRepo.findById.mockResolvedValue({
        _id: new ObjectId(),
      } as any);
      const mockPassword = new PasswordEntity();
      mockPassword._id = new ObjectId();
      passwordsRepo.findAllByVaultId.mockResolvedValue([mockPassword]);

      const result = await service.findByVault(mockVaultId, mockUserId);

      expect(result.length).toBe(1);
    });
  });

  describe('findFavorites', () => {
    it('should return favorite passwords for user vaults', async () => {
      const mockVault = { _id: new ObjectId() } as any;
      vaultsRepo.findAll.mockResolvedValue([mockVault]);

      const mockPassword = new PasswordEntity();
      mockPassword._id = new ObjectId();
      mockPassword.favorite = true;
      passwordsRepo.findFavoritesByVaultIds.mockResolvedValue([mockPassword]);

      const result = await service.findFavorites(mockUserId);

      expect(result[0].favorite).toBe(true);
    });
  });

  describe('findOneSecure (and findOne)', () => {
    const mockPasswordId = new ObjectId().toString();

    it('should throw a NotFoundException if the password does not exist', async () => {
      passwordsRepo.findById.mockResolvedValue(null);

      await expect(service.findOne(mockPasswordId, mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('should throw an UnauthorizedException if the user has no access to the vault', async () => {
      const mockPassword = new PasswordEntity();
      mockPassword.vaultId = mockVaultId;

      passwordsRepo.findById.mockResolvedValue(mockPassword);
      vaultsRepo.findById.mockResolvedValue(null);

      await expect(service.findOne(mockPasswordId, mockUserId)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return the password if it exists and user has access', async () => {
      const mockPassword = new PasswordEntity();
      mockPassword._id = new ObjectId(mockPasswordId);
      mockPassword.vaultId = mockVaultId;

      passwordsRepo.findById.mockResolvedValue(mockPassword);
      vaultsRepo.findById.mockResolvedValue({
        _id: new ObjectId(),
      } as any);

      const result = await service.findOne(mockPasswordId, mockUserId);

      expect(result.id).toBe(mockPasswordId);
    });
  });

  describe('updateOne', () => {
    const mockPasswordId = new ObjectId().toString();

    it('should update the password and modify the date if updateDate is true', async () => {
      const mockPassword = new PasswordEntity();
      mockPassword._id = new ObjectId(mockPasswordId);
      mockPassword.vaultId = mockVaultId;

      passwordsRepo.findById.mockResolvedValue(mockPassword);
      vaultsRepo.findById.mockResolvedValue({
        _id: new ObjectId(),
      } as any);
      passwordsRepo.save.mockImplementation(async (entity) => entity);

      const result = await service.updateOne(mockPasswordId, mockUserId, true, {
        service: 'New Name',
      });

      expect(result.service).toBe('New Name');
      expect(result.modifiedDate).toBeDefined();
    });
  });

  describe('updateFavorite', () => {
    const mockPasswordId = new ObjectId().toString();

    it('should update only the favorite status', async () => {
      const mockPassword = new PasswordEntity();
      mockPassword._id = new ObjectId(mockPasswordId);
      mockPassword.vaultId = mockVaultId;
      mockPassword.favorite = false;

      passwordsRepo.findById.mockResolvedValue(mockPassword);
      vaultsRepo.findById.mockResolvedValue({
        _id: new ObjectId(),
      } as any);
      passwordsRepo.save.mockImplementation(async (entity) => entity);

      const result = await service.updateFavorite(mockPasswordId, mockUserId, true);

      expect(result.favorite).toBe(true);
    });
  });

  describe('deleteOne', () => {
    const mockPasswordId = new ObjectId().toString();

    it('should remove the password and return its data', async () => {
      const mockPassword = new PasswordEntity();
      mockPassword._id = new ObjectId(mockPasswordId);
      mockPassword.vaultId = mockVaultId;

      passwordsRepo.findById.mockResolvedValue(mockPassword);
      vaultsRepo.findById.mockResolvedValue({
        _id: new ObjectId(),
      } as any);
      passwordsRepo.remove.mockResolvedValue(mockPassword);

      const result = await service.deleteOne(mockPasswordId, mockUserId);

      expect(passwordsRepo.remove).toHaveBeenCalledWith(mockPassword);
      expect(result.id).toBe(mockPasswordId);
    });
  });
});
