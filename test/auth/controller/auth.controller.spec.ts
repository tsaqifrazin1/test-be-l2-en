import { Test, TestingModule } from '@nestjs/testing';
import { RoleType } from 'src/common/type';
import { AuthController } from 'src/modules/auth/controller';
import { AuthService } from 'src/modules/auth/service';
import { CreateUserDto } from 'src/modules/user/dto';
import { UserEntity } from 'src/modules/user/entitites';
import { IUserService, UserServiceToken } from 'src/modules/user/interface';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: IUserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateJwt: jest.fn(),
            decodeUser: jest.fn(),
          },
        },
        {
          provide: UserServiceToken,
          useValue: {
            registerUser: jest.fn(),
            loginUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<IUserService>(UserServiceToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should register user', async () => {
    const dto: CreateUserDto = {
      username: 'test',
      email: 'test@email.com',
      password: 'password',
    };

    jest.spyOn(userService, 'registerUser').mockResolvedValue({
      id: 1,
      username: 'test',
      email: 'test@email.com',
      role: RoleType.USER,
      password: 'password',
    } as UserEntity);

    const result = await controller.createUser(dto);

    expect(userService.registerUser).toBeCalledWith(dto);
    expect(userService.registerUser).toBeCalledTimes(1);
    expect(result).toEqual({
      message: 'success create user',
      data: {
        id: 1,
      },
    });
  });

  it('should login user', async () => {
    const dto = {
      email: 'test@email.com',
      password: 'password',
    };

    jest.spyOn(userService, 'loginUser').mockResolvedValue({
      id: 1,
      username: 'test',
      email: 'test@email.com',
      role: RoleType.USER,
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity);

    jest.spyOn(authService, 'generateJwt').mockResolvedValue('token');

    const result = await controller.login(dto);

    expect(userService.loginUser).toBeCalledTimes(1);
    expect(authService.generateJwt).toBeCalledTimes(1);
    expect(result).toEqual({
      message: 'success login',
      data: {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        role: RoleType.USER,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        token: 'token',
      },
    });
  });
});
