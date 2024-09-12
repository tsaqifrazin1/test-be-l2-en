import { Module } from '@nestjs/common';
import { JwtAuthGuard, JwtOrAnonymousAuthGuard } from './guard';
import { AnonymousStrategy, JwtStrategy } from './strategy';
import { AuthController } from './controller';
import { AuthService } from './service';
import { UserModule } from '../user';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtAuthGuard,
    JwtStrategy,
    JwtOrAnonymousAuthGuard,
    AnonymousStrategy,
  ],
})
export class AuthModule {}
