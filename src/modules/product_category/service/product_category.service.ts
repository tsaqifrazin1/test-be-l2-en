import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductCategoryRepositoryToken,
  IProductCategoryRepository,
  IProductCategoryService,
} from '../interface';
import { CreateProductCategoryDto, FilterProductCategoryDto, UpdateProductCategoryDto } from '../dto';
import { ProductCategoryEntity } from '../entities';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ProductCategoryService implements IProductCategoryService {
  constructor(
    @Inject(ProductCategoryRepositoryToken)
    private readonly product_categoryRepository: IProductCategoryRepository,
  ) {}

  async create(dto: CreateProductCategoryDto): Promise<ProductCategoryEntity> {
    return this.product_categoryRepository.create(dto);
  }

  async get(query: FilterProductCategoryDto): Promise<PaginationDto<ProductCategoryEntity>> {
    return this.product_categoryRepository.get(query);
  }

  async getById(id: number): Promise<ProductCategoryEntity> {
    return this.product_categoryRepository.getById(id);
  }

  async update(id: number, dto: UpdateProductCategoryDto): Promise<void> {
    const product_category = await this.product_categoryRepository.getById(id);
    if (!product_category) {
      throw new NotFoundException('ProductCategory not found');
    }
    return this.product_categoryRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    const product_category = await this.product_categoryRepository.getById(id);
    if (!product_category) {
      throw new NotFoundException('ProductCategory not found');
    }
    return this.product_categoryRepository.delete(id);
  }
}