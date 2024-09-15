import { NotFoundException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { CreateOrderItemDto } from "src/modules/order-item/dto";
import { OrderItemEntity } from "src/modules/order-item/entities";
import { IOrderItemRepository, OrderItemRepositoryToken } from "src/modules/order-item/interface";
import { OrderItemService } from "src/modules/order-item/service";

describe('OrderItemService', () => {
  let orderItemService: OrderItemService;
  let orderItemRepository: IOrderItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
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
      ],
    }).compile();

    orderItemService = module.get<OrderItemService>(OrderItemService);
    orderItemRepository = module.get<IOrderItemRepository>(OrderItemRepositoryToken);
  });

  it('should be defined', () => {
    expect(orderItemService).toBeDefined();
  });

  describe('create', () => {
    it('should create order item', async () => {
      const dto: CreateOrderItemDto = {
        orderId: 1,
        productId: 1,
        quantity: 1,
        price: 100,
      };

      const orderItem = {
        id: 1,
        orderId: 1,
        productId: 1,
        price: 100,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as OrderItemEntity;

      jest.spyOn(orderItemRepository, 'create').mockResolvedValue(orderItem);

      expect(await orderItemService.create(dto)).toEqual(orderItem);
    });
  });

  describe('getById', () => {
    it('should return order item by id', async () => {
      const id = 1;

      const orderItem = {
        id: 1,
        orderId: 1,
        productId: 1,
        price: 100,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as OrderItemEntity;

      jest.spyOn(orderItemRepository, 'getById').mockResolvedValue(orderItem);

      expect(await orderItemService.getById(id)).toEqual(orderItem);
    });
  });

  describe('getByOrderId', () => {
    it('should return order items by order id', async () => {
      const orderId = 1;

      const orderItems = [
        {
          id: 1,
          orderId: 1,
          productId: 1,
          price: 100,
          quantity: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ] as OrderItemEntity[];

      jest.spyOn(orderItemRepository, 'getByOrderId').mockResolvedValue(orderItems);

      expect(await orderItemService.getByOrderId(orderId)).toEqual(orderItems);
    });
  });

  describe('update', () => {
    it('should update order item', async () => {
      const id = 1;
      const dto = {
        orderId: 1,
        productId: 1,
        quantity: 1,
        price: 100,
      };

      const orderItem = {
        id: 1,
        orderId: 1,
        productId: 1,
        price: 100,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as OrderItemEntity;

      jest.spyOn(orderItemRepository, 'getById').mockResolvedValue(orderItem);
      jest.spyOn(orderItemRepository, 'update').mockResolvedValue();

      expect(await orderItemService.update(id, dto)).toBeUndefined();
    });

    it('should throw not found exception', async () => {
      const id = 1;
      const dto = {
        orderId: 1,
        productId: 1,
        quantity: 1,
        price: 100,
      };

      jest.spyOn(orderItemRepository, 'getById').mockResolvedValue(null);

      try {
        await orderItemService.update(id, dto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('OrderItem not found');
      }
    });
  });

  describe('delete', () => {
    it('should delete order item', async () => {
      const id = 1;

      const orderItem = {
        id: 1,
        orderId: 1,
        productId: 1,
        price: 100,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as OrderItemEntity;

      jest.spyOn(orderItemRepository, 'getById').mockResolvedValue(orderItem);
      jest.spyOn(orderItemRepository, 'delete').mockResolvedValue();

      expect(await orderItemService.delete(id)).toBeUndefined();
    });

    it('should throw not found exception', async () => {
      const id = 1;

      jest.spyOn(orderItemRepository, 'getById').mockResolvedValue(null);

      try {
        await orderItemService.delete(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('OrderItem not found');
      }
    });
  });
});