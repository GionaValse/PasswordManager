import { Injectable, NotFoundException } from '@nestjs/common';
import { VaultCreateDto, VaultResponseDto, VaultUpdateDto } from './vaults.dto';
import { generateColor } from 'src/tools/color';
import { VaultsRepository } from './vaults.repository';
import { VaultEntity } from './vaults.entity';

@Injectable()
export class VaultsService {
  constructor(private repo: VaultsRepository) {}

  async createOne(vaultDto: VaultCreateDto, userId: string): Promise<VaultResponseDto> {
    const { color, ...data } = vaultDto;
    const vaultColor = color ? color : generateColor();

    const newVault = new VaultEntity();
    Object.assign(newVault, data);
    newVault.color = vaultColor;
    newVault.ownerId = userId;

    const savedVault = await this.repo.save(newVault);

    const responseVault = new VaultResponseDto();
    responseVault.id = savedVault._id.toString();
    responseVault.ownerId = savedVault.ownerId;
    responseVault.name = savedVault.name;
    responseVault.description = savedVault.description;
    responseVault.color = savedVault.color || '#000';

    return responseVault;
  }

  async findAll(userId: string): Promise<VaultResponseDto[]> {
    const findedVaults = await this.repo.findAll(userId);
    return findedVaults.map((v) => this.parseDto(v));
  }

  async findOne(id: string, userId: string): Promise<VaultResponseDto> {
    const findedVault = await this.repo.findById(id, userId);
    if (!findedVault) {
      throw new NotFoundException(`Vault with ID ${id} not found`);
    }
    return this.parseDto(findedVault);
  }

  async updateOne(
    id: string,
    userId: string,
    updateData: VaultUpdateDto,
  ): Promise<VaultResponseDto> {
    const vault = await this.repo.findById(id, userId);
    if (!vault) {
      throw new NotFoundException(`Vault with ID ${id} not found`);
    }

    Object.assign(vault, updateData);
    const updatedVault = await this.repo.save(vault);

    return this.parseDto(updatedVault);
  }

  async deleteOne(id: string, userId: string): Promise<VaultResponseDto> {
    const vault = await this.repo.findById(id, userId);
    if (!vault) {
      throw new NotFoundException(`Vault with ID ${id} not found`);
    }

    const response = this.parseDto(vault);
    await this.repo.remove(vault);
    return response;
  }

  parseDto(entity: VaultEntity): VaultResponseDto {
    const dto = new VaultResponseDto();
    Object.assign(dto, entity);
    dto.id = entity._id.toString();
    return dto;
  }
}
