import { TestingModule, Test } from '@nestjs/testing';
import { OrderStatus, RoleType } from 'src/common/type';
import { PaginationData } from 'src/interceptors';
import { OrderItemEntity } from 'src/modules/order-item/entities';
import { OrderItemSerialization } from 'src/modules/order-item/serialization/order-item.serialization';
import { OrderController } from 'src/modules/order/controller';
import { CheckoutDto, FilterOrderDto } from 'src/modules/order/dto';
import { OrderEntity } from 'src/modules/order/entities';
import { IOrderService, OrderServiceToken } from 'src/modules/order/interface';
import { OrderSerialization } from 'src/modules/order/serialization/order.serialization';
import { UserEntity } from 'src/modules/user/entitites';
import { UserGetSerialization } from 'src/modules/user/serializations/user.serialization';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: IOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderServiceToken,
          useValue: {
            checkout: jest.fn(),
            get: jest.fn(),
            getById: jest.fn(),
            updateStatus: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<IOrderService>(OrderServiceToken);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });

  describe('checkoutOrder', () => {
    it('should return order id', async () => {
      const user = {
        username: 'test',
        email: 'test@email.com',
        id: 1,
        role: RoleType.USER,
      } as UserEntity;

      const dto: CheckoutDto = {
        customerId: 1,
        products: [
          {
            productId: 1,
            quantity: 1,
          },
        ],
        customer: user,
        totalPrice: 0,
        status: OrderStatus.PENDING,
      };

      const order: OrderEntity = {
        id: 1,
        customerId: 1,
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            price: 100,
            quantity: 1,
          } as OrderItemEntity,
        ],
        totalPrice: 100,
        status: OrderStatus.PENDING,
        customer: user,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(orderService, 'checkout').mockResolvedValue(order);

      const result = await orderController.checkoutOrder(dto, user);

      expect(result).toEqual({
        message: 'success create order',
        data: {
          id: order.id,
        },
      });
    });
  });

  describe('getOrders', () => {
    it('should return orders', async () => {
      const query: FilterOrderDto = {
        page: 1,
        take: 10,
      };

      const orders: PaginationData<OrderEntity> = {
        entities: [
          {
            id: 1,
            customerId: 1,
            items: [
              {
                id: 1,
                orderId: 1,
                productId: 1,
                price: 100,
                quantity: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              } as OrderItemEntity,
            ],
            totalPrice: 100,
            status: OrderStatus.PENDING,
            customer: {
              username: 'test',
              email: 'test@email.com',
              id: 1,
              role: RoleType.USER,
            } as UserEntity,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          } as OrderEntity,
        ],
        meta: {
          page: 1,
          offset: 10,
          itemCount: 1,
          pageCount: 1,
        },
      };

      jest.spyOn(orderService, 'get').mockResolvedValue(orders);

      const result = await orderController.getOrders(query);

      expect(result).toEqual({
        message: 'success',
        data: {
          entities: [
            {
              id: 1,
              customerId: 1,
              items: [
                {
                  id: 1,
                  orderId: 1,
                  productId: 1,
                  price: 100,
                  quantity: 1,
                  createdAt: expect.any(Date),
                  updatedAt: expect.any(Date),
                } as OrderItemSerialization,
              ],
              totalPrice: 100,
              status: OrderStatus.PENDING,
              customer: {
                username: 'test',
                email: 'test@email.com',
                id: 1,
                role: RoleType.USER,
              } as UserGetSerialization,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            } as OrderSerialization,
          ] as OrderSerialization[],
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

  describe('getOrderById', () => {
    it('should return order by id', async () => {
      const id = 1;

      const order: OrderEntity = {
        id: 1,
        customerId: 1,
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            price: 100,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as OrderItemEntity,
        ],
        totalPrice: 100,
        status: OrderStatus.PENDING,
        customer: {
          username: 'test',
          email: 'test@email.com',
          id: 1,
          role: RoleType.USER,
        } as UserEntity,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(orderService, 'getById').mockResolvedValue(order);

      const result = await orderController.getOrderById(id, order.customer);

      expect(result).toEqual({
        message: 'success',
        data: {
          id: 1,
          customerId: 1,
          items: [
            {
              id: 1,
              orderId: 1,
              productId: 1,
              price: 100,
              quantity: 1,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            } as OrderItemSerialization,
          ],
          totalPrice: 100,
          status: OrderStatus.PENDING,
          customer: {
            username: 'test',
            email: 'test@email.com',
            id: 1,
            role: RoleType.USER,
          } as UserGetSerialization,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });

      expect(orderService.getById).toBeCalledWith(id);
    });

    it('should throw not found exception', async () => {
      const id = 1;

      jest.spyOn(orderService, 'getById').mockResolvedValue(null);

      try {
        await orderController.getOrderById(id, null);
      } catch (error) {
        expect(error.message).toEqual('Order not found');
      }
    });

    it('should throw not found exception if accessed by other customer', async () => {
      const id = 1;

      const order: OrderEntity = {
        id: 1,
        customerId: 2,
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            price: 100,
            quantity: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as OrderItemEntity,
        ],
        totalPrice: 100,
        status: OrderStatus.PENDING,
        customer: {
          username: 'test',
          email: 'test@email.com',
          id: 1,
          role: RoleType.USER,
        } as UserEntity,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(orderService, 'getById').mockResolvedValue(order);

      try {
        await orderController.getOrderById(id, order.customer);
      } catch (error) {
        expect(error.message).toEqual('Order not found');
      }
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const id = 1;
      const status = OrderStatus.DELIVERED;

      jest.spyOn(orderService, 'updateStatus').mockResolvedValue(null);

      const result = await orderController.updateOrderStatusById(id, status);
      
      expect(result).toEqual({
        message: 'success update order status',
      });
    });
  });

  describe('updateOrder', () => {
    it('should update order', async () => {
      const id = 1;
      const dto = {
        status: OrderStatus.DELIVERED,
      };

      jest.spyOn(orderService, 'update').mockResolvedValue(null);

      const result = await orderController.updateOrderById(id, dto);

      expect(result).toEqual({
        message: 'success update order',
      });
    });
  });
});
