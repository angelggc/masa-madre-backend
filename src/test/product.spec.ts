import request from "supertest";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { dbConnectTest } from "../config/db";
import productRoutes from "../routes/product";
import { Product } from "../models/product";
import Category from "../models/category";

const PORT = process.env.PORT || 3050;
export const app = express();
app.use(cors());
app.use(express.json());
dbConnectTest();
app.use(productRoutes);
export const server = app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});

describe("Test a product", () => {
  beforeEach(async () => {
    await new Product({
      name: "nameTest",
      ingredients: ["ingredients"],
      image: "imagen.jpg",
      description: "descriptionTest",
      price: 99,
    }).save();

    await new Product({
      name: "nameTest2",
      ingredients: ["ingredients2"],
      image: "imagen.jpg",
      description: "descriptionTest2",
      price: 99,
    }).save();

    const result = await Product.find();
    const id = result[0]._id.toString();

    await new Category({
      productType: "prueba",
      description: "PRUEBA",
      products: [id],
    }).save();
  }, 10000);

  afterEach(async () => {
    await Product.deleteMany({ name: "nameTest" });
    await Product.deleteMany({ name: "nameTest2" });
    await Product.deleteMany({ name: "nameTest3" });
    server.close();
  }, 10000);

  test("La ruta funciona", async () => {
    const { status } = await request(app).get("/products").send();
    expect(status).toBe(200);
  }, 10000);

  test("recive datos", async () => {
    const response = await request(app).get("/products").send();
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  }, 10000);

  test("recive un producto segun el id", async () => {
    const { body } = await request(app).get("/products").send();
    const response = await request(app).get(`/products/${body[0]._id}`).send();

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(body[0]._id);
    expect(response.body.name.includes("nameTest")).toBe(true);
    expect(response.body.description.includes("descriptionTest")).toBe(true);
  }, 10000);

  test("crea un producto", async () => {
    const result = await Category.find();
    const id = result[0]._id.toString();
    const { status } = await request(app)
      .post(`/${id}/products`)
      .send({
        name: "nameTest3",
        description: "descriptionTest3",
        price: 0,
        image: "imagen.png",
        ingredients: ["ingrediente1", "ingrediente2"],
      });
    const response = await request(app).get("/products").send();
    expect(status).toBe(201);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);

    await Product.deleteMany({ name: "nameTest3" });
  }, 10000);

  test("edita un producto", async () => {
    const { body } = await request(app).get("/products").send();
    const id = body[0]._id;
    const { status } = await request(app)
      .put(`/products/${id}`)
      .send({
        name: "nameTest",
        ingredients: ["new ingredients", "new ingredients2"],
        image: "imagen.jpg",
        description: "new descriptionTest",
        price: 99,
      });
    const response = await request(app).get(`/products/${id}`).send();

    expect(status).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(body[0]._id);
    expect(response.body.description).toBe("new descriptionTest");
    expect(response.body.ingredients).toHaveLength(2);
    expect(response.body.name).toBe("nameTest");
    expect(response.body.image).toBe("imagen.jpg");
    expect(response.body.price).toBe(99);
  }, 10000);

  test("elimina un producto", async () => {
    const { body } = await request(app).get("/products").send();
    const id = body[0]._id;
    const { status } = await request(app).delete(`/products/${id}`).send();
    const response = await request(app).get(`/products/${id}`).send();

    expect(status).toBe(200);
    expect(response.status).toBe(404);
  }, 10000);
});
