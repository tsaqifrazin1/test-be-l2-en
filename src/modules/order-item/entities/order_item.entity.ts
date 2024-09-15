import { AbstractEntity } from 'src/common/abstract';
import { OrderEntity } from 'src/modules/order/entities';
import { ProductEntity } from 'src/modules/product/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('order_items')
export class OrderItemEntity extends AbstractEntity {
  @Column()
  productId: number;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems)
  @JoinColumn()
  product: ProductEntity;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  orderId: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn()
  order: OrderEntity;
}