import { PaginationDto } from 'src/common/dto';
import { CreateProductCategoryDto, FilterProductCategoryDto, UpdateProductCategoryDto } from '../dto';
import { ProductCategoryEntity } from '../entities';

/**
 * @description ProductCategoryRepository Token
 */
export const ProductCategoryRepositoryToken = Symbol('ProductCategoryRepositoryToken');

/**
 * @description ProductCategoryRepository Interface
 */
export interface IProductCategoryRepository {
  /**
   * @description Create ProductCategory to Database
   */
  create(dto: CreateProductCategoryDto, performedBy?: string): Promise<ProductCategoryEntity>;

  /**
   * @description Get ProductCategory from Database with Pagination
   */
  get(query: FilterProductCategoryDto): Promise<PaginationDto<ProductCategoryEntity>>;

  /**
   * @description Get ProductCategory by Id from Database
   */
  getById(id: number): Promise<ProductCategoryEntity>;

  /**
   * @description Get ProductCategory by Name from Database
   */
  getByName(name: string): Promise<ProductCategoryEntity>;

  /**
   * @description Update ProductCategory in Database
   */
  update(id: number, dto: UpdateProductCategoryDto, performedBy?: string): Promise<void>;

  /**
   * @description Soft Delete ProductCategory from Database
   */
  delete(id: number, performedBy?: string): Promise<void>;
}

/**
 * @description ProductCategory Service Token
 */
export const ProductCategoryServiceToken = Symbol('ProductCategoryServiceToken');

/**
 * @description ProductCategory Service Interface
 */
export interface IProductCategoryService {
  /**
   * @description Create ProductCategory
   */
  create(dto: CreateProductCategoryDto, performedBy?: string): Promise<ProductCategoryEntity>;

  /**
   * @description Get ProductCategory
   */
  get(query: FilterProductCategoryDto, performedBy?: string): Promise<PaginationDto<ProductCategoryEntity>>;

  /**
   * @description Get ProductCategory by Id
   */
  getById(id: number): Promise<ProductCategoryEntity>;

  /**
   * @description Update ProductCategory
   */
  update(id: number, dto: UpdateProductCategoryDto, performedBy?: string): Promise<void>;

  /**
   * @description Soft Delete ProductCategory
   */
  delete(id: number, performedBy?: string): Promise<void>;
}