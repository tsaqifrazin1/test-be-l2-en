import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { ApiBadRequest, ApiNotFound } from 'src/common/decorators/error';
import { UseObjectInterceptors } from 'src/common/decorators/request';
import { IdSerialization } from 'src/common/serialization';
import { IResponse } from 'src/interceptors';
import { CreateUserDto } from 'src/modules/user/dto';
import { IUserService, UserServiceToken } from 'src/modules/user/interface';
import { LoginDto } from '../dto';
import { AuthService } from '../service';
import { BaseController } from 'src/common/base/base.controller';
import { UserGetSerialization } from 'src/modules/user/serializations/user.serialization';
import { LoginSerialization } from '../serialization/login.serialization';

@Controller('auth')
@ApiTags('Auth')
export class AuthController extends BaseController{
  constructor(
    private readonly _authService: AuthService,
    @Inject(UserServiceToken)
    private readonly _userService: IUserService,
  ) {
    super();
  }

  @Post('register')
  @UseObjectInterceptors(
    {
      description: 'Create User',
      status: HttpStatus.CREATED,
    },
    IdSerialization,
  )
  @ApiOperation({
    summary: 'Create User',
  })
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<IResponse<IdSerialization>> {
    const user = await this._userService.registerUser(dto);
    return {
      message: 'success create user',
      data: {
        id: user.id,
      },
    };
  }

  @Post('login')
  @UseObjectInterceptors(
    {
      description: 'Login User',
      status: HttpStatus.CREATED,
    },
    IdSerialization,
  )
  @ApiOperation({
    summary: 'Login User',
  })
  @ApiNotFound({
    description: 'Invalid credentials',
    message: 'Invalid credentials',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @ApiBadRequest({
    description: 'Invalid credentials',
    message: 'Invalid credentials',
    statusCode: HttpStatus.BAD_REQUEST,
  })
  async login(@Body() dto: LoginDto): Promise<IResponse<any>> {
    const loginUser = await this._userService.loginUser(dto);
    const token = await this._authService.generateJwt(loginUser);
    loginUser['token'] = token;
    return {
      message: 'success login',
      data: this.transformObject(LoginSerialization, loginUser),
    };
  }
}
