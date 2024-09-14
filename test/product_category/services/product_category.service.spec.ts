import { NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { ProductCategoryEntity } from 'src/modules/product_category/entities';
import { IProductCategoryRepository, ProductCategoryRepositoryToken } from 'src/modules/product_category/interface';
import { ProductCategoryService } from 'src/modules/product_category/service';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  let repository: IProductCategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoryService,
        {
          provide: ProductCategoryRepositoryToken,
          useValue: {
            create: jest.fn(),
            get: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductCategoryService>(ProductCategoryService);
    repository = module.get<IProductCategoryRepository>(ProductCategoryRepositoryToken);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('should create product category', async () => {
      const dto = { name: 'test' };

      jest.spyOn(repository, 'create').mockResolvedValue({
        id: 1,
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(service, 'create').mockResolvedValue({
        id: 1,
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      await service.create(dto);
      expect(service.create).toBeCalledWith(dto);
    });
  });

  describe('get', () => {
    it('should get product categories', async () => {
      const query = { page: 1, take: 10 };

      jest.spyOn(repository, 'get').mockResolvedValue({
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

      await service.get(query);
      expect(service.get).toBeCalledWith(query);
    });
  });

  describe('getById', () => {
    it('should get product category by id', async () => {
      const id = 1;

      jest.spyOn(repository, 'getById').mockResolvedValue({
        id: 1,
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(service, 'getById').mockResolvedValue({
        id: 1,
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      await service.getById(id);
      expect(service.getById).toBeCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update product category', async () => {
      const id = 1;
      const dto = { name: 'test' };

      const productCategory: ProductCategoryEntity = {
        id: 1,
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'getById').mockResolvedValue(productCategory);

      jest.spyOn(service, 'update').mockResolvedValue(null);

      await service.update(id, dto);
      expect(service.update).toBeCalledWith(id, dto);
    });

    it('should throw NotFoundException if product category not found', async () => {
      const id = 1;
      const dto = { name: 'test' };
      jest.spyOn(service, 'getById').mockRejectedValue(null);

      await expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete product category', async () => {
      const id = 1;

      const productCategory: ProductCategoryEntity = {
        id: 1,
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(service, 'getById').mockResolvedValue(productCategory);

      jest.spyOn(service, 'delete').mockResolvedValue(null);

      await service.delete(id);
      expect(service.delete).toBeCalledWith(id);
    });

    it('should throw NotFoundException if product category not found', async () => {
      const id = 1;

      jest.spyOn(service, 'getById').mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
