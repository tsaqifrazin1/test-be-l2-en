import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus, RoleType } from 'src/common/type';
import { OrderItemEntity } from 'src/modules/order-item/entities';
import {
  IOrderItemRepository,
  OrderItemRepositoryToken,
} from 'src/modules/order-item/interface';
import { CheckoutDto } from 'src/modules/order/dto';
import { OrderEntity } from 'src/modules/order/entities';
import {
  IOrderRepository,
  IOrderService,
  OrderRepositoryToken,
} from 'src/modules/order/interface';
import { OrderService } from 'src/modules/order/service';
import { ProductEntity } from 'src/modules/product/entities';
import {
  IProductService,
  ProductServiceToken,
} from 'src/modules/product/interface';
import { UserEntity } from 'src/modules/user/entitites';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => jest.fn(),
}));
describe('OrderService', () => {
  let orderService: IOrderService;
  let orderRepository: IOrderRepository;
  let orderItemRepository: IOrderItemRepository;
  let productService: IProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepositoryToken,
          useValue: {
            create: jest.fn(),
            get: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: OrderItemRepositoryToken,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            getByOrderId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: ProductServiceToken,
          useValue: {
            getById: jest.fn(),
            addStock: jest.fn(),
            reduceStock: jest.fn(),
          },
        },
      ],
    }).compile();

    orderService = module.get<IOrderService>(OrderService);
    orderRepository = module.get<IOrderRepository>(OrderRepositoryToken);
    orderItemRepository = module.get<IOrderItemRepository>(
      OrderItemRepositoryToken,
    );
    productService = module.get<IProductService>(ProductServiceToken);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
    expect(orderRepository).toBeDefined();
    expect(orderItemRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('checkout', () => {
    it('should create order', async () => {
      const dto: CheckoutDto = {
        customerId: 1,
        customer: {
          username: 'Test',
          email: 'test@email.com',
          id: 1,
          role: RoleType.USER,
        } as UserEntity,
        products: [
          {
            productId: 1,
            quantity: 2,
          },
        ],
        totalPrice: 0,
        status: OrderStatus.PENDING,
      };

      const order = {
        id: 1,
        customerId: dto.customerId,
        customer: dto.customer,
        status: OrderStatus.PENDING,
        totalPrice: 0,
      } as OrderEntity;

      const product = new ProductEntity();
      product.id = 1;
      product.price = 100;

      const orderItem = new OrderItemEntity();
      orderItem.id = 1;
      orderItem.orderId = order.id;
      orderItem.productId = product.id;
      orderItem.price = product.price;
      orderItem.quantity = 2;

      jest.spyOn(orderRepository, 'create').mockResolvedValue(order);
      jest.spyOn(productService, 'getById').mockResolvedValue(product);
      jest.spyOn(orderItemRepository, 'create').mockResolvedValue(orderItem);
      jest.spyOn(productService, 'reduceStock').mockResolvedValue(null);
      jest.spyOn(orderRepository, 'update').mockResolvedValue(undefined);

      const result = await orderService.checkout(dto);

      expect(result).toEqual(order);
      expect(result.totalPrice).toEqual(200);
    });

    it('should throw error if product not found', async () => {
      const dto: CheckoutDto = {
        customerId: 1,
        customer: {
          username: 'Test',
          email: 'tes@email.com',
          id: 1,
          role: RoleType.USER,
        } as UserEntity,
        products: [
          {
            productId: 1,
            quantity: 2,
          },
        ],
        totalPrice: 0,
        status: OrderStatus.PENDING,
      };

      jest.spyOn(productService, 'getById').mockResolvedValue(undefined);

      try {
        await orderService.checkout(dto);
      } catch (error) {
        expect(error.message).toEqual('Product not found');
      }
    });
  });

  describe('get', () => {
    it('should return list of orders', async () => {
      const query = {
        page: 1,
        limit: 10,
      };

      jest.spyOn(orderRepository, 'get').mockResolvedValue({
        entities: [
          {
            id: 1,
            customerId: 1,
            status: OrderStatus.PENDING,
            totalPrice: 0,
            customer: {
              username: 'Test',
              email: 'test@email.com',
              id: 1,
              role: RoleType.USER,
            } as UserEntity,
            items: [
              {
                id: 1,
                orderId: 1,
                productId: 1,
                price: 100,
                quantity: 2,
              } as OrderItemEntity,
            ],
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

      const result = await orderService.get(query);
      expect(result).toEqual({
        entities: [
          {
            id: 1,
            customerId: 1,
            status: OrderStatus.PENDING,
            totalPrice: 0,
            customer: {
              username: 'Test',
              email: 'test@email.com',
              id: 1,
              role: RoleType.USER,
            } as UserEntity,
            items: [
              {
                id: 1,
                orderId: 1,
                productId: 1,
                price: 100,
                quantity: 2,
              } as OrderItemEntity,
            ],
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
    });
  });

  describe('getById', () => {
    it('should return order by id', async () => {
      const id = 1;

      jest.spyOn(orderRepository, 'getById').mockResolvedValue({
        id: 1,
        customerId: 1,
        status: OrderStatus.PENDING,
        totalPrice: 0,
        customer: {
          username: 'Test',
          email: 'test@email.com',
          id: 1,
          role: RoleType.USER,
        } as UserEntity,
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            price: 100,
            quantity: 2,
          } as OrderItemEntity,
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await orderService.getById(id);
      expect(result).toEqual({
        id: 1,
        customerId: 1,
        status: OrderStatus.PENDING,
        totalPrice: 0,
        customer: {
          username: 'Test',
          email: 'test@email.com',
          id: 1,
          role: RoleType.USER,
        } as UserEntity,
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            price: 100,
            quantity: 2,
          } as OrderItemEntity,
        ],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      });
    });
  });

  describe('update', () => {
    it('should update order', async () => {
      const id = 1;
      const dto = {
        status: OrderStatus.DELIVERED,
      };

      jest.spyOn(orderRepository, 'getById').mockResolvedValue({
        id: 1,
        customerId: 1,
        status: OrderStatus.PENDING,
        totalPrice: 0,
        customer: {
          username: 'Test',
          email: 'test@email.com',
          id: 1,
          role: RoleType.USER,
        } as UserEntity,
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            price: 100,
            quantity: 2,
          } as OrderItemEntity,
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(orderRepository, 'update').mockResolvedValue(null);

      const result = await orderService.update(id, dto);
      expect(result).toBeNull();
    });

    it('should throw error if order not found', async () => {
      const id = 1;
      const dto = {
        status: OrderStatus.DELIVERED,
      };

      jest.spyOn(orderRepository, 'getById').mockResolvedValue(undefined);

      try {
        await orderService.update(id, dto);
      } catch (error) {
        expect(error.message).toEqual('Order not found');
      }
    });
  });

  describe('updateStatus', () => {
    it('should update status', async () => {
      const id = 1;
      const status = OrderStatus.DELIVERED;

      jest.spyOn(orderRepository, 'getById').mockResolvedValue({
        id: 1,
        customerId: 1,
        status: OrderStatus.PENDING,
        totalPrice: 0,
        customer: {
          username: 'Test',
          email: 'test@email.com',
          id: 1,
          role: RoleType.USER,
        } as UserEntity,
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            price: 100,
            quantity: 2,
          } as OrderItemEntity,
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(orderRepository, 'update').mockResolvedValue(null);

      const result = await orderService.updateStatus(id, status);

      expect(result).toBeNull();
      expect(orderRepository.update).toBeCalledWith(id, { status }, undefined);
    });

    it('should update status to canceled', async () => {
      const id = 1;

      jest.spyOn(orderRepository, 'getById').mockResolvedValue({
        id: 1,
        customerId: 1,
        status: OrderStatus.PENDING,
        totalPrice: 0,
        customer: {
          username: 'Test',
          email: 'test@email.com',
          id: 1,
          role: RoleType.USER,
        } as UserEntity,
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            price: 100,
            quantity: 2,
          } as OrderItemEntity,
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      jest.spyOn(orderItemRepository, 'getByOrderId').mockResolvedValue([
        {
          id: 1,
          orderId: 1,
          productId: 1,
          price: 100,
          quantity: 2,
        } as OrderItemEntity,
      ]);

      jest.spyOn(productService, 'getById').mockResolvedValue({
        id: 1,
        price: 100,
        stock: 10,
      } as ProductEntity);

      jest.spyOn(productService, 'addStock').mockResolvedValue(null);

      jest.spyOn(orderRepository, 'update').mockResolvedValue(null);

      const result = await orderService.updateStatus(id, OrderStatus.CANCELED);

      expect(result).toBeNull();

      expect(productService.addStock).toBeCalledWith(1, 2, undefined);
    });
  });
});
