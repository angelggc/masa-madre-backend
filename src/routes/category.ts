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
  .get("/", getAllCategories)
  .get("/:id", getCategoryById)
  .post("/", createCategory)
  .put("/:id", updateCategory)
  .delete("/:id", deleteCategory);

export { router };
