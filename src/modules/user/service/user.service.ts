import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IUserRepository,
  IUserService,
  UserRepositoryToken,
} from '../interface';
import { CreateUserDto } from '../dto';
import { UserEntity } from '../entitites';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/modules/auth/dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async registerUser(dto: CreateUserDto): Promise<UserEntity> {
    const checkUser = await this.getByEmail(dto.email);
    if (checkUser) {
      throw new BadRequestException('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);
    dto.password = hash;
    const user = await this.create(dto);
    return user;
  }

  async loginUser(dto: LoginDto){
    const user = await this.getByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    if (!bcrypt.compareSync(dto.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

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

    if(dto.email){
      const checkUser = await this.getByEmail(dto.email);
      if (checkUser && checkUser.id !== id) {
        throw new BadRequestException('Email already exists');
      }
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
