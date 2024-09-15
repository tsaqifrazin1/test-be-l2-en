import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dto';
import { OrderItemEntity } from '../entities';
import { IOrderItemRepository } from '../interface';

@Injectable()
export class OrderItemRepository implements IOrderItemRepository {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async create(dto: CreateOrderItemDto): Promise<OrderItemEntity> {
    const orderItem = this.orderItemRepository.create(dto);
    return this.orderItemRepository.save(orderItem);
  }

  async getById(id: number): Promise<OrderItemEntity> {
    const queryBuilder = this.orderItemRepository.createQueryBuilder('orderItem');
    queryBuilder.where('orderItem.id = :id', { id });

    return queryBuilder.getOne();
  }

  async getByOrderId(orderId: number): Promise<OrderItemEntity[]> {
    const queryBuilder = this.orderItemRepository.createQueryBuilder('orderItem');
    queryBuilder.where('orderItem.orderId = :orderId', { orderId });

    return queryBuilder.getMany();
  }

  async update(id: number, dto: UpdateOrderItemDto): Promise<void> {
    await this.orderItemRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.orderItemRepository.softDelete(id);
  }
}