import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
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
import { CreateProductDto, FilterProductDto, UpdateProductDto } from '../dto';
import { IProductService, ProductServiceToken } from '../interface';
import { ProductSerialization } from '../serialization/product.serialization';

@Controller('products')
@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProductController extends BaseController {
  constructor(
    @Inject(ProductServiceToken)
    private readonly _productService: IProductService,
  ) {
    super();
  }

  @Post()
  @UseObjectInterceptors(
    {
      description: 'Create Product',
      status: HttpStatus.CREATED,
    },
    IdSerialization,
  )
  @ApiOperation({
    summary: 'Create Product',
  })
  async createProduct(
    @Body() dto: CreateProductDto,
  ): Promise<IResponse<IdSerialization>> {
    const product = await this._productService.create(dto);
    return {
      message: 'success create product',
      data: {
        id: product.id,
      },
    };
  }

  @Get()
  @UsePaginationInterceptors(
    {
      description: 'Get Product',
      status: HttpStatus.OK,
    },
    ProductSerialization,
  )
  @ApiOperation({
    summary: 'Get Product',
  })
  async getProducts(
    @Query() query: FilterProductDto,
  ): Promise<IResponse<PaginationData<ProductSerialization>>> {
    const companies = await this._productService.get(query);
    return {
      message: 'success',
      data: {
        entities: this.transformArray(ProductSerialization, companies.entities),
        meta: companies.meta,
      },
    };
  }

  @Get(':id')
  @UseObjectInterceptors(
    {
      description: 'Get Product by Id',
      status: HttpStatus.OK,
    },
    ProductSerialization,
  )
  @ApiOperation({
    summary: 'Get Product by Id',
  })
  @ApiNotFound({
    message: 'Product not found',
    description: 'Product not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async getProductById(
    @Param('id') id: number,
  ): Promise<IResponse<ProductSerialization>> {
    const product = await this._productService.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      message: 'success',
      data: this.transformObject(ProductSerialization, product),
    };
  }

  @Patch(':id')
  @UseObjectInterceptors({
    description: 'Update Product by Id',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Update Product by Id',
  })
  @ApiNotFound({
    message: 'Product not found',
    description: 'Product not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async updateProductById(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<IResponse<void>> {
    await this._productService.update(id, dto);
    return {
      message: 'success update product',
    };
  }

  @Delete(':id')
  @UseObjectInterceptors({
    description: 'Delete Product by Id',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Delete Product by Id',
  })
  @ApiNotFound({
    message: 'Product not found',
    description: 'Product not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async deleteProductById(@Param('id') id: number): Promise<IResponse<void>> {
    await this._productService.delete(id);
    return {
      message: 'success delete product',
    };
  }

  @Patch(':id/stock/add')
  @UseObjectInterceptors({
    description: 'Add Stock',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Add Stock',
  })
  @ApiNotFound({
    message: 'Product not found',
    description: 'Product not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async addStock(
    @Param('id') id: number,
    @Body('stock', new ParseIntPipe()) stock: number,
  ): Promise<IResponse<void>> {
    await this._productService.addStock(id, stock);
    return {
      message: 'success add stock',
    };
  }

  @Patch(':id/stock/reduce')
  @UseObjectInterceptors({
    description: 'Reduce Stock',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Reduce Stock',
  })
  @ApiNotFound({
    message: 'Product not found',
    description: 'Product not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async reduceStock(
    @Param('id') id: number,
    @Body('stock', new ParseIntPipe()) stock: number,
  ): Promise<IResponse<void>> {
    await this._productService.reduceStock(id, stock);
    return {
      message: 'success reduce stock',
    };
  }
}
