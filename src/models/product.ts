import { Schema, model } from "mongoose";
import Category from "./category";
import { IProduct } from "../entities/product";

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  image: { fileName: { type: String }, url: { type: String } },
  description: { type: String },
  price: { type: Number, required: true },
});

productSchema.post<IProduct>("save", async function (doc) {
  
  const category = await Category.findOne({ name: doc.name });

  
  if (category) {
    category.products.push(doc._id);
    await category.save();
  }
});

const Product = model<IProduct>("Product", productSchema);

export { Product };
