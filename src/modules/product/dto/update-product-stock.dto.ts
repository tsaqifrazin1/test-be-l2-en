import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class UpdateProductStockDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  stock: number;
}
