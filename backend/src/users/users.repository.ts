import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: MongoRepository<UserEntity>,
  ) {}

  async save(entity: UserEntity): Promise<UserEntity> {
    return await this.repo.save(entity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repo.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<UserEntity | null> {
    return await this.repo.findOne({
      where: {
        $or: [{ username }, { email }],
      },
    });
  }

  async remove(entity: UserEntity): Promise<UserEntity> {
    return await this.repo.remove(entity);
  }
}
