import { PartialType } from '@nestjs/swagger';
import { ProductCategoryDto } from './product_category.dto';

export class UpdateProductCategoryDto extends PartialType(ProductCategoryDto) {}