import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProductCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
}