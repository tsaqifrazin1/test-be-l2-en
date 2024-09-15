import { AbstractEntity } from 'src/common/abstract';
import { OrderItemEntity } from 'src/modules/order-item/entities';
import { ProductCategoryEntity } from 'src/modules/product_category/entities';
import { Check, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('products')
export class ProductEntity extends AbstractEntity {
  @Column({ unique: true })
  sku: string

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  weight: number;

  @Column()
  width: number;

  @Column()
  length: number;

  @Column()
  height: number

  @Column({ nullable: true })
  image: string;

  @Column()
  @Check(`"price" > 0`)
  price: number;

  @Column()
  @Check(`"stock" >= 0`)
  stock: number;
  
  @Column()
  categoryId?: number;

  @ManyToOne(() => ProductCategoryEntity, (category) => category.products)
  @JoinColumn()
  category?: ProductCategoryEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  orderItems?: OrderItemEntity[];
}

export const ProductEntityConstraintErrors = {
  'FK_9a5f6868c96e0069e699f33e124': "Category not found",
  'UQ_c44ac33a05b144dd0d9ddcf9327': "SKU already exists",
  'UQ_4c9fb58de893725258746385e16': "Name already exists",
  'CHK_d064358889508d02cc4c7acdce': "Price must be greater than 0",
  'CHK_aea3ee263e1d44e36e5f5b5783': "Stock must be greater than or equal to 0",
  'PK_0806c755e0aca124e67c0cf6d7d': "ID already exists",
}
