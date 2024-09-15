import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { OrderStatus } from 'src/common/type';
import { OrderItemEntity } from 'src/modules/order-item/entities';
import { OrderItemSerialization } from 'src/modules/order-item/serialization/order-item.serialization';
import { UserGetSerialization } from 'src/modules/user/serializations/user.serialization';

@Exclude()
export class OrderSerialization {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  customerId: number;

  @ApiProperty({
    type: () => UserGetSerialization,
  })
  @Type(() => UserGetSerialization)
  @Expose()
  customer: UserGetSerialization;
  
  @ApiProperty()
  @Expose()
  totalPrice: number;
  
  @ApiProperty()
  @Expose()
  status: OrderStatus;

  @ApiProperty({
    type: () => [OrderItemSerialization],
  })
  @Type(() => OrderItemSerialization)
  @Expose()
  items?: OrderItemEntity[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}