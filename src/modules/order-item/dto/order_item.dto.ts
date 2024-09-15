import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { OrderEntity } from 'src/modules/order/entities';
import { ProductEntity } from 'src/modules/product/entities';

export class OrderItemDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId: number;
  
  product?: ProductEntity;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  price: number;

  @ApiProperty()
  @IsNumber()
  orderId: number;
  
  order?: OrderEntity;
}
