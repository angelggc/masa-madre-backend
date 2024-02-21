import "dotenv/config";
import express from "express";
import cors from "cors";
import { dbConnect } from "./config/db";
import categoryRoutes from "./routes/category";
import productRoutes from "./routes/product";
import userRoutes from "./routes/user"
const PORT = process.env.PORT || 3050;

export const app = express();
app.use(cors());
app.use(express.json());
dbConnect();
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});
