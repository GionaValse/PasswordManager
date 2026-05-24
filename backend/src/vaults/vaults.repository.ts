import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { VaultEntity } from './vaults.entity';

@Injectable()
export class VaultsRepository {
  constructor(
    @InjectRepository(VaultEntity)
    private readonly repo: MongoRepository<VaultEntity>,
  ) {}

  async save(entity: VaultEntity): Promise<VaultEntity> {
    return await this.repo.save(entity);
  }

  async findAll(userId: string): Promise<VaultEntity[]> {
    return await this.repo.find({
      where: { ownerId: userId },
    });
  }

  async findById(id: string): Promise<VaultEntity | null> {
    return await this.repo.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  async findByIdAndUser(id: string, userId: string): Promise<VaultEntity | null> {
    return await this.repo.findOne({
      where: { ownerId: userId, _id: new ObjectId(id) },
    });
  }

  async remove(entity: VaultEntity): Promise<VaultEntity> {
    return await this.repo.remove(entity);
  }
}
