import { Document } from "mongoose";

export interface Image {
  fileName: string;
  url: string;
}

export interface IProduct extends Document {
  name: string;
  ingredients: string[];
  image: Image;
  description?: string;
  price: number;
}
