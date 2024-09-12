import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IUserService, UserServiceToken } from '../interface';
import { BaseController } from 'src/common/base/base.controller';
import { UpdateUserDto, UserFilterDto } from '../dto';
import { UserGetSerialization } from '../serializations/user.serialization';
import {
  UseObjectInterceptors,
  UsePaginationInterceptors,
} from 'src/common/decorators/request';
import { PaginationDto } from 'src/common/dto';
import { IResponse } from 'src/interceptors';
import { ApiNotFound, ApiUnauthorized } from 'src/common/decorators/error';
import { Transactional } from 'typeorm-transactional';
import { AuthUser, RolesTypeDecorators } from 'src/decorators';
import { RolesTypeGuard } from 'src/guards';
import { JwtAuthGuard } from 'src/modules/auth/guard';
import { RoleType } from 'src/common/type';
import { UserEntity } from '../entitites';

@Controller('user')
@ApiTags('User')
export class UserController extends BaseController {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: IUserService,
  ) {
    super();
  }

  @Get()
  @UsePaginationInterceptors(
    {
      description: 'Get User',
      status: 200,
    },
    UserGetSerialization,
  )
  @ApiOperation({
    summary: 'Get User',
  })
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  @ApiBearerAuth()
  async getUsers(
    @Query() query: UserFilterDto,
  ): Promise<IResponse<PaginationDto<UserGetSerialization>>> {
    const users = await this.userService.get(query);
    return {
      message: 'success',
      data: {
        entities: this.transformArray(UserGetSerialization, users.entities),
        meta: users.meta,
      },
    };
  }

  @Get(':id')
  @UseObjectInterceptors(
    {
      description: 'Get User by Id',
      status: 200,
    },
    UserGetSerialization,
  )
  @ApiOperation({
    summary: 'Get User by Id',
  })
  @ApiNotFound({
    message: 'User not found',
    description: 'User not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @ApiUnauthorized('You are not authorized to access this resource')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUsersById(
    @Param('id') id: number,
    @AuthUser() userLogin: UserEntity,
  ): Promise<IResponse<UserGetSerialization>> {
    if (userLogin.id !== id && userLogin.role !== RoleType.ADMIN) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'success',
      data: this.transformObject(UserGetSerialization, user),
    };
  }

  @Patch(':id')
  @UseObjectInterceptors({
    description: 'Update User by Id',
    status: 200,
  })
  @ApiOperation({
    summary: 'Update User by Id',
  })
  @ApiNotFound({
    message: 'User not found',
    description: 'User not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @ApiUnauthorized('You are not authorized to access this resource')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Transactional()
  async updateUsersById(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
    @AuthUser() userLogin: UserEntity,
  ): Promise<IResponse<void>> {
    if (userLogin.id !== id && userLogin.role !== RoleType.ADMIN) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    await this.userService.update(id, dto);
    return {
      message: 'success',
    };
  }

  @Delete(':id')
  @UseObjectInterceptors({
    description: 'Delete User by Id',
    status: 200,
  })
  @ApiOperation({
    summary: 'Delete User by Id',
  })
  @ApiNotFound({
    message: 'User not found',
    description: 'User not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  @ApiBearerAuth()
  @Transactional()
  async deleteUsersById(@Param('id') id: number): Promise<IResponse<void>> {
    await this.userService.delete(id);
    return {
      message: 'success',
    };
  }
}
