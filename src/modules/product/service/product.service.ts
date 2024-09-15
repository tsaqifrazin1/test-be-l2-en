import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ProductRepositoryToken,
  IProductRepository,
  IProductService,
} from '../interface';
import {
  CreateProductDto,
  FilterProductDto,
  ProductDto,
  UpdateProductDto,
} from '../dto';
import { ProductEntity } from '../entities';
import { PaginationDto } from 'src/common/dto';
import {
  IProductCategoryRepository,
  ProductCategoryRepositoryToken,
} from 'src/modules/product_category/interface';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { UtilsService } from '../../../utils/utils.service';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly productRepository: IProductRepository,
    @Inject(ProductCategoryRepositoryToken)
    private readonly productCategoryRepository: IProductCategoryRepository,
  ) {}

  async create(dto: CreateProductDto, performedBy?: string): Promise<ProductEntity> {
    const checkProduct = await this.productRepository.getByName(dto.name);
    if (checkProduct) {
      throw new NotFoundException('Product already exists');
    }

    let productCategory = await this.productCategoryRepository.getByName(
      dto.categoryName,
    );
    if (!productCategory) {
      productCategory = await this.productCategoryRepository.create({
        name: dto.categoryName,
      }, performedBy);
    }

    const sku = await this._generateSku();
    const { categoryName, ...productDto } = dto;
    return this.productRepository.create({
      ...productDto,
      sku,
      categoryId: productCategory.id,
    }, performedBy);
  }

  async get(query: FilterProductDto): Promise<PaginationDto<ProductEntity>> {
    return this.productRepository.get(query);
  }

  async getById(id: number): Promise<ProductEntity> {
    return this.productRepository.getById(id);
  }

  async update(id: number, dto: UpdateProductDto, performedBy?: string): Promise<void> {
    const product = await this.productRepository.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.name) {
      const checkProduct = await this.productRepository.getByName(dto.name);
      if (checkProduct && checkProduct.id !== id) {
        throw new NotFoundException('Product already exists');
      }
    }

    if (dto.categoryName) {
      let productCategory = await this.productCategoryRepository.getByName(
        dto.categoryName,
      );
      if (!productCategory) {
        productCategory = await this.productCategoryRepository.create({
          name: dto.categoryName,
        });
      }
      dto.categoryId = productCategory.id;
    }

    return this.productRepository.update(id, dto, performedBy);
  }

  async delete(id: number, performedBy?: string): Promise<void> {
    const product = await this.productRepository.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepository.delete(id, performedBy);
  }

  async addStock(id: number, stock: number, performedBy?: string): Promise<void> {
    const product = await this.productRepository.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepository.update(id, { stock: product.stock + stock }, performedBy);
  }

  async reduceStock(id: number, stock: number, performedBy?: string): Promise<void> {
    const product = await this.productRepository.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.stock < stock) {
      throw new NotFoundException('Stock not enough');
    }
    return this.productRepository.update(id, { stock: product.stock - stock }, performedBy);
  }

  private async _generateSku(): Promise<string> {
    const countProducts = await this.productRepository.count();

    const generator = UtilsService.generateRandomString(6);
    let sku = '';
    let i = 0;
    do {
      i++;
      sku = generator.next().value as string;
    } while (i <= countProducts);

    return sku;
  }
}
