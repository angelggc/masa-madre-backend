import { ProductType } from "./product-type";

export interface ICategory extends Document {
  productType: ProductType;
  description: string;
  products: string[];
}
