import { InjectRepository } from '@nestjs/typeorm';
import { IOrderRepository } from '../interface';
import { PaginationDto } from 'src/common/dto';
import { Repository } from 'typeorm';
import { CreateOrderDto, FilterOrderDto, UpdateOrderDto } from '../dto';
import { OrderEntity } from '../entities';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityCreatedEventDto, EntityUpdatedEventDto } from 'src/modules/audit_log/dto';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateOrderDto,performedBy?: string): Promise<OrderEntity> {
    const order = this.orderRepository.create(dto);
    const result = await this.orderRepository.save(order);

    this.eventEmitter.emit(
      'order.created',
      new EntityCreatedEventDto(result, performedBy, 'order', result.id),
    );
    return result;
  }

  async get(query: FilterOrderDto): Promise<PaginationDto<OrderEntity>> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    queryBuilder.leftJoinAndSelect('order.customer', 'customer');
    queryBuilder.leftJoinAndSelect('order.items', 'orderItems');
    queryBuilder.leftJoinAndSelect('orderItems.product', 'product');

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

  async getById(id: number): Promise<OrderEntity> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    queryBuilder.leftJoinAndSelect('order.customer', 'customer');
    queryBuilder.leftJoinAndSelect('order.items', 'orderItems');
    queryBuilder.leftJoinAndSelect('orderItems.product', 'product');
    queryBuilder.where('order.id = :id', { id });

    return queryBuilder.getOne();
  }

  async update(id: number, dto: UpdateOrderDto, performedBy?: string): Promise<void> {
    const oldData = await this.getById(id);
    await this.orderRepository.update(id, dto);
    this.eventEmitter.emit(
      'order.updated',
      new EntityUpdatedEventDto(oldData, dto, performedBy, 'order', id),
    );
  }

  async delete(id: number,performedBy?: string): Promise<void> {
    const oldData = await this.getById(id);
    await this.orderRepository.softDelete(id);
    this.eventEmitter.emit(
      'order.deleted',
      new EntityCreatedEventDto(oldData, performedBy, 'order', id),
    );
  }
}