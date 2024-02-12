import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnect from "./config/db";

const PORT = process.env.PORT || 3050;

const app = express();
app.use(cors());
app.use(express.json());
dbConnect()
app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});
