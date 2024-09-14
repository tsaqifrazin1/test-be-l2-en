import { AbstractEntity } from 'src/common/abstract';
import { ProductEntity } from 'src/modules/product/entities';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('product_categories')
export class ProductCategoryEntity extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products?: ProductEntity[];
}