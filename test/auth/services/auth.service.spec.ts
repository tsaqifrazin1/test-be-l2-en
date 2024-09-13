import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import { RoleType } from 'src/common/type';
import { AuthService } from 'src/modules/auth/service';
import { UserEntity } from 'src/modules/user/entitites';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
  });

  it('should generate jwt', async () => {
    const user: UserEntity = {
      id: 1,
      username: 'test',
      email: 'test@email.com',
      role: RoleType.USER,
      password: 'password',
    } as UserEntity;

    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

    const result = await service.generateJwt(user);

    expect(jwtService.signAsync).toBeCalledWith(
      { id: user.id },
      { secret: process.env.SECRET_KEY },
    );
    expect(result).toEqual('token');
  });
});
