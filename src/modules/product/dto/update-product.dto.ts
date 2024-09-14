import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(ProductDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryName?: string;

  stock?: number;
}
