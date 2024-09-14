import { ProductEntityConstraintErrors } from 'src/modules/product/entities';
import { ProductCategoryEntityConstraintErrors } from 'src/modules/product_category/entities';
import { UserEntityConstraintErrors } from 'src/modules/user/entitites';

interface IConstraintErrors {
  [constraintKey: string]: string;
}

export const ConstraintErrors: IConstraintErrors = {
  ...UserEntityConstraintErrors,
  ...ProductCategoryEntityConstraintErrors,
  ...ProductEntityConstraintErrors,
};
