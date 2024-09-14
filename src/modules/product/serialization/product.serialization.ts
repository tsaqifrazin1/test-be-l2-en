import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ProductCategorySerialization } from 'src/modules/product_category/serialization/product_category.serialization';

@Exclude()
export class ProductSerialization {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  sku: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  weight: number;

  @ApiProperty()
  @Expose()
  width: number;

  @ApiProperty()
  @Expose()
  length: number;

  @ApiProperty()
  @Expose()
  height: number;

  @ApiProperty()
  @Expose()
  image?: string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  stock: number;

  @ApiProperty()
  @Expose()
  categoryId?: number;

  @ApiProperty({
    type: () => ProductCategorySerialization,
  })
  @Type(() => ProductCategorySerialization)
  @Expose()
  category?: ProductCategorySerialization;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
