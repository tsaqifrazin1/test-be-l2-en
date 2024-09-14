import { AbstractEntity } from 'src/common/abstract';
import { ProductCategoryEntity } from 'src/modules/product_category/entities';
import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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
  @Check(`"harga" > 0`)
  price: number;

  @Column()
  @Check(`"stock" >= 0`)
  stock: number;
  
  @Column()
  categoryId?: number;

  @ManyToOne(() => ProductCategoryEntity, (category) => category.products)
  @JoinColumn()
  category?: ProductCategoryEntity;
}
