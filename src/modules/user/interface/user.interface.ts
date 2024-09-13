import { PaginationDto } from 'src/common/dto';
import { UserRepository } from '../repository';
import { UserEntity } from '../entitites';
import { CreateUserDto, UpdateUserDto, UserFilterDto } from '../dto';
import { LoginDto } from 'src/modules/auth/dto';

/**
 * @description User Repository Token
 */
export const UserRepositoryToken = Symbol('UserRepositoryToken');

/**
 * @description User Repository Interface
 */
export interface IUserRepository {
  /**
   *@description Create User to Database
   */
  create(dto: CreateUserDto): Promise<UserEntity>;

  /**
   * @description Get User from Database with Pagination
   */
  get(query: UserFilterDto): Promise<PaginationDto<UserEntity>>;

  /**
   * @description Get User by Id from Database
   */
  getById(id: number): Promise<UserEntity>;

  /**
   * @description Get User by Email from Database
   */
  getByEmail(email: string): Promise<UserEntity>;

  /**
   * @description Update User in Database
   */
  update(id: number, dto: UpdateUserDto): Promise<void>;

  /**
   * @description Soft Delete User from Database
   */
  delete(id: number): Promise<void>;
}

/**
 * @description User Service Token
 */
export const UserServiceToken = Symbol('UserServiceToken');

/**
 * @description User Service Interface
 */
export interface IUserService {

  /**
   * @description Register User
   */
  registerUser(dto: CreateUserDto): Promise<UserEntity>;

  /**
   * @description Login User
   */
  loginUser(dto: LoginDto): Promise<UserEntity>;

  /**
   * @description Create User
   */
  create(dto: CreateUserDto): Promise<UserEntity>;

  /**
   * @description Get User
   */
  get(query: UserFilterDto): Promise<PaginationDto<UserEntity>>;

  /**
   * @description Get User by Id
   */
  getById(id: number): Promise<UserEntity>;

  /**
   * @description Get User by Email
   */
  getByEmail(email: string): Promise<UserEntity>;

  /**
   * @description Update User
   */
  update(id: number, dto: UpdateUserDto): Promise<void>;

  /**
   * @description Soft Delete User
   */
  delete(id: number): Promise<void>;
}
