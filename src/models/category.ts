import { Schema, model } from "mongoose";
import { ICategory } from "../entities/category";

const categorySchema = new Schema({
  productType: { type: String, required: true },
  description: { type: String, required: true },
  products: { type: String, required: true },
});

const Category = model<ICategory>("Category", categorySchema);
export default Category;
