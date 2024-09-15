import { PaginationDto } from 'src/common/dto';
import { CreateOrderDto, FilterOrderDto, UpdateOrderDto } from '../dto';
import { OrderEntity } from '../entities';
import { OrderStatus } from 'src/common/type';

/**
 * @description OrderRepository Token
 */
export const OrderRepositoryToken = Symbol('OrderRepositoryToken');

/**
 * @description OrderRepository Interface
 */
export interface IOrderRepository {
  /**
   * @description Create Order to Database
   */
  create(dto: CreateOrderDto): Promise<OrderEntity>;

  /**
   * @description Get Order from Database with Pagination
   */
  get(query: FilterOrderDto): Promise<PaginationDto<OrderEntity>>;

  /**
   * @description Get Order by Id from Database
   */
  getById(id: number): Promise<OrderEntity>;

  /**
   * @description Update Order in Database
   */
  update(id: number, dto: UpdateOrderDto): Promise<void>;

  /**
   * @description Soft Delete Order from Database
   */
  delete(id: number): Promise<void>;
}

/**
 * @description Order Service Token
 */
export const OrderServiceToken = Symbol('OrderServiceToken');

/**
 * @description Order Service Interface
 */
export interface IOrderService {
  /**
   * @description Checkout Order
   */
  checkout(dto: CreateOrderDto): Promise<OrderEntity>;

  /**
   * @description Get Order
   */
  get(query: FilterOrderDto): Promise<PaginationDto<OrderEntity>>;

  /**
   * @description Get Order by Id
   */
  getById(id: number): Promise<OrderEntity>;

  /**
   * @description Update Order
   */
  update(id: number, dto: UpdateOrderDto): Promise<void>;

  /**
   * @description Update Order Status
   */
  updateStatus(id: number, status: OrderStatus): Promise<void>;
}
