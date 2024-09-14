import { Test, TestingModule } from '@nestjs/testing';
import { RoleType } from 'src/common/type';
import { UserController } from 'src/modules/user/controller';
import { UserEntity } from 'src/modules/user/entitites';
import { IUserService, UserServiceToken } from 'src/modules/user/interface';


describe('UserController', () => {
  let controller: UserController;
  let userService: IUserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserServiceToken,
          useValue: {
            get: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<IUserService>(UserServiceToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should get users', async () => {
    const users: UserEntity[] = [
      {
        id: 1,
        username: 'test',
        email: 'test@gmail.com',
        role: RoleType.USER,
      } as UserEntity,
    ];

    jest.spyOn(userService, 'get').mockResolvedValue({
      entities: users,
      meta: {
        page: 1,
        offset: 10,
        itemCount: 1,
        pageCount: 1,
      },
    });

    const query = {
      page: 1,
      limit: 10,
    };
    const result = await controller.getUsers(query);
    expect(result).toEqual({
      message: 'success',
      data: {
        entities: users,
        meta: {
          page: 1,
          offset: 10,
          itemCount: 1,
          pageCount: 1,
        },
      },
    });
    expect(userService.get).toBeCalled();
    expect(userService.get).toBeCalledWith(query);
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const user: UserEntity = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
      } as UserEntity;

      jest.spyOn(userService, 'getById').mockResolvedValue(user);
      const result = await controller.getUserById(1, user);
      expect(result).toEqual({
        message: 'success',
        data: user,
      });
      expect(userService.getById).toBeCalled();
      expect(userService.getById).toBeCalledWith(1);
    });

    it('should throw unauthorized exception', async () => {
      const user: UserEntity = {
        id: 2,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
      } as UserEntity;

      await expect(controller.getUserById(1, user)).rejects.toThrow(
        'You are not authorized to access this resource',
      );
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const user: UserEntity = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
      } as UserEntity;

      const dto = {
        username: 'test update',
      };

      jest.spyOn(userService, 'update').mockResolvedValue(null);
      const result = await controller.updateUserById(1, dto, user);
      expect(result).toEqual({
        message: 'success',
      });

      expect(userService.update).toBeCalled();
      expect(userService.update).toBeCalledWith(1, dto);
    });

    it('should throw unauthorized exception', async () => {
      const user: UserEntity = {
        id: 2,
        username: 'test',
        email: 'test@gmail.com',
        role: RoleType.USER,
      } as UserEntity;

      const dto = {
        username: 'test update',
      };

      await expect(controller.updateUserById(1, dto, user)).rejects.toThrow(
        'You are not authorized to access this resource',
      );
    });
  });

  it('should delete user', async () => {
    const user: UserEntity = {
      id: 1,
      username: 'test',
      email: 'test@email.com',
      role: RoleType.USER,
    } as UserEntity;

    jest.spyOn(userService, 'delete').mockResolvedValue(null);
    const result = await controller.deleteUserById(1);
    expect(result).toEqual({
      message: 'success',
    });

    expect(userService.delete).toBeCalled();
    expect(userService.delete).toBeCalledWith(1);
  });
});
