import { Schema, model, Document } from "mongoose";
import Category from "./category";

export interface IProduct extends Document {
  name: string;
  ingredients: string[];
  image: string;
  description?: string;
  price: number;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  image: { type: String, required: true },
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
