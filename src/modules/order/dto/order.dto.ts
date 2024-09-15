import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { OrderStatus } from 'src/common/type';
import { OrderItemEntity } from 'src/modules/order-item/entities';
import { UserEntity } from 'src/modules/user/entitites';

export class OrderDto {
  customerId: number;

  customer: UserEntity;
  
  totalPrice: number;
  
  status: OrderStatus;

  items?: OrderItemEntity[];
}
