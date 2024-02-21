import "dotenv/config";
import request from "supertest";
import Category from "../models/category";
import express from "express";
import cors from "cors";
import categoryRoutes from "../routes/category";
import { Product } from "../models/product";
import { dbConnectTest } from "../config/db";

const PORT = process.env.PORT || 3050;

export const app = express();
app.use(cors());
app.use(express.json());
dbConnectTest();
app.use(categoryRoutes);
export const server = app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});

describe("Test a category", () => {
  beforeEach(async () => {
    await new Product({
      name: "nameTest",
      ingredients: ["ingredients"],
      image: "imagen.jpg",
      description: "descriptionTest",
      price: 99,
    }).save();

    const result = await Product.find();
    const id = result[0]._id.toString();

    await new Category({
      name: "prueba",
      description: "PRUEBA",
      products: [id],
    }).save();
  }, 10000);

  afterEach(async () => {
    await Category.deleteMany({ name: "prueba" });
    await Product.deleteMany({ name: "nameTest" });
    server.close();
  }, 10000);

  test("La ruta funciona", async () => {
    const response = await request(app).get("/categories").send();
    expect(response.status).toBe(200);
  });

  test("recibe datos", async () => {
    const response = await request(app).get("/categories").send();
    expect(response.body).toBeInstanceOf(Array);
  });

  test("recibe una categoría segun el id", async () => {
    const response = await request(app).get("/categories").send();
    const response2 = await request(app)
      .get(`/categories/${response.body[0]._id}`)
      .send();

    expect(response2.body._id).toBe(`${response.body[0]._id}`);
    expect(response2.body.name).toBe("prueba");
    expect(response2.body.description).toBe("PRUEBA");
  });

  test("crea una categoría", async () => {
    const { status } = await request(app)
      .post("/categories")
      .send({ name: "Test", description: "description-test" });
    const response = await request(app).get("/categories").send();

    expect(status).toBe(201);
    expect(response.body.length).toBe(2);
    await Category.deleteMany({ description: "description-test" });
  }, 15000);

  test("edita una categoría", async () => {
    const { body } = await request(app).get("/categories").send();
    const { status } = await request(app)
      .put(`/categories/${body[0]._id}`)
      .send({
        name: "prueba",
        description: "new-description",
        products: [...body[0].products],
      });
    const response = await request(app)
      .get(`/categories/${body[0]._id}`)
      .send();

    expect(status).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(body[0]._id);
    expect(response.body.name).toBe("prueba");
    expect(response.body.description).toBe("new-description");
    expect(response.body.products).toBeInstanceOf(Array);
    expect(response.body.products).toStrictEqual(body[0].products);
  });

  test("elimina una categoría", async () => {
    const { body } = await request(app).get("/categories").send();
    const { status } = await request(app)
      .delete(`/categories/${body[0]._id}`)
      .send();
    const response = await request(app).get("/categories").send();

    expect(status).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});
