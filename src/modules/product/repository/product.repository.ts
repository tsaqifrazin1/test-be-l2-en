import { InjectRepository } from '@nestjs/typeorm';
import { IProductRepository } from '../interface';
import { PaginationDto } from 'src/common/dto';
import { Repository } from 'typeorm';
import { CreateProductDto, FilterProductDto, UpdateProductDto } from '../dto';
import { ProductEntity } from '../entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
  }

  async get(query: FilterProductDto): Promise<PaginationDto<ProductEntity>> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder.leftJoinAndSelect('product.category', 'category');

    if (query.name) {
      queryBuilder.andWhere('product.name LIKE :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.sku) {
      queryBuilder.andWhere('product.sku LIKE :sku', {
        sku: `%${query.sku}%`,
      });
    }

    if (query.priceMin) {
      queryBuilder.andWhere('product.price >= :priceMin', {
        priceMin: query.priceMin,
      });
    }

    if (query.priceMax) {
      queryBuilder.andWhere('product.price <= :priceMax', {
        priceMax: query.priceMax,
      });
    }

    if (query.category) {
      queryBuilder.andWhere('product.category = :category', {
        category: query.category,
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

  async getById(id: number): Promise<ProductEntity> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder.where('product.id = :id', { id });

    return queryBuilder.getOne();
  }

  async getByName(name: string): Promise<ProductEntity> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder.where('product.name = :name', { name });

    return queryBuilder.getOne();
  }

  async update(id: number, dto: UpdateProductDto): Promise<void> {
    await this.productRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.productRepository.softDelete(id);
  }

  async count(): Promise<number> {
    return this.productRepository.count();
  }
}