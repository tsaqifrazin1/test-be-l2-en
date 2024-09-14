import { InjectRepository } from '@nestjs/typeorm';
import { IProductCategoryRepository } from '../interface';
import { PaginationDto } from 'src/common/dto';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto, FilterProductCategoryDto, UpdateProductCategoryDto } from '../dto';
import { ProductCategoryEntity } from '../entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductCategoryRepository implements IProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly product_categoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  async create(dto: CreateProductCategoryDto): Promise<ProductCategoryEntity> {
    const product_category = this.product_categoryRepository.create(dto);
    return this.product_categoryRepository.save(product_category);
  }

  async get(query: FilterProductCategoryDto): Promise<PaginationDto<ProductCategoryEntity>> {
    const queryBuilder = this.product_categoryRepository.createQueryBuilder('product_category');

    if (query.name) {
      queryBuilder.andWhere('product_category.name LIKE :name', {
        name: `%${query.name}%`,
      });
    }

    queryBuilder.take(query.take);
    if ((query.page - 1) * query.take) {
      queryBuilder.skip((query.page - 1) * query.take);
    }
    const entities = await queryBuilder.getMany();
    const itemCount = await queryBuilder.getCount();

    const meta = {
      page: query.page,
      offset: query.take,
      itemCount,
      pageCount: Math.ceil(itemCount / query.take)
        ? Math.ceil(itemCount / query.take)
        : 0,
    };

    return {
      entities,
      meta,
    };
  }

  async getById(id: number): Promise<ProductCategoryEntity> {
    const queryBuilder = this.product_categoryRepository.createQueryBuilder('product_category');
    queryBuilder.where('product_category.id = :id', { id });

    return queryBuilder.getOne();
  }

  async getByName(name: string): Promise<ProductCategoryEntity> {
    const queryBuilder = this.product_categoryRepository.createQueryBuilder('product_category');
    queryBuilder.where('product_category.name = :name', { name });

    return queryBuilder.getOne();
  }

  async update(id: number, dto: UpdateProductCategoryDto): Promise<void> {
    await this.product_categoryRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.product_categoryRepository.softDelete(id);
  }
}