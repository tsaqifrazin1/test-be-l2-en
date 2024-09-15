import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities';
import { ProductController } from './controller';
import { ProductRepositoryToken, ProductServiceToken } from './interface';
import { ProductRepository } from './repository';
import { ProductService } from './service';
import { ProductCategoryModule } from '../product_category';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ProductCategoryModule,
    EventEmitterModule.forRoot({ wildcard: true }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    {
      provide: ProductRepositoryToken,
      useClass: ProductRepository,
    },
    {
      provide: ProductServiceToken,
      useClass: ProductService,
    },
  ],
  exports: [
    ProductService,
    ProductRepository,
    ProductRepositoryToken,
    ProductServiceToken,
  ],
})
export class ProductModule {}
