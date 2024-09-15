import { CreateOrderItemDto, UpdateOrderItemDto } from '../dto';
import { OrderItemEntity } from '../entities';

/**
 * @description OrderItemRepository Token
 */
export const OrderItemRepositoryToken = Symbol('OrderItemRepositoryToken');

/**
 * @description OrderItemRepository Interface
 */
export interface IOrderItemRepository {
  /**
   * @description Create OrderItem to Database
   */
  create(dto: CreateOrderItemDto, performedBy?: string): Promise<OrderItemEntity>;

  /**
   * @description Get OrderItem by Id from Database
   */
  getById(id: number): Promise<OrderItemEntity>;

  /**
   * @description Get OrderItem by OrderId from Database
   */
  getByOrderId(orderId: number): Promise<OrderItemEntity[]>;

  /**
   * @description Update OrderItem in Database
   */
  update(id: number, dto: UpdateOrderItemDto, performedBy?: string): Promise<void>;

  /**
   * @description Soft Delete OrderItem from Database
   */
  delete(id: number, performedBy?: string): Promise<void>;
}

/**
 * @description OrderItem Service Token
 */
export const OrderItemServiceToken = Symbol('OrderItemServiceToken');

/**
 * @description OrderItem Service Interface
 */
export interface IOrderItemService {
  /**
   * @description Create OrderItem
   */
  create(dto: CreateOrderItemDto,performedBy?: string): Promise<OrderItemEntity>;

  /**
   * @description Get OrderItem by Id
   */
  getById(id: number): Promise<OrderItemEntity>;

  /**
   * @description Get OrderItem by OrderId
   */
  getByOrderId(orderId: number): Promise<OrderItemEntity[]>;

  /**
   * @description Update OrderItem
   */
  update(id: number, dto: UpdateOrderItemDto, performedBy?: string): Promise<void>;

  /**
   * @description Soft Delete OrderItem
   */
  delete(id: number, performedBy?: string): Promise<void>;
}