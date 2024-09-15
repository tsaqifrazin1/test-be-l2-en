import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/base.controller';
import { ApiNotFound } from 'src/common/decorators/error';
import {
  UseObjectInterceptors,
  UsePaginationInterceptors,
} from 'src/common/decorators/request';
import { IdSerialization } from 'src/common/serialization';
import { IResponse, PaginationData } from 'src/interceptors';
import { JwtAuthGuard } from 'src/modules/auth/guard';
import {
  CreateProductCategoryDto,
  FilterProductCategoryDto,
  UpdateProductCategoryDto,
} from '../dto';
import {
  IProductCategoryService,
  ProductCategoryServiceToken,
} from '../interface';
import { ProductCategorySerialization } from '../serialization/product_category.serialization';
import { RolesTypeGuard } from 'src/guards';
import { AuthUser, RolesTypeDecorators } from 'src/decorators';
import { RoleType } from 'src/common/type';
import { UserEntity } from 'src/modules/user/entitites';

@Controller('product-categories')
@ApiTags('ProductCategory')
@ApiBearerAuth()
export class ProductCategoryController extends BaseController {
  constructor(
    @Inject(ProductCategoryServiceToken)
    private readonly _product_categoryService: IProductCategoryService,
  ) {
    super();
  }

  @Post()
  @UseObjectInterceptors(
    {
      description: 'Create ProductCategory',
      status: HttpStatus.CREATED,
    },
    IdSerialization,
  )
  @ApiOperation({
    summary: 'Create ProductCategory',
  })
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async createProductCategory(
    @Body() dto: CreateProductCategoryDto,
    @AuthUser() user?: UserEntity,
  ): Promise<IResponse<IdSerialization>> {
    const product_category = await this._product_categoryService.create(
      dto,
      user?.username ?? 'system',
    );
    return {
      message: 'success create product_category',
      data: {
        id: product_category.id,
      },
    };
  }

  @Get()
  @UsePaginationInterceptors(
    {
      description: 'Get ProductCategory',
      status: HttpStatus.OK,
    },
    ProductCategorySerialization,
  )
  @ApiOperation({
    summary: 'Get ProductCategory',
  })
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async getProductCategories(
    @Query() query: FilterProductCategoryDto,
  ): Promise<IResponse<PaginationData<ProductCategorySerialization>>> {
    const companies = await this._product_categoryService.get(query);
    return {
      message: 'success',
      data: {
        entities: this.transformArray(
          ProductCategorySerialization,
          companies.entities,
        ),
        meta: companies.meta,
      },
    };
  }

  @Get(':id')
  @UseObjectInterceptors(
    {
      description: 'Get ProductCategory by Id',
      status: HttpStatus.OK,
    },
    ProductCategorySerialization,
  )
  @ApiOperation({
    summary: 'Get ProductCategory by Id',
  })
  @ApiNotFound({
    message: 'ProductCategory not found',
    description: 'ProductCategory not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async getProductCategoryById(
    @Param('id') id: number,
  ): Promise<IResponse<ProductCategorySerialization>> {
    const product_category = await this._product_categoryService.getById(id);
    if (!product_category) {
      throw new NotFoundException('ProductCategory not found');
    }
    return {
      message: 'success',
      data: this.transformObject(
        ProductCategorySerialization,
        product_category,
      ),
    };
  }

  @Patch(':id')
  @UseObjectInterceptors({
    description: 'Update ProductCategory by Id',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Update ProductCategory by Id',
  })
  @ApiNotFound({
    message: 'ProductCategory not found',
    description: 'ProductCategory not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async updateProductCategoryById(
    @Param('id') id: number,
    @Body() dto: UpdateProductCategoryDto,
    @AuthUser() user?: UserEntity,
  ): Promise<IResponse<void>> {
    await this._product_categoryService.update(
      id,
      dto,
      user?.username ?? 'system',
    );
    return {
      message: 'success update product_category',
    };
  }

  @Delete(':id')
  @UseObjectInterceptors({
    description: 'Delete ProductCategory by Id',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Delete ProductCategory by Id',
  })
  @ApiNotFound({
    message: 'ProductCategory not found',
    description: 'ProductCategory not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async deleteProductCategoryById(
    @Param('id') id: number,
    @AuthUser() user?: UserEntity,
  ): Promise<IResponse<void>> {
    await this._product_categoryService.delete(id, user?.username ?? 'system');
    return {
      message: 'success delete product_category',
    };
  }
}
