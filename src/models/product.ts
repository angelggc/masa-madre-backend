import { Schema, model } from "mongoose";
import { IProduct } from "../entities/product";

const productSchema = new Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  image: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
});

const Product = model<IProduct>("Product", productSchema);
export default Product;
