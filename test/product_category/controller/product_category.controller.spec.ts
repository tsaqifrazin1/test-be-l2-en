import { TestingModule, Test } from '@nestjs/testing';
import { create } from 'domain';
import { ProductCategoryController } from 'src/modules/product_category/controller';
import {
  IProductCategoryService,
  ProductCategoryServiceToken,
} from 'src/modules/product_category/interface';
import { ProductCategoryService } from 'src/modules/product_category/service';

describe('ProductCategoryController', () => {
  let controller: ProductCategoryController;
  let service: IProductCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoryController],
      providers: [
        {
          provide: ProductCategoryServiceToken,
          useValue: {
            get: jest.fn(() => []),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductCategoryController>(
      ProductCategoryController,
    );
    service = module.get<IProductCategoryService>(ProductCategoryServiceToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create Product Category', () => {
    it('should create product category', async () => {
      const dto = { name: 'test' };

      jest.spyOn(service, 'create').mockResolvedValue({
        id: 1,
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await controller.createProductCategory(dto);
      expect(service.create).toBeCalledWith(dto, 'system');
      expect(result).toEqual({
        message: 'success create product_category',
        data: {
          id: 1,
        },
      });
    });
  });

  describe('Get Product Category', () => {
    it('should get product category', async () => {
      const query = { name: 'test' };

      jest.spyOn(service, 'get').mockResolvedValue({
        entities: [
          {
            id: 1,
            name: 'test',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ],
        meta: {
          page: 1,
          offset: 10,
          itemCount: 1,
          pageCount: 1,
        },
      });

      const result = await controller.getProductCategories(query);
      expect(service.get).toBeCalledWith(query);
      expect(result).toEqual({
        message: 'success',
        data: {
          entities: [
            {
              id: 1,
              name: 'test',
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            },
          ],
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

  describe('Get Product Category By Id', () => {
    it('should get product category by id', async () => {
      const id = 1;

      jest.spyOn(service, 'getById').mockResolvedValue({
        id: 1,
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await controller.getProductCategoryById(id);
      expect(service.getById).toBeCalledWith(id);
      expect(result).toEqual({
        message: 'success',
        data: {
          id: 1,
          name: 'test',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('Update Product Category', () => {
    it('should update product category', async () => {
      const id = 1;
      const dto = { name: 'test' };

      jest.spyOn(service, 'update').mockResolvedValue();

      const result = await controller.updateProductCategoryById(id, dto);
      expect(service.update).toBeCalledWith(id, dto, 'system');
      expect(result).toEqual({
        message: 'success update product_category',
      });
    });
  });

  describe('Delete Product Category', () => {
    it('should delete product category', async () => {
      const id = 1;

      jest.spyOn(service, 'delete').mockResolvedValue();

      const result = await controller.deleteProductCategoryById(id);
      expect(service.delete).toBeCalledWith(id, 'system');
      expect(result).toEqual({
        message: 'success delete product_category',
      });
    });
  });
});
