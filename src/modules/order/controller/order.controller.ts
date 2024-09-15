import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/base.controller';
import {
  UseObjectInterceptors,
  UsePaginationInterceptors,
} from 'src/common/decorators/request';
import { IdSerialization } from 'src/common/serialization';
import { AuthUser, RolesTypeDecorators } from 'src/decorators';
import { RolesTypeGuard } from 'src/guards';
import { JwtAuthGuard } from 'src/modules/auth/guard';
import {
  CheckoutDto,
  CreateOrderDto,
  FilterOrderDto,
  UpdateOrderDto,
} from '../dto';
import { IResponse, PaginationData } from 'src/interceptors';
import { OrderServiceToken, IOrderService } from '../interface';
import { OrderSerialization } from '../serialization/order.serialization';
import { ApiNotFound } from 'src/common/decorators/error';
import { UserEntity } from 'src/modules/user/entitites';
import { OrderStatus, RoleType } from 'src/common/type';

@Controller('orders')
@ApiTags('Order')
@ApiBearerAuth()
export class OrderController extends BaseController {
  constructor(
    @Inject(OrderServiceToken)
    private readonly _orderService: IOrderService,
  ) {
    super();
  }

  @Post()
  @UseObjectInterceptors(
    {
      description: 'Create Order',
      status: HttpStatus.CREATED,
    },
    IdSerialization,
  )
  @ApiOperation({
    summary: 'Create Order',
  })
  @UseGuards(JwtAuthGuard)
  async checkoutOrder(
    @Body() dto: CheckoutDto,
    @AuthUser() user: UserEntity,
  ): Promise<IResponse<IdSerialization>> {
    dto.customerId = user.id;
    const order = await this._orderService.checkout(dto, user?.username ?? 'system');
    return {
      message: 'success create order',
      data: {
        id: order.id,
      },
    };
  }

  @Get()
  @UsePaginationInterceptors(
    {
      description: 'Get Order',
      status: HttpStatus.OK,
    },
    OrderSerialization,
  )
  @ApiOperation({
    summary: 'Get Order',
  })
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async getOrders(
    @Query() query: FilterOrderDto,
  ): Promise<IResponse<PaginationData<OrderSerialization>>> {
    const orders = await this._orderService.get(query);
    return {
      message: 'success',
      data: {
        entities: this.transformArray(OrderSerialization, orders.entities),
        meta: orders.meta,
      },
    };
  }

  @Get(':id')
  @UseObjectInterceptors(
    {
      description: 'Get Order by Id',
      status: HttpStatus.OK,
    },
    OrderSerialization,
  )
  @ApiOperation({
    summary: 'Get Order by Id',
  })
  @ApiNotFound({
    message: 'Order not found',
    description: 'Order not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @UseGuards(JwtAuthGuard)
  async getOrderById(
    @Param('id') id: number,
    @AuthUser() user: UserEntity,
  ): Promise<IResponse<OrderSerialization>> {
    const order = await this._orderService.getById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.customerId !== user.id) {
      throw new NotFoundException('Order not found');
    }
    
    return {
      message: 'success',
      data: this.transformObject(OrderSerialization, order),
    };
  }

  @Patch(':id')
  @UseObjectInterceptors({
    description: 'Update Order by Id',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Update Order by Id',
  })
  @ApiNotFound({
    message: 'Order not found',
    description: 'Order not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async updateOrderById(
    @Param('id') id: number,
    @Body() dto: UpdateOrderDto,
    @AuthUser() user?: UserEntity,
  ): Promise<IResponse<void>> {
    await this._orderService.update(id, dto, user?.username ?? 'system');
    return {
      message: 'success update order',
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  @UseObjectInterceptors({
    description: 'Update Order Status by Id',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Update Order Status by Id',
  })
  @ApiNotFound({
    message: 'Order not found',
    description: 'Order not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async updateOrderStatusById(
    @Param('id') id: number,
    @Body('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
    @AuthUser() user?: UserEntity,
  ): Promise<IResponse<void>> {
    await this._orderService.updateStatus(id, status, user?.username ?? 'system');
    return {
      message: 'success update order status',
    };
  }
}
