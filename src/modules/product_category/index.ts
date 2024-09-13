import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryEntity } from './entities';
import { ProductCategoryController } from './controller';
import { ProductCategoryRepositoryToken, ProductCategoryServiceToken } from './interface';
import { ProductCategoryRepository } from './repository';
import { ProductCategoryService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategoryEntity])],
  controllers: [ProductCategoryController],
  providers: [
    ProductCategoryService,
    ProductCategoryRepository,
    {
      provide: ProductCategoryRepositoryToken,
      useClass: ProductCategoryRepository,
    },
    {
      provide: ProductCategoryServiceToken,
      useClass: ProductCategoryService,
    },
  ],
  exports: [
    ProductCategoryService,
    ProductCategoryRepository,
    ProductCategoryRepositoryToken,
    ProductCategoryServiceToken,
  ],
})
export class ProductCategoryModule {}
