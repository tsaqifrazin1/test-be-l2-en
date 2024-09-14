import { IsString } from 'class-validator';
import { ProductDto } from './product.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto extends ProductDto {
  @ApiProperty()
  @IsString()
  categoryName?: string;
}
