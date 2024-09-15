import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemEntity } from './entities';
import { OrderItemRepositoryToken, OrderItemServiceToken } from './interface';
import { OrderItemRepository } from './repository';
import { OrderItemService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItemEntity])],
  providers: [
    OrderItemService,
    OrderItemRepository,
    {
      provide: OrderItemRepositoryToken,
      useClass: OrderItemRepository,
    },
    {
      provide: OrderItemServiceToken,
      useClass: OrderItemService,
    },
  ],
  exports: [
    OrderItemService,
    OrderItemRepository,
    OrderItemRepositoryToken,
    OrderItemServiceToken,
  ],
})
export class OrderItemModule {}
