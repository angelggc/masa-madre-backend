import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category-controller";

const router = Router();
router
  .get("/categories", getAllCategories)
  .get("/categories/:id", getCategoryById)
  .post("/categories", createCategory)
  .put("/categories/:id", updateCategory)
  .delete("/categories/:id", deleteCategory);

export default router;
