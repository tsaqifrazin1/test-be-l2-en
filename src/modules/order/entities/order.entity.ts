import { AbstractEntity } from 'src/common/abstract';
import { OrderStatus } from 'src/common/type';
import { OrderItemEntity } from 'src/modules/order-item/entities';
import { UserEntity } from 'src/modules/user/entitites';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('orders')
export class OrderEntity extends AbstractEntity {
  @Column()
  customerId: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn()
  customer: UserEntity;

  @Column()
  totalPrice: number;

  @Column("enum", { enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  items: OrderItemEntity[];
}