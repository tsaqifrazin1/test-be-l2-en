import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleType } from 'src/common/type';
import { JwtStrategy } from 'src/modules/auth/strategy';
import { UserEntity } from 'src/modules/user/entitites';
import { UserService } from 'src/modules/user/service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'SECRET_KEY'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should validate user', async () => {
    const iat = 1;
    const exp = 2;

    const user: UserEntity = {
      id: 1,
      username: 'test',
      email: 'test@email.com',
      role: RoleType.USER,
      password: 'password',
    } as UserEntity;

    jest.spyOn(userService, 'getById').mockResolvedValue(user);

    const result = await strategy.validate({ iat, exp, id: user.id });
    expect(result).toEqual(user);
    expect(userService.getById).toBeCalledWith(user.id);
  });
});
