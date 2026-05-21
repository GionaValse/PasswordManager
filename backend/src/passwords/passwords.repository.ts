import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordEntity } from './passwords.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class PasswordsRepository {
  constructor(
    @InjectRepository(PasswordEntity)
    private readonly repo: MongoRepository<PasswordEntity>,
  ) {}

  async save(entity: PasswordEntity): Promise<PasswordEntity> {
    return await this.repo.save(entity);
  }

  async findAllByVaultIds(vaultIds: string[]): Promise<PasswordEntity[]> {
    return await this.repo.find({
      where: {
        vaultId: { $in: vaultIds.map((id) => id) },
      },
    });
  }

  async findFavoritesByVaultIds(vaultIds: string[]): Promise<PasswordEntity[]> {
    return await this.repo.find({
      where: {
        vaultId: { $in: vaultIds.map((id) => id) },
        favorite: true,
      },
    });
  }

  async findAllByVaultId(vaultId: string): Promise<PasswordEntity[]> {
    return this.repo.find({ where: { vaultId: vaultId } });
  }

  async findById(id: string): Promise<PasswordEntity | null> {
    return await this.repo.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  async remove(entity: PasswordEntity): Promise<PasswordEntity> {
    return await this.repo.remove(entity);
  }
}
