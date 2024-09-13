import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { RoleType } from 'src/common/type';
import { UserEntity } from 'src/modules/user/entitites';
import { UserGetSerialization } from 'src/modules/user/serializations/user.serialization';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async generateJwt(user: UserEntity): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: user.id,
      },
      { secret: this.configService.get('SECRET_KEY') },
    );
  }
}
