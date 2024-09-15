import { PaginationDto } from 'src/common/dto';
import { CreateProductDto, FilterProductDto, UpdateProductDto } from '../dto';
import { ProductEntity } from '../entities';

/**
 * @description ProductRepository Token
 */
export const ProductRepositoryToken = Symbol('ProductRepositoryToken');

/**
 * @description ProductRepository Interface
 */
export interface IProductRepository {
  /**
   * @description Create Product to Database
   */
  create(dto: CreateProductDto,performedBy?: string): Promise<ProductEntity>;

  /**
   * @description Get Product Count from Database
   */
  count(): Promise<number>;

  /**
   * @description Get Product from Database with Pagination
   */
  get(query: FilterProductDto): Promise<PaginationDto<ProductEntity>>;

  /**
   * @description Get Product by Id from Database
   */
  getById(id: number): Promise<ProductEntity>;

  /**
   * @description Get Product by Name from Database
   */
  getByName(name: string): Promise<ProductEntity>;

  /**
   * @description Update Product in Database
   */
  update(id: number, dto: UpdateProductDto, performedBy?: string): Promise<void>;

  /**
   * @description Soft Delete Product from Database
   */
  delete(id: number, performedBy?: string): Promise<void>;
}

/**
 * @description Product Service Token
 */
export const ProductServiceToken = Symbol('ProductServiceToken');

/**
 * @description Product Service Interface
 */
export interface IProductService {
  /**
   * @description Create Product
   */
  create(dto: CreateProductDto, performedBy?: string): Promise<ProductEntity>;

  /**
   * @description Get Product
   */
  get(query: FilterProductDto): Promise<PaginationDto<ProductEntity>>;

  /**
   * @description Get Product by Id
   */
  getById(id: number): Promise<ProductEntity>;

  /**
   * @description Update Product
   */
  update(id: number, dto: UpdateProductDto, performedBy?: string): Promise<void>;

  /**
   * @description Soft Delete Product
   */
  delete(id: number, performedBy?: string): Promise<void>;

  /**
   * @description Add Stock
   */
  addStock(id: number, stock: number, performedBy?: string): Promise<void>;

  /**
   * @description Reduce Stock
   */
  reduceStock(id: number, stock: number, performedBy?: string): Promise<void>;
}
