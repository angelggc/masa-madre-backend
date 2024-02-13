import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category-controller";

const router = Router();

// Ruta para crear una nueva categoría
router.post("/categories", createCategory);

// Ruta para obtener todas las categorías
router.get("/categories", getAllCategories);

// Ruta para obtener una categoría por su ID
router.get("/categories/:id", getCategoryById);

// Ruta para actualizar una categoría
router.put("/categories/:id", updateCategory);

// Ruta para eliminar una categoría
router.delete("/categories/:id", deleteCategory);

export default router;
