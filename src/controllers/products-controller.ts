import { Request, Response } from "express";
import { Product, IProduct } from "../models/product";
import Category from "../models/category";
// Controlador para crear un nuevo producto
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Crear el nuevo producto
    const newProduct: IProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    // Obtener el ID de la categoría desde la solicitud (por ejemplo, req.body.categoryId)
    const categoryId = req.params.categoryId;

    // Verificar si se proporcionó un ID de categoría
    if (!categoryId) {
      return res.status(400).json({ message: "CategoryId is required" });
    }

    // Buscar la categoría por su ID
    const category = await Category.findById(categoryId);

    // Verificar si la categoría existe
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Verificar si la propiedad products es un array
    if (!Array.isArray(category.products)) {
      category.products = []; // Inicializar la propiedad products si no es un array
    }

    // Agregar el ID del nuevo producto al array de productos de la categoría
    category.products.push(savedProduct._id);

    // Guardar la categoría actualizada en la base de datos
    await category.save();

    // Enviar la respuesta
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
