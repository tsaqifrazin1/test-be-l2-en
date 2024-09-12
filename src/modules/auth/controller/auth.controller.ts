import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service';
import { CreateUserDto } from 'src/modules/user/dto';
import { LoginDto } from '../dto';
import * as bcrypt from 'bcrypt';
import { RolesTypeDecorators } from 'src/decorators/roles-type.decorator';
import { RolesTypeGuard } from 'src/guards';
import { JwtAuthGuard } from '../guard';
import { IUserService, UserServiceToken } from 'src/modules/user/interface';
import { UseObjectInterceptors } from 'src/common/decorators/request';
import { IdSerialization } from 'src/common/serialization';
import { ApiBadRequest, ApiNotFound } from 'src/common/decorators/error';
import { IResponse } from 'src/interceptors';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    @Inject(UserServiceToken)
    private readonly _userService: IUserService,
  ) {}

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
  //need to comment Guards and RolesDecorators to create first user
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators()
  @ApiBearerAuth()
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<IResponse<IdSerialization>> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123456789', salt);
    dto.password = hash;
    const user = await this._userService.create(dto);
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
    const user = await this._userService.getByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    if (!bcrypt.compareSync(dto.password, user.password)) {
      throw new BadRequestException('invalid credentials');
    }
    const token = await this._authService.generateJwt(user);
    const decode = await this._authService.decodeUser(token);
    decode['token'] = token;
    return {
      message: 'success login',
      data: decode,
    };
  }
}
