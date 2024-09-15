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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
  UpdateProductStockDto,
} from '../dto';
import { IProductService, ProductServiceToken } from '../interface';
import { ProductSerialization } from '../serialization/product.serialization';
import { RolesTypeGuard } from 'src/guards';
import { AuthUser, RolesTypeDecorators } from 'src/decorators';
import { RoleType } from 'src/common/type';
import { UserEntity } from 'src/modules/user/entitites';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from 'src/modules/upload_file/dto/upload_file.dto';
import {
  IUploadFileService,
  UploadFileServiceToken,
} from 'src/modules/upload_file/interface/upload_file.interface';

@Controller('products')
@ApiTags('Product')
@ApiBearerAuth()
export class ProductController extends BaseController {
  constructor(
    @Inject(ProductServiceToken)
    private readonly _productService: IProductService,
    @Inject(UploadFileServiceToken)
    private readonly _uploadFileService: IUploadFileService,
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
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async createProduct(
    @Body() dto: CreateProductDto,
    @AuthUser() user?: UserEntity,
  ): Promise<IResponse<IdSerialization>> {
    const product = await this._productService.create(
      dto,
      user?.username ?? 'system',
    );
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async updateProductById(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
    @AuthUser() user?: UserEntity,
  ): Promise<IResponse<void>> {
    await this._productService.update(id, dto, user?.username ?? 'system');
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
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async deleteProductById(
    @Param('id') id: number,
    @AuthUser() user?: UserEntity,
  ): Promise<IResponse<void>> {
    await this._productService.delete(id, user?.username ?? 'system');
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
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async addStock(
    @Param('id') id: number,
    @Body() dto: UpdateProductStockDto,
    @AuthUser() user?: UserEntity,
  ): Promise<IResponse<void>> {
    await this._productService.addStock(
      id,
      dto.stock,
      user?.username ?? 'system',
    );
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
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @RolesTypeDecorators(RoleType.ADMIN)
  async reduceStock(
    @Param('id') id: number,
    @Body() dto: UpdateProductStockDto,
    @AuthUser() user?: UserEntity,
  ): Promise<IResponse<void>> {
    await this._productService.reduceStock(
      id,
      dto.stock,
      user?.username ?? 'system',
    );
    return {
      message: 'success reduce stock',
    };
  }

  @Post(':id/image')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesTypeGuard)
  @ApiConsumes('multipart/form-data')
  @RolesTypeDecorators(RoleType.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: UserEntity,
    @Body() uploadFile?: UploadFileDto,
  ) {
    const url = await this._uploadFileService.uploadFile(file, user.id, {
      containerName: 'product-image',
    });

    await this._productService.update(id, { image: url }, user.username);

    return { message: 'uploaded successfully' };
  }
}
