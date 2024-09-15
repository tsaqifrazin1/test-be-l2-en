import { InjectRepository } from '@nestjs/typeorm';
import { IOrderRepository } from '../interface';
import { PaginationDto } from 'src/common/dto';
import { Repository } from 'typeorm';
import { CreateOrderDto, FilterOrderDto, UpdateOrderDto } from '../dto';
import { OrderEntity } from '../entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderEntity> {
    const order = this.orderRepository.create(dto);
    return this.orderRepository.save(order);
  }

  async get(query: FilterOrderDto): Promise<PaginationDto<OrderEntity>> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    if (query.name) {
      queryBuilder.andWhere('order.name LIKE :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.address) {
      queryBuilder.andWhere('order.address LIKE :address', {
        address: `%${query.address}%`,
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

  async getById(id: number): Promise<OrderEntity> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');
    queryBuilder.where('order.id = :id', { id });

    return queryBuilder.getOne();
  }

  async update(id: number, dto: UpdateOrderDto): Promise<void> {
    await this.orderRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.orderRepository.softDelete(id);
  }
}