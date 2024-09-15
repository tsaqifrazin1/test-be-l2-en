import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities';
import { OrderController } from './controller';
import { OrderRepositoryToken, OrderServiceToken } from './interface';
import { OrderRepository } from './repository';
import { OrderService } from './service';
import { OrderItemModule } from '../order-item';
import { ProductEntity } from '../product/entities';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), OrderItemModule, ProductEntity],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    {
      provide: OrderRepositoryToken,
      useClass: OrderRepository,
    },
    {
      provide: OrderServiceToken,
      useClass: OrderService,
    },
  ],
  exports: [
    OrderService,
    OrderRepository,
    OrderRepositoryToken,
    OrderServiceToken,
  ],
})
export class OrderModule {}
