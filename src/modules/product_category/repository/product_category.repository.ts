import { InjectRepository } from '@nestjs/typeorm';
import { IProductCategoryRepository } from '../interface';
import { PaginationDto } from 'src/common/dto';
import { Repository } from 'typeorm';
import {
  CreateProductCategoryDto,
  FilterProductCategoryDto,
  UpdateProductCategoryDto,
} from '../dto';
import { ProductCategoryEntity } from '../entities';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityCreatedEventDto, EntityUpdatedEventDto } from 'src/modules/audit_log/dto';

@Injectable()
export class ProductCategoryRepository implements IProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly product_categoryRepository: Repository<ProductCategoryEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: CreateProductCategoryDto,
    performedBy?: string,
  ): Promise<ProductCategoryEntity> {
    const product_category = this.product_categoryRepository.create(dto);

    const result = await this.product_categoryRepository.save(product_category);
    this.eventEmitter.emit(
      'product_category.created',
      new EntityCreatedEventDto(
        result,
        performedBy,
        'product_category',
        result.id,
      ),
    );
    return result;
  }

  async get(
    query: FilterProductCategoryDto,
  ): Promise<PaginationDto<ProductCategoryEntity>> {
    const queryBuilder =
      this.product_categoryRepository.createQueryBuilder('product_category');

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
    const queryBuilder =
      this.product_categoryRepository.createQueryBuilder('product_category');
    queryBuilder.where('product_category.id = :id', { id });

    return queryBuilder.getOne();
  }

  async getByName(name: string): Promise<ProductCategoryEntity> {
    const queryBuilder =
      this.product_categoryRepository.createQueryBuilder('product_category');
    queryBuilder.where('product_category.name = :name', { name });

    return queryBuilder.getOne();
  }

  async update(
    id: number,
    dto: UpdateProductCategoryDto,
    performedBy?: string,
  ): Promise<void> {
    const oldData = await this.getById(id);
    await this.product_categoryRepository.update(id, dto);
    this.eventEmitter.emit(
      'product_category.updated',
      new EntityUpdatedEventDto(
        oldData,
        dto,
        performedBy,
        'product_category',
        id,
      ),
    );
  }

  async delete(id: number, performedBy?: string): Promise<void> {
    const oldData = await this.getById(id);
    await this.product_categoryRepository.softDelete(id);
    this.eventEmitter.emit(
      'product_category.deleted',
      new EntityCreatedEventDto(
        oldData,
        performedBy,
        'product_category',
        id,
      ),
    );
  }
}
