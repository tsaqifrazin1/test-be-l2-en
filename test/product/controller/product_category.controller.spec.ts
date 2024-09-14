import { da } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from 'src/modules/product/controller';
import { CreateProductDto } from 'src/modules/product/dto';
import {
  IProductService,
  ProductServiceToken,
} from 'src/modules/product/interface';
import { ProductSerialization } from 'src/modules/product/serialization/product.serialization';
import { ProductCategorySerialization } from 'src/modules/product_category/serialization/product_category.serialization';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: IProductService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductServiceToken,
          useValue: {
            create: jest.fn(),
            get: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addStock: jest.fn(),
            reduceStock: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<IProductService>(ProductServiceToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('create', () => {
    it('should create product', async () => {
      const dto: CreateProductDto = {
        name: 'test',
        sku: 'test',
        description: 'test',
        price: 1000,
        stock: 10,
        categoryId: 1,
        height: 10,
        width: 10,
        length: 10,
        weight: 10,
        image: 'test',
        categoryName: 'test',
      };

      jest.spyOn(productService, 'create').mockResolvedValue({
        id: 1,
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        sku: 'test',
        description: 'test',
        price: 1000,
        stock: 10,
        categoryId: 1,
        category: {
          id: 1,
          name: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        height: 10,
        width: 10,
        length: 10,
        weight: 10,
        image: 'test',
      });

      const result = await controller.createProduct(dto);
      expect(productService.create).toBeCalledWith(dto);
      expect(result).toEqual({
        message: 'success create product',
        data: {
          id: 1,
        },
      });
    });
  });

  describe('get', () => {
    it('should get products', async () => {
      const query = { page: 1, take: 10 };

      jest.spyOn(productService, 'get').mockResolvedValue({
        entities: [
          {
            id: 1,
            name: 'test',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            sku: 'test',
            description: 'test',
            price: 1000,
            stock: 10,
            categoryId: 1,
            category: {
              id: 1,
              name: 'test',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
            height: 10,
            width: 10,
            length: 10,
            weight: 10,
            image: 'test',
          },
        ],
        meta: {
          page: 1,
          offset: 10,
          itemCount: 1,
          pageCount: 1,
        },
      });

      const result = await controller.getProducts(query);
      expect(productService.get).toBeCalledWith(query);
      expect(result).toEqual({
        message: 'success',
        data: {
          entities: [
            {
              id: 1,
              name: 'test',
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              sku: 'test',
              description: 'test',
              price: 1000,
              stock: 10,
              categoryId: 1,
              category: {
                id: 1,
                name: 'test',
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
              } as ProductCategorySerialization,
              height: 10,
              width: 10,
              length: 10,
              weight: 10,
              image: 'test',
            },
          ] as ProductSerialization[],
          meta: {
            page: 1,
            offset: 10,
            itemCount: 1,
            pageCount: 1,
          },
        },
      });
    });
  });

  describe('getById', () => {
    it('should get product by id', async () => {
      const id = 1;

      jest.spyOn(productService, 'getById').mockResolvedValue({
        id: 1,
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        sku: 'test',
        description: 'test',
        price: 1000,
        stock: 10,
        categoryId: 1,
        category: {
          id: 1,
          name: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        height: 10,
        width: 10,
        length: 10,
        weight: 10,
        image: 'test',
      });

      const result = await controller.getProductById(id);
      expect(productService.getById).toBeCalledWith(id);

      expect(result).toEqual({
        message: 'success',
        data: {
          id: 1,
          name: 'test',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          sku: 'test',
          description: 'test',
          price: 1000,
          stock: 10,
          categoryId: 1,
          category: {
            id: 1,
            name: 'test',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          } as ProductCategorySerialization,
          height: 10,
          width: 10,
          length: 10,
          weight: 10,
          image: 'test',
        } as ProductSerialization,
      });
    });

    it('should throw error when product not found', async () => {
      const id = 1;

      jest.spyOn(productService, 'getById').mockResolvedValue(null);

      await expect(controller.getProductById(id)).rejects.toThrowError(
        'Product not found',
      );
    });
  });

  describe('update', () => {
    it('should update product by id', async () => {
      const id = 1;
      const dto: CreateProductDto = {
        name: 'test',
        sku: 'test',
        description: 'test',
        price: 1000,
        stock: 10,
        categoryId: 1,
        height: 10,
        width: 10,
        length: 10,
        weight: 10,
        image: 'test',
        categoryName: 'test',
      };

      jest.spyOn(productService, 'update').mockResolvedValue(null);

      await controller.updateProductById(id, dto);
      expect(productService.update).toBeCalledWith(id, dto);
    });
  });

  describe('delete', () => {
    it('should delete product by id', async () => {
      const id = 1;

      jest.spyOn(productService, 'delete').mockResolvedValue(null);

      await controller.deleteProductById(id);
      expect(productService.delete).toBeCalledWith(id);
    });
  });

  describe('addStock', () => {
    it('should add stock to product by id', async () => {
      const id = 1;
      const stock = 10;

      jest.spyOn(productService, 'addStock').mockResolvedValue(null);

      await controller.addStock(id, stock);
      expect(productService.addStock).toBeCalledWith(id, stock);
    });
  });

  describe('reduceStock', () => {
    it('should reduce stock to product by id', async () => {
      const id = 1;
      const stock = 10;

      jest.spyOn(productService, 'reduceStock').mockResolvedValue(null);

      await controller.reduceStock(id, stock);
      expect(productService.reduceStock).toBeCalledWith(id, stock);
    });
  });
});
