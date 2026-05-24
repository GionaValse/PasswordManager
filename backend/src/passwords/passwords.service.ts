import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { VaultsRepository } from 'src/vaults/vaults.repository';
import { PasswordCreateDto, PasswordResponseDto, PasswordUpdateDto } from './passwords.dto';
import { PasswordEntity } from './passwords.entity';
import { PasswordsRepository } from './passwords.repository';

@Injectable()
export class PasswordsService {
  constructor(
    private readonly repo: PasswordsRepository,
    private readonly vaultRepo: VaultsRepository,
  ) {}

  async createOne(passwordDto: PasswordCreateDto, userId: string): Promise<PasswordResponseDto> {
    const vault = await this.vaultRepo.findByIdAndUser(passwordDto.vaultId, userId);

    if (!vault) {
      throw new NotFoundException(`Vault with ID ${passwordDto.vaultId} not found`);
    }

    const newPassowrd = new PasswordEntity();
    Object.assign(newPassowrd, passwordDto);
    newPassowrd.creationDate = new Date();
    newPassowrd.modifiedDate = new Date();

    const savedPssword = await this.repo.save(newPassowrd);
    return this.parseDto(savedPssword);
  }

  async findAll(userId: string): Promise<PasswordResponseDto[]> {
    const userVaults = await this.vaultRepo.findAll(userId);
    const vaultIds = userVaults.map((v) => v._id.toString());

    if (vaultIds.length === 0) return [];

    const passwords = await this.repo.findAllByVaultIds(vaultIds);
    return passwords.map((p) => this.parseDto(p));
  }

  async findByVault(vaultId: string, userId: string): Promise<PasswordResponseDto[]> {
    const vault = await this.vaultRepo.findByIdAndUser(vaultId, userId);
    if (!vault) {
      throw new NotFoundException(`Vault with ID ${vaultId} not found`);
    }

    const findedPasswords = await this.repo.findAllByVaultId(vaultId);
    return findedPasswords.map((p) => this.parseDto(p));
  }

  async findFavorites(userId: string): Promise<PasswordResponseDto[]> {
    const userVaults = await this.vaultRepo.findAll(userId);
    const vaultIds = userVaults.map((v) => v._id.toString());

    if (vaultIds.length === 0) return [];

    const favorites = await this.repo.findFavoritesByVaultIds(vaultIds);
    return favorites.map((p) => this.parseDto(p));
  }

  async findOtps(): Promise<PasswordResponseDto[]> {
    const otps = await this.repo.findOtps();
    return otps.map((p) => this.parseDto(p));
  }

  async findOne(id: string, userId: string): Promise<PasswordResponseDto> {
    const findedPassword = await this.findOneSecure(id, userId);
    return this.parseDto(findedPassword);
  }

  async updateOne(
    id: string,
    userId: string,
    updateDate: boolean,
    updateData: PasswordUpdateDto,
  ): Promise<PasswordResponseDto> {
    const findedPassword = await this.findOneSecure(id, userId);

    Object.assign(findedPassword, updateData);

    if (updateDate) {
      findedPassword.modifiedDate = new Date();
    }

    const saved = await this.repo.save(findedPassword);
    return this.parseDto(saved);
  }

  async updateFavorite(
    id: string,
    userId: string,
    isFavorite: boolean,
  ): Promise<PasswordResponseDto> {
    return this.updateOne(id, userId, false, { favorite: isFavorite });
  }

  async updateOtpCode(id: string, otpCode: string): Promise<PasswordResponseDto> {
    const findedPassword = await this.repo.findById(id);

    if (!findedPassword) {
      throw new NotFoundException('Password not found');
    }

    findedPassword.otpCode = otpCode;

    const saved = await this.repo.save(findedPassword);
    return this.parseDto(saved);
  }

  async deleteOne(id: string, userId: string): Promise<PasswordResponseDto> {
    const password = await this.findOneSecure(id, userId);
    if (!password) {
      throw new NotFoundException(`Password with ID ${id} not found`);
    }

    const response = this.parseDto(password);
    await this.repo.remove(password);
    return response;
  }

  parseDto(entity: PasswordEntity): PasswordResponseDto {
    const dto = new PasswordResponseDto();
    Object.assign(dto, entity);
    dto.id = entity._id.toString();
    return dto;
  }

  async findOneSecure(id: string, userId: string) {
    const findedPassword = await this.repo.findById(id);

    if (!findedPassword) {
      throw new NotFoundException('Password not found');
    }

    const vault = await this.vaultRepo.findByIdAndUser(findedPassword.vaultId, userId);
    if (!vault) {
      throw new UnauthorizedException('Access denied to this password');
    }

    return findedPassword;
  }
}
