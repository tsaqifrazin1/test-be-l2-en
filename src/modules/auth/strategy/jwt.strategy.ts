import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entitites';
import { UserService } from 'src/modules/user/service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly _userService: UserService,
    private readonly _configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get('SECRET_KEY'),
    });
  }

  async validate({ iat, exp, id }): Promise<UserEntity> {
    const timeDiff = exp - iat;

    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }

    const user = await this._userService.getById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
