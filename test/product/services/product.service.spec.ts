import { TestingModule, Test } from '@nestjs/testing';
import { CreateProductDto, UpdateProductDto } from 'src/modules/product/dto';
import {
  IProductService,
  IProductRepository,
  ProductRepositoryToken,
  ProductServiceToken,
} from 'src/modules/product/interface';
import { ProductService } from 'src/modules/product/service';
import { ProductCategoryEntity } from 'src/modules/product_category/entities';
import {
  IProductCategoryRepository,
  ProductCategoryRepositoryToken,
} from 'src/modules/product_category/interface';
import { ProductCategoryRepository } from 'src/modules/product_category/repository';

describe('Product Service', () => {
  let service: ProductService;
  let repository: IProductRepository;
  let productCategoryRepository: IProductCategoryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepositoryToken,
          useValue: {
            create: jest.fn(),
            get: jest.fn(),
            getById: jest.fn(),
            getByName: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: ProductCategoryRepositoryToken,
          useValue: {
            create: jest.fn(),
            get: jest.fn(),
            getById: jest.fn(),
            getByName: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<IProductRepository>(ProductRepositoryToken);
    productCategoryRepository = module.get<IProductCategoryRepository>(
      ProductCategoryRepositoryToken,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(productCategoryRepository).toBeDefined();
  });

  describe('Generate SKU', () => {
    it('should generate SKU', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(0);
      const sku = await service['_generateSku']();
      expect(sku).toBeDefined();
      expect(sku).toEqual('AAAAAA');

      jest.spyOn(repository, 'count').mockResolvedValue(1);
      const sku2 = await service['_generateSku']();
      expect(sku).not.toEqual(sku2);
      expect(sku2).toEqual('AAAAAB');
    });
  });

  describe('Create Product', () => {
    it('should create product', async () => {
      const dto: CreateProductDto = {
        name: 'test',
        price: 1000,
        stock: 10,
        categoryName: 'test category',
        description: 'test',
        height: 10,
        width: 10,
        weight: 10,
        length: 10,
        sku: 'AAAAAA',
        image: 'test',
      };

      jest.spyOn(repository, 'getByName').mockResolvedValue(null);
      jest.spyOn(productCategoryRepository, 'getByName').mockResolvedValue({
        id: 1,
        name: 'test category',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(repository, 'create').mockResolvedValue({
        id: 1,
        ...dto,
        categoryId: 1,
        category: { id: 1, name: 'test category' } as ProductCategoryEntity,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        image: 'test',
      });
      jest.spyOn(repository, 'count').mockResolvedValue(0);

      const result = await service.create(dto);
      const { categoryName, ...productDto } = dto;
      expect(repository.create).toBeCalledWith({
        ...productDto,
        categoryId: 1,
      });

      expect(result).toEqual({
        id: 1,
        ...dto,
        categoryId: 1,
        category: { id: 1, name: 'test category' } as ProductCategoryEntity,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
        image: 'test',
      });
      expect(repository.getByName).toBeCalledTimes(1);
      expect(productCategoryRepository.getByName).toBeCalledTimes(1);
      expect(productCategoryRepository.create).toBeCalledTimes(0);
      expect(repository.create).toBeCalledTimes(1);
    });

    it('should throw error when product name already exists', async () => {
      const dto: CreateProductDto = {
        name: 'test',
        price: 1000,
        stock: 10,
        categoryName: 'test category',
        description: 'test',
        height: 10,
        width: 10,
        weight: 10,
        length: 10,
        sku: 'test',
        image: 'test',
      };

      jest.spyOn(repository, 'count').mockResolvedValue(0);
      jest.spyOn(repository, 'getByName').mockResolvedValue({
        id: 1,
        sku: 'test',
        name: 'test',
        description: 'test',
        weight: 10,
        width: 10,
        length: 10,
        height: 10,
        price: 1000,
        stock: 10,
        categoryId: 1,
        category: { id: 1, name: 'test category' } as ProductCategoryEntity,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        image: 'test',
      });

      await expect(service.create(dto)).rejects.toThrowError(
        'Product already exists',
      );
    });

    it('should create product and product category when category name not found', async () => {
      const dto: CreateProductDto = {
        name: 'test',
        price: 1000,
        stock: 10,
        categoryName: 'test category',
        description: 'test',
        height: 10,
        width: 10,
        weight: 10,
        length: 10,
        sku: 'test',
        image: 'test',
      };

      jest.spyOn(repository, 'count').mockResolvedValue(0);
      jest.spyOn(repository, 'getByName').mockResolvedValue(null);
      jest
        .spyOn(productCategoryRepository, 'getByName')
        .mockResolvedValue(null);

      jest.spyOn(productCategoryRepository, 'create').mockResolvedValue({
        id: 1,
        name: 'test category',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      await service.create(dto);

      expect(productCategoryRepository.create).toBeCalledWith({
        name: 'test category',
      });
      expect(productCategoryRepository.create).toBeCalledTimes(1);
    });
  });

  describe('Get Product', () => {
    it('should get product', async () => {
      const query = { page: 1, limit: 10 };

      jest.spyOn(repository, 'get').mockResolvedValue({
        entities: [
          {
            id: 1,
            name: 'test',
            price: 1000,
            stock: 10,
            description: 'test',
            height: 10,
            width: 10,
            weight: 10,
            length: 10,
            sku: 'test',
            image: 'test',
            categoryId: 1,
            category: { id: 1, name: 'test category' } as ProductCategoryEntity,
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

      const result = await service.get(query);
      expect(result).toEqual({
        entities: [
          {
            id: 1,
            name: 'test',
            price: 1000,
            stock: 10,
            description: 'test',
            height: 10,
            width: 10,
            weight: 10,
            length: 10,
            sku: 'test',
            image: 'test',
            categoryId: 1,
            category: { id: 1, name: 'test category' } as ProductCategoryEntity,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
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

      expect(repository.get).toBeCalledWith(query);
    });
  });

  describe('Get Product By Id', () => {
    it('should get product by id', async () => {
      const id = 1;

      jest.spyOn(repository, 'getById').mockResolvedValue({
        id: 1,
        name: 'test',
        price: 1000,
        stock: 10,
        description: 'test',
        height: 10,
        width: 10,
        weight: 10,
        length: 10,
        sku: 'test',
        image: 'test',
        categoryId: 1,
        category: { id: 1, name: 'test category' } as ProductCategoryEntity,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await service.getById(id);
      expect(result).toEqual({
        id: 1,
        name: 'test',
        price: 1000,
        stock: 10,
        description: 'test',
        height: 10,
        width: 10,
        weight: 10,
        length: 10,
        sku: 'test',
        image: 'test',
        categoryId: 1,
        category: { id: 1, name: 'test category' } as ProductCategoryEntity,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      });

      expect(repository.getById).toBeCalledWith(id);
    });
  });

  describe('Update Product', () => {
    it('should update product', async () => {
      const id = 1;
      const dto: UpdateProductDto = {
        name: 'test',
        categoryName: 'test category',
      };

      jest.spyOn(repository, 'getById').mockResolvedValue({
        id: 1,
        name: 'test',
        price: 1000,
        stock: 10,
        description: 'test',
        height: 10,
        width: 10,
        weight: 10,
        length: 10,
        sku: 'test',
        image: 'test',
        categoryId: 1,
        category: { id: 1, name: 'test category' } as ProductCategoryEntity,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(repository, 'getByName').mockResolvedValue(null);

      jest.spyOn(productCategoryRepository, 'getByName').mockResolvedValue({
        id: 1,
        name: 'test category',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(repository, 'update').mockResolvedValue(null);

      const result = await service.update(id, dto);
      expect(result).toBeNull();
      expect(repository.getById).toBeCalledWith(id);
      expect(repository.getByName).toBeCalledWith('test');
      expect(productCategoryRepository.getByName).toBeCalledWith(
        'test category',
      );
      expect(repository.update).toBeCalledWith(id, dto);
    });

    it('should throw error when product not found', async () => {
      const id = 1;
      const dto: UpdateProductDto = {
        name: 'test',
        categoryName: 'test category',
      };

      jest.spyOn(repository, 'getById').mockResolvedValue(null);

      await expect(service.update(id, dto)).rejects.toThrowError(
        'Product not found',
      );
    });
  });

  describe('Delete Product', () => {
    it('should delete product', async () => {
      const id = 1;

      jest.spyOn(repository, 'getById').mockResolvedValue({
        id: 1,
        name: 'test',
        price: 1000,
        stock: 10,
        description: 'test',
        height: 10,
        width: 10,
        weight: 10,
        length: 10,
        sku: 'test',
        image: 'test',
        categoryId: 1,
        category: { id: 1, name: 'test category' } as ProductCategoryEntity,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(repository, 'delete').mockResolvedValue(null);

      const result = await service.delete(id);
      expect(result).toBeNull();
      expect(repository.getById).toBeCalledWith(id);
      expect(repository.delete).toBeCalledWith(id);
    });

    it('should throw error when product not found', async () => {
      const id = 1;

      jest.spyOn(repository, 'getById').mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrowError('Product not found');
    });
  });

  describe('Add Stock', () => {
    it('should add stock', async () => {
      const id = 1;
      const stock = 10;

      jest.spyOn(repository, 'getById').mockResolvedValue({
        id: 1,
        name: 'test',
        price: 1000,
        stock: 10,
        description: 'test',
        height: 10,
        width: 10,
        weight: 10,
        length: 10,
        sku: 'test',
        image: 'test',
        categoryId: 1,
        category: { id: 1, name: 'test category' } as ProductCategoryEntity,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(repository, 'update').mockResolvedValue(null);

      const result = await service.addStock(id, stock);
      expect(result).toBeNull();
      expect(repository.getById).toBeCalledWith(id);
      expect(repository.update).toBeCalledWith(id, { stock: 20 });
    });

    it('should throw error when product not found', async () => {
      const id = 1;
      const stock = 10;

      jest.spyOn(repository, 'getById').mockResolvedValue(null);

      await expect(service.addStock(id, stock)).rejects.toThrowError(
        'Product not found',
      );
    });
  });

  describe('Reduce Stock', () => {
    it('should reduce stock', async () => {
      const id = 1;
      const stock = 5;

      jest.spyOn(repository, 'getById').mockResolvedValue({
        id: 1,
        name: 'test',
        price: 1000,
        stock: 10,
        description: 'test',
        height: 10,
        width: 10,
        weight: 10,
        length: 10,
        sku: 'test',
        image: 'test',
        categoryId: 1,
        category: { id: 1, name: 'test category' } as ProductCategoryEntity,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(repository, 'update').mockResolvedValue(null);

      const result = await service.reduceStock(id, stock);
      expect(result).toBeNull();
      expect(repository.getById).toBeCalledWith(id);
      expect(repository.update).toBeCalledWith(id, { stock: 5 });
    });

    it('should throw error when product not found', async () => {
      const id = 1;
      const stock = 10;

      jest.spyOn(repository, 'getById').mockResolvedValue(null);

      await expect(service.reduceStock(id, stock)).rejects.toThrowError(
        'Product not found',
      );
    });

    it('should throw error when stock not enough', async () => {
      const id = 1;
      const stock = 15;

      jest.spyOn(repository, 'getById').mockResolvedValue({
        id: 1,
        name: 'test',
        price: 1000,
        stock: 10,
        description: 'test',
        height: 10,
        width: 10,
        weight: 10,
        length: 10,
        sku: 'test',
        image: 'test',
        categoryId: 1,
        category: { id: 1, name: 'test category' } as ProductCategoryEntity,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      await expect(service.reduceStock(id, stock)).rejects.toThrowError(
        'Stock not enough',
      );
    });
  });
});
