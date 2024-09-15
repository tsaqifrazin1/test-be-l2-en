import { ApiProperty } from '@nestjs/swagger';
import { OrderDto } from './order.dto';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutDto extends OrderDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ListProducts)
  products: ListProducts[];
}

class ListProducts {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  productId: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  quantity: number; 
}