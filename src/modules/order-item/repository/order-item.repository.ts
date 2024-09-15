import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dto';
import { OrderItemEntity } from '../entities';
import { IOrderItemRepository } from '../interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityCreatedEventDto, EntityUpdatedEventDto } from 'src/modules/audit_log/dto';

@Injectable()
export class OrderItemRepository implements IOrderItemRepository {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateOrderItemDto, performedBy?: string): Promise<OrderItemEntity> {
    const orderItem = this.orderItemRepository.create(dto);
    const result = await this.orderItemRepository.save(orderItem);
    this.eventEmitter.emit(
      'orderItem.created',
      new EntityCreatedEventDto(result, performedBy, 'order_item', result.id),
    );

    return result;
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

  async update(id: number, dto: UpdateOrderItemDto, performedBy?: string): Promise<void> {
    const oldData = await this.getById(id);
    await this.orderItemRepository.update(id, dto);

    this.eventEmitter.emit(
      'orderItem.updated',
      new EntityUpdatedEventDto(oldData, dto, performedBy, 'order_item', id),
    );
  }

  async delete(id: number, performedBy?: string): Promise<void> {
    const oldData = await this.getById(id);
    await this.orderItemRepository.softDelete(id);

    this.eventEmitter.emit(
      'orderItem.deleted',
      new EntityUpdatedEventDto(oldData, null, performedBy, 'order_item', id),
    );
  }
}