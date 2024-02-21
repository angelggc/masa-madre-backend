import "dotenv/config";
import express from "express";
import cors from "cors";
import { dbConnect } from "./config/db";
import categoryRoutes from "./routes/category";
import productRoutes from "./routes/product";
const PORT = process.env.PORT || 3050;

export const app = express();
app.use(cors());
app.use(express.json());
dbConnect();
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", productRoutes);
app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});
