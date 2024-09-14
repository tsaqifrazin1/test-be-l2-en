import { TestingModule, Test } from '@nestjs/testing';
import { RoleType } from 'src/common/type';
import { CreateUserDto, UpdateUserDto } from 'src/modules/user/dto';
import { UserEntity } from 'src/modules/user/entitites';
import {
  IUserRepository,
  UserRepositoryToken,
} from 'src/modules/user/interface';
import { UserService } from 'src/modules/user/service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compareSync: jest.fn(() => true),
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepository: IUserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepositoryToken,
          useValue: {
            create: jest.fn(),
            get: jest.fn(),
            getById: jest.fn(),
            getByEmail: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<IUserRepository>(UserRepositoryToken);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Register User', () => {
    it('should register user', async () => {
      const dto: CreateUserDto = {
        username: 'test',
        email: 'test@email.com',
        password: 'password',
      };

      jest.spyOn(userRepository, 'create').mockResolvedValue({
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
      } as UserEntity);

      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(null);

      const result = await userService.registerUser(dto);

      expect(userRepository.create).toBeCalledWith(dto);
      expect(result).toEqual({
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
      });
    });

    it('should throw error when email already exists', async () => {
      const dto: CreateUserDto = {
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
      };

      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue({
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
      } as UserEntity);

      await expect(userService.registerUser(dto)).rejects.toThrowError(
        'Email already exists',
      );
    });
  });

  describe('Login User', () => {
    it('should login user', async () => {
      const dto = {
        email: 'test@email.com',
        password: 'password',
      };

      const user: UserEntity = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserEntity;

      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(user);

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = await userService.loginUser(dto);

      expect(userRepository.getByEmail).toBeCalledWith(dto.email);
      expect(result).toEqual(user);
    });

    it('should throw error when user not found', async () => {
      const dto = {
        email: 'test@email.com',
        password: 'password',
      };

      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(null);

      await expect(userService.loginUser(dto)).rejects.toThrowError(
        'Invalid credentials',
      );
    });

    it('should throw error when password is invalid', async () => {
      const dto = {
        email: 'test@email.com',
        password: 'password',
      };

      const user: UserEntity = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserEntity;

      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(user);

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      await expect(userService.loginUser(dto)).rejects.toThrowError(
        'Invalid credentials',
      );
    });
  });

  describe('Create User', () => {
    it('should create user', async () => {
      const dto: CreateUserDto = {
        username: 'test',
        email: 'test@email.com',
        password: 'password',
      };

      jest.spyOn(userRepository, 'create').mockResolvedValue({
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
      } as UserEntity);

      const result = await userService.create(dto);

      expect(userRepository.create).toBeCalledWith(dto);
      expect(result).toEqual({
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
      });
    });
  });

  describe('Get User', () => {
    it('should get user', async () => {
      const user: UserEntity = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
      } as UserEntity;

      jest.spyOn(userRepository, 'get').mockResolvedValue({
        entities: [user],
        meta: {
          page: 1,
          offset: 10,
          itemCount: 1,
          pageCount: 1,
        },
      });

      const result = await userService.get({ page: 1, limit: 10 });

      expect(result).toEqual({
        entities: [user],
        meta: {
          page: 1,
          offset: 10,
          itemCount: 1,
          pageCount: 1,
        },
      });

      expect(userRepository.get).toBeCalledWith({ page: 1, limit: 10 });
      expect(userRepository.get).toBeCalledTimes(1);
    });
  });

  describe('Get User By Id', () => {
    it('should get user by id', async () => {
      const user: UserEntity = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
      } as UserEntity;

      jest.spyOn(userRepository, 'getById').mockResolvedValue(user);

      const result = await userService.getById(1);

      expect(result).toEqual(user);
      expect(userRepository.getById).toBeCalledWith(1);
    });
  });

  describe('Update User', () => {
    it('should update user', async () => {
      const dto: UpdateUserDto = {
        username: 'test update',
      };

      const user: UserEntity = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
      } as UserEntity;

      jest.spyOn(userRepository, 'getById').mockResolvedValue(user);

      jest.spyOn(userRepository, 'update').mockResolvedValue(null);

      const result = await userService.update(1, dto);

      expect(userRepository.getById).toBeCalledWith(1);
    });

    it('should throw error when user not found', async () => {
      const dto: UpdateUserDto = {
        username: 'test update',
      };

      jest.spyOn(userRepository, 'getById').mockResolvedValue(null);

      await expect(userService.update(1, dto)).rejects.toThrowError(
        'User not found',
      );
    });

    it('should throw error when email already exists', async () => {
      const dto: UpdateUserDto = {
        username: 'test update',
        email: 'test@email.com',
      };

      const user: UserEntity = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
      } as UserEntity;

      jest.spyOn(userRepository, 'getById').mockResolvedValue(user);

      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue({
        id: 2,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        password: 'password',
      } as UserEntity);

      await expect(userService.update(1, dto)).rejects.toThrowError(
        'Email already exists',
      );
    });
  });

  describe('Delete User', () => {
    it('should delete user', async () => {
      const user: UserEntity = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
      } as UserEntity;

      jest.spyOn(userRepository, 'getById').mockResolvedValue(user);

      jest.spyOn(userRepository, 'delete').mockResolvedValue(null);

      await userService.delete(1);

      expect(userRepository.getById).toBeCalledWith(1);
      expect(userRepository.delete).toBeCalledWith(1);
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(userRepository, 'getById').mockResolvedValue(null);

      await expect(userService.delete(1)).rejects.toThrowError(
        'User not found',
      );
    });
  });
});
