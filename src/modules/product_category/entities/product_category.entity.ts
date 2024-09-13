import { AbstractEntity } from 'src/common/abstract';
import { Column, Entity } from 'typeorm';

@Entity('product_categories')
export class ProductCategoryEntity extends AbstractEntity {
  @Column({ unique: true })
  name: string;
}