import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  OrderRepositoryToken,
  IOrderRepository,
  IOrderService,
} from '../interface';
import {
  CheckoutDto,
  CreateOrderDto,
  FilterOrderDto,
  UpdateOrderDto,
} from '../dto';
import { OrderEntity } from '../entities';
import { PaginationDto } from 'src/common/dto';
import {
  IOrderItemRepository,
  OrderItemRepositoryToken,
} from 'src/modules/order-item/interface';
import { OrderItemEntity } from 'src/modules/order-item/entities';
import {
  IProductRepository,
  IProductService,
  ProductRepositoryToken,
  ProductServiceToken,
} from 'src/modules/product/interface';
import { OrderStatus } from 'src/common/type';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject(OrderRepositoryToken)
    private readonly orderRepository: IOrderRepository,
    @Inject(OrderItemRepositoryToken)
    private readonly orderItemRepository: IOrderItemRepository,
    @Inject(ProductServiceToken)
    private readonly productService: IProductService,
  ) {}

  @Transactional()
  async checkout(dto: CheckoutDto, performedBy: string): Promise<OrderEntity> {
    let totalPrice = 0;
    const order = await this.orderRepository.create(
      {
        customerId: dto.customerId,
        status: OrderStatus.PENDING,
        customer: dto.customer,
        totalPrice: totalPrice,
      },
      performedBy,
    );

    let orderItems: OrderItemEntity[] = [];
    for (const product of dto.products) {
      const checkProduct = await this.productService.getById(product.productId);
      if (!checkProduct) {
        throw new NotFoundException('Product not found');
      }
      const orderItem = await this.orderItemRepository.create(
        {
          orderId: order.id,
          productId: product.productId,
          price: checkProduct.price,
          quantity: product.quantity,
        },
        performedBy,
      );

      await this.productService.reduceStock(
        product.productId,
        product.quantity,
        performedBy,
      );
      orderItems.push(orderItem);
    }

    totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await this.orderRepository.update(
      order.id,
      { totalPrice: order.totalPrice },
      performedBy,
    );
    order.totalPrice = totalPrice;
    return order;
  }

  async get(query: FilterOrderDto): Promise<PaginationDto<OrderEntity>> {
    return this.orderRepository.get(query);
  }

  async getById(id: number): Promise<OrderEntity> {
    return this.orderRepository.getById(id);
  }

  async update(
    id: number,
    dto: UpdateOrderDto,
    performedBy?: string,
  ): Promise<void> {
    const order = await this.orderRepository.getById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return this.orderRepository.update(id, dto, performedBy);
  }

  @Transactional()
  async updateStatus(
    id: number,
    status: OrderStatus,
    performedBy?: string,
  ): Promise<void> {
    const order = await this.orderRepository.getById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (status === OrderStatus.CANCELED) {
      const orderItems = await this.orderItemRepository.getByOrderId(id);
      for (const orderItem of orderItems) {
        const product = await this.productService.getById(orderItem.productId);
        await this.productService.addStock(
          product.id,
          orderItem.quantity,
          performedBy,
        );
      }
    }

    return this.orderRepository.update(id, { status }, performedBy);
  }
}
