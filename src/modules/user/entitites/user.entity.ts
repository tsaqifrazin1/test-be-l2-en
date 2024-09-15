import { Exclude } from 'class-transformer';
import { RoleType } from '../../../common/type';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from 'src/common/abstract';
import { OrderEntity } from 'src/modules/order/entities';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  /**
   * @description Username of the user [unique, not null]
   */
  @Column({
    unique: true,
  })
  username: string;

  /**
   * @description Password of the user [not null]
   */
  @Exclude()
  @Column()
  password: string;

  /**
   * @description Email of the user [unique, not null]
   */
  @Column({
    unique: true,
  })
  email: string;

  /**
   * @description Role of the user [not null]
   */
  @Column({
    type: 'enum',
    enum: RoleType,
  })
  role: RoleType;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders: OrderEntity[];
}

export const UserEntityConstraintErrors = {
  'PK_a3ffb1c0c8416b9fc6f907b7433': 'ID already exists',
  'UQ_97672ac88f789774dd47f7c8be3': 'Email already exists',
  'UQ_fe0bb3f6520ee0469504521e710': 'Username already exists',
};

