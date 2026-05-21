import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserCreateDto, UserResponseDto, UserUpdateDto } from './users.dto';
import { generateAvatar } from 'src/tools/avatar';
import { UsersRepository } from './users.repository';
import { UserEntity } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) {}

  async createOne(userDto: UserCreateDto): Promise<UserResponseDto> {
    const existingUser = await this.repo.findByUsernameOrEmail(userDto.username, userDto.email);

    if (existingUser) {
      throw new ConflictException('Username or Email already in use');
    }

    const { password, ...data } = userDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserEntity();
    Object.assign(newUser, data);
    newUser.password = hashedPassword;
    newUser.icon = generateAvatar(data.username);

    const savedUser = await this.repo.save(newUser);

    const responseUser = new UserResponseDto();
    responseUser.id = savedUser._id.toString();
    responseUser.username = savedUser.username;
    responseUser.email = savedUser.email;
    responseUser.icon = savedUser.icon;

    return responseUser;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.parseDto(user);
  }

  async findByUsernameOrEmail(userDto: UserCreateDto): Promise<UserEntity> {
    const { username, email } = userDto;
    const user = await this.repo.findByUsernameOrEmail(username, email);
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }

  async updateOne(id: string, updateData: UserUpdateDto): Promise<UserResponseDto> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    const updatedUser = await this.repo.save(user);

    return this.parseDto(updatedUser);
  }

  async deleteOne(id: string): Promise<UserResponseDto> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const response = this.parseDto(user);
    await this.repo.remove(user);
    return response;
  }

  parseDto(entity: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    Object.assign(dto, entity);
    dto.id = entity._id.toString();
    return dto;
  }
}
