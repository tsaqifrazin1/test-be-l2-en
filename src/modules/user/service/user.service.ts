import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IUserRepository,
  IUserService,
  UserRepositoryToken,
} from '../interface';
import { CreateUserDto } from '../dto';
import { UserEntity } from '../entitites';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.create(dto);
  }

  async get(query: any): Promise<any> {
    return this.userRepository.get(query);
  }

  async getById(id: number): Promise<UserEntity> {
    return this.userRepository.getById(id);
  }

  async getByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.getByEmail(email);
  }

  async update(id: number, dto: any): Promise<void> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.delete(id);
  }
}
