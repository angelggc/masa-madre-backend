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
  // Busca la categoría correspondiente por el name del producto
  const category = await Category.findOne({ name: doc.name });

  // Si se encuentra la categoría, añade el ID del producto a su array de productos
  if (category) {
    category.products.push(doc._id);
    await category.save(); // Guarda la categoría actualizada en la base de datos
  }
});

const Product = model<IProduct>("Product", productSchema);

export { Product };
