import { Request, Response } from "express";
import { Product } from "../models/product";
import { IProduct } from "../entities/product";
import path from "path";
import { File, uploadFile } from "../utils/utils-firebase";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, ingredients, description, price } = req.body;

    const file: Express.Multer.File | undefined = req.file;

    if (!file) {
      return res.status(400).json({ message: "Falta archivo de imagen" });
    }

    const fileName = `${
      "Product" + "-" + Date.now() + path.extname(file.originalname)
    }`;

    const urlImage = await uploadFile(file, "products", fileName);

    const newProduct: IProduct = new Product({
      name,
      ingredients,
      description,
      price,
      image: urlImage,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener todos los productos
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener un producto por su ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para actualizar un producto por su ID
export const updateProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para eliminar un producto por su ID
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
