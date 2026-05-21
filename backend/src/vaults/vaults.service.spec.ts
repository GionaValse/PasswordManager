import { Test, TestingModule } from '@nestjs/testing';
import { VaultsService } from './vaults.service';
import { VaultsRepository } from './vaults.repository';
import { NotFoundException } from '@nestjs/common';
import { VaultCreateDto } from './vaults.dto';
import { ObjectId } from 'mongodb';
import { VaultEntity } from './vaults.entity';

jest.mock('../tools/color', () => ({
  generateColor: jest.fn(() => '#DEFAULT_MOCK_COLOR'),
}));

describe('VaultsService', () => {
  let service: VaultsService;
  let repo: jest.Mocked<Partial<VaultsRepository>>;

  const mockUserId = 'user-123';
  const mockVaultId = new ObjectId().toString();

  beforeEach(async () => {
    repo = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [VaultsService, { provide: VaultsRepository, useValue: repo }],
    }).compile();

    service = module.get<VaultsService>(VaultsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should create a vault with provided color', async () => {
      const dto: VaultCreateDto = { name: 'Work', color: '#FF0000' };
      const savedEntity = new VaultEntity();
      Object.assign(savedEntity, dto);
      savedEntity._id = new ObjectId();
      savedEntity.ownerId = mockUserId;

      repo.save.mockResolvedValue(savedEntity);

      const result = await service.createOne(dto, mockUserId);

      expect(repo.save).toHaveBeenCalled();
      expect(result.color).toBe('#FF0000');
      expect(result.ownerId).toBe(mockUserId);
    });

    it('should generate a color if not provided in DTO', async () => {
      const dto: VaultCreateDto = { name: 'Personal' };
      const savedEntity = new VaultEntity();
      savedEntity._id = new ObjectId();
      savedEntity.name = dto.name;
      savedEntity.color = '#DEFAULT_MOCK_COLOR';
      savedEntity.ownerId = mockUserId;

      repo.save.mockResolvedValue(savedEntity);

      const result = await service.createOne(dto, mockUserId);

      expect(result.color).toBe('#DEFAULT_MOCK_COLOR');
    });
  });

  describe('findAll', () => {
    it('should return an array of user vaults', async () => {
      const mockVault = new VaultEntity();
      mockVault._id = new ObjectId();
      repo.findAll.mockResolvedValue([mockVault]);

      const result = await service.findAll(mockUserId);

      expect(repo.findAll).toHaveBeenCalledWith(mockUserId);
      expect(result.length).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a vault if it exists and belongs to user', async () => {
      const mockVault = new VaultEntity();
      mockVault._id = new ObjectId(mockVaultId);
      repo.findById.mockResolvedValue(mockVault);

      const result = await service.findOne(mockVaultId, mockUserId);

      expect(repo.findById).toHaveBeenCalledWith(mockVaultId, mockUserId);
      expect(result.id).toBe(mockVaultId);
    });

    it('should throw NotFoundException if vault does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.findOne(mockVaultId, mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOne', () => {
    it('should throw NotFoundException if vault does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.updateOne(mockVaultId, mockUserId, {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update and return the vault', async () => {
      const mockVault = new VaultEntity();
      mockVault._id = new ObjectId(mockVaultId);
      mockVault.name = 'Old Name';

      repo.findById.mockResolvedValue(mockVault);
      repo.save.mockImplementation(async (entity) => entity);

      const result = await service.updateOne(mockVaultId, mockUserId, {
        name: 'New Name',
      });

      expect(repo.save).toHaveBeenCalled();
      expect(result.name).toBe('New Name');
    });
  });

  describe('deleteOne', () => {
    it('should throw NotFoundException if vault does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.deleteOne(mockVaultId, mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('should remove the vault and return its data', async () => {
      const mockVault = new VaultEntity();
      mockVault._id = new ObjectId(mockVaultId);

      repo.findById.mockResolvedValue(mockVault);
      repo.remove.mockResolvedValue(mockVault);

      const result = await service.deleteOne(mockVaultId, mockUserId);

      expect(repo.remove).toHaveBeenCalledWith(mockVault);
      expect(result.id).toBe(mockVaultId);
    });
  });
});
