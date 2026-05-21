import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserCreateDto, UserUpdateDto } from './users.dto';
import { ObjectId } from 'mongodb';
import { UserEntity } from './users.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('mocked_hashed_password')),
}));

jest.mock('../tools/avatar', () => ({
  generateAvatar: jest.fn(() => 'https://mocked-avatar.com/icon.png'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Partial<UsersRepository>>;

  const mockUserId = new ObjectId().toString();

  beforeEach(async () => {
    repo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUsernameOrEmail: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: UsersRepository, useValue: repo }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    const dto: UserCreateDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should throw ConflictException if user already exists', async () => {
      repo.findByUsernameOrEmail.mockResolvedValue(new UserEntity());

      await expect(service.createOne(dto)).rejects.toThrow(ConflictException);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should hash password, generate avatar and save the user', async () => {
      repo.findByUsernameOrEmail.mockResolvedValue(null);

      const savedEntity = new UserEntity();
      savedEntity._id = new ObjectId();
      savedEntity.username = dto.username;
      savedEntity.email = dto.email;
      savedEntity.password = 'mocked_hashed_password';
      savedEntity.icon = 'https://mocked-avatar.com/icon.png';

      repo.save.mockResolvedValue(savedEntity);

      const result = await service.createOne(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(repo.save).toHaveBeenCalled();
      expect(result.username).toBe(dto.username);
      expect(result.icon).toBeDefined();
      expect((result as any).password).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const mockEntity = new UserEntity();
      mockEntity._id = new ObjectId(mockUserId);
      repo.findById.mockResolvedValue(mockEntity);

      const result = await service.findOne(mockUserId);

      expect(repo.findById).toHaveBeenCalledWith(mockUserId);
      expect(result.id).toBe(mockUserId);
    });

    it('should throw NotFoundException if user is not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.findOne(mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUsernameOrEmail', () => {
    const dto: UserCreateDto = {
      username: 'test',
      email: 'test@test.com',
      password: '123',
    };

    it('should return the user entity', async () => {
      const mockEntity = new UserEntity();
      repo.findByUsernameOrEmail.mockResolvedValue(mockEntity);

      const result = await service.findByUsernameOrEmail(dto);

      expect(repo.findByUsernameOrEmail).toHaveBeenCalledWith(dto.username, dto.email);
      expect(result).toBe(mockEntity);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findByUsernameOrEmail.mockResolvedValue(null);

      await expect(service.findByUsernameOrEmail(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOne', () => {
    it('should throw NotFoundException if user not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.updateOne(mockUserId, {})).rejects.toThrow(NotFoundException);
    });

    it('should hash the new password if provided in update data', async () => {
      const mockEntity = new UserEntity();
      mockEntity._id = new ObjectId(mockUserId);

      repo.findById.mockResolvedValue(mockEntity);
      repo.save.mockImplementation(async (entity) => entity);

      const updateData: UserUpdateDto = { password: 'NewPassword123!' };
      await service.updateOne(mockUserId, updateData);

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 10);
      expect(repo.save).toHaveBeenCalled();
    });

    it('should update user without hashing if password is not provided', async () => {
      const mockEntity = new UserEntity();
      mockEntity._id = new ObjectId(mockUserId);

      repo.findById.mockResolvedValue(mockEntity);
      repo.save.mockImplementation(async (entity) => entity);

      const updateData: UserUpdateDto = { username: 'updated_user' };
      const result = await service.updateOne(mockUserId, updateData);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(result.username).toBe('updated_user');
    });
  });

  describe('deleteOne', () => {
    it('should throw NotFoundException if user not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.deleteOne(mockUserId)).rejects.toThrow(NotFoundException);
    });

    it('should remove user and return data', async () => {
      const mockEntity = new UserEntity();
      mockEntity._id = new ObjectId(mockUserId);

      repo.findById.mockResolvedValue(mockEntity);
      repo.remove.mockResolvedValue(mockEntity);

      const result = await service.deleteOne(mockUserId);

      expect(repo.remove).toHaveBeenCalledWith(mockEntity);
      expect(result.id).toBe(mockUserId);
    });
  });
});
