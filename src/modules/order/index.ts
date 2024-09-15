import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemModule } from '../order-item';
import { ProductModule } from '../product';
import { OrderController } from './controller';
import { OrderEntity } from './entities';
import { OrderRepositoryToken, OrderServiceToken } from './interface';
import { OrderRepository } from './repository';
import { OrderService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), OrderItemModule, ProductModule],
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
