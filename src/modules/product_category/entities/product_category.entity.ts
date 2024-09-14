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

export const ProductCategoryEntityConstraintErrors = {
  'UQ_a75bfadcd8291a0538ab7abfdcf': "Name already exists",
  'PK_7069dac60d88408eca56fdc9e0c': "ID already exists",
}