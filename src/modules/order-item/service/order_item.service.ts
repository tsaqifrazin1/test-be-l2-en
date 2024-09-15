import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IProductRepository,
  ProductRepositoryToken,
} from 'src/modules/product/interface';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dto';
import { OrderItemEntity } from '../entities';
import {
  IOrderItemRepository,
  IOrderItemService,
  OrderItemRepositoryToken,
} from '../interface';

@Injectable()
export class OrderItemService implements IOrderItemService {
  constructor(
    @Inject(OrderItemRepositoryToken)
    private readonly orderItemRepository: IOrderItemRepository,
  ) {}

  async create(dto: CreateOrderItemDto, performedBy?: string): Promise<OrderItemEntity> {
    dto.price = dto?.product?.price;
    return this.orderItemRepository.create(dto, performedBy);
  }

  async getById(id: number): Promise<OrderItemEntity> {
    return this.orderItemRepository.getById(id);
  }

  async getByOrderId(orderId: number): Promise<OrderItemEntity[]> {
    return this.orderItemRepository.getByOrderId(orderId)
  }

  async update(id: number, dto: UpdateOrderItemDto, performedBy?: string): Promise<void> {
    const orderItem = await this.orderItemRepository.getById(id);
    if(dto?.productId){
      dto.price = dto?.product?.price;
    }
    if (!orderItem) {
      throw new NotFoundException('OrderItem not found');
    }
    return this.orderItemRepository.update(id, dto, performedBy);
  }

  async delete(id: number, performedBy?: string): Promise<void> {
    const orderItem = await this.orderItemRepository.getById(id);
    if (!orderItem) {
      throw new NotFoundException('OrderItem not found');
    }
    return this.orderItemRepository.delete(id, performedBy);
  }
}
