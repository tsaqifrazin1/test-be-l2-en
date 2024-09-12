import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entitites';
import { CreateUserDto, UpdateUserDto, UserFilterDto } from '../dto';
import { PaginationData } from 'src/interceptors';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const entity = this.userRepository.create(dto);
    return this.userRepository.save(entity);
  }

  async get(query: UserFilterDto): Promise<PaginationData<UserEntity>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.take(query.take);
    if ((query.page - 1) * query.take) {
      queryBuilder.skip((query.page - 1) * query.take);
    }
    const entities = await queryBuilder.getMany();
    const itemCount = await queryBuilder.getCount();

    const meta = {
      page: query.page,
      offset: query.take,
      itemCount,
      pageCount: Math.ceil(itemCount / query.take)
        ? Math.ceil(itemCount / query.take)
        : 0,
    };

    return {
      entities,
      meta,
    };
  }

  async getById(id: number): Promise<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.id = :id', { id });

    return queryBuilder.getOne();
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.email = :email', { email });

    return queryBuilder.getOne();
  }
  
  async update(id: number, dto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
