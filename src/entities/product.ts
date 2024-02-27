import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  ingredients: string[];
  image: string;
  description?: string;
  price: number;
}
