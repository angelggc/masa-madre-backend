import { IProduct } from "./product";
import { ProductType } from "./product-type";

export interface ICategory extends Document {
  productType: ProductType;
  description: string;
  products: string[];
}
