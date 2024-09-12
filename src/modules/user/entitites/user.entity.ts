import { Exclude } from 'class-transformer';
import { RoleType } from '../../../common/type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from 'src/common/abstract';

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
}
