import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../controllers/products-controller";
import { upload } from "../middlewares/upload-middleware";

const router = express.Router();

// Rutas para CRUD de productos
router.post("/:categoryId/products", upload.single("image"), createProduct); // Crear un nuevo producto
router.get("/products", getAllProducts); // Obtener todos los productos
router.get("/products/:productId", getProductById); // Obtener un producto por su ID
router.put("/products/:productId", upload.single("image"), updateProductById); // Actualizar un producto por su ID
router.delete("/products/:productId", deleteProductById); // Eliminar un producto por su ID

export default router;
