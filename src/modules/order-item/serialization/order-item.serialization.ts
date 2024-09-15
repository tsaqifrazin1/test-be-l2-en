import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { OrderSerialization } from 'src/modules/order/serialization/order.serialization';
import { ProductSerialization } from 'src/modules/product/serialization/product.serialization';

@Exclude()
export class OrderItemSerialization {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  productId: number;

  @ApiProperty({
    type: () => ProductSerialization,
  })
  @Type(() => ProductSerialization)
  @Expose()
  product?: ProductSerialization;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  orderId: number;

  @ApiProperty({
    type: () => OrderSerialization,
  })
  @Type(() => OrderSerialization)
  @Expose()
  order?: OrderSerialization;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
