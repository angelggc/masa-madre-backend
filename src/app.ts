import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnect from "./config/db";
import categoriesRouter from "./routes/category.routes"; // Importar las rutas de categorías

const PORT = process.env.PORT || 3050;

const app = express();
app.use(cors());
app.use(express.json());
dbConnect();

// Usar las rutas de categorías
app.use(categoriesRouter);

app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});
