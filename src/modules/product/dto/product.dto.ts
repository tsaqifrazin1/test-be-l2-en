import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductCategoryEntity } from 'src/modules/product_category/entities';

export class ProductDto {
  sku: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  weight: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  width: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  length: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  height: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  stock: number;

  category?: ProductCategoryEntity;
  categoryId?: number;
}
