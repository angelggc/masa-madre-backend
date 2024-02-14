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
  .put("/:id", updateCategory)
  .delete("/:id", deleteCategory);

export default router;
