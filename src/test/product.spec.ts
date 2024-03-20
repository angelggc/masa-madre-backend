import request from "supertest";
import express from "express";
import cors from "cors";
import { dbConnectTest } from "../config/db";
import productRoutes from "../routes/product";
import { Product } from "../models/product";
import Category from "../models/category";
import { deleteFile } from "../utils/utils-firebase";
import User from "../models/user";
import { generateJWT } from "../utils/jwt";

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
  let token: string;
  beforeAll(async () => {
    await new User({
      name: "userAdmin",
      email: "user@admin.com",
      password: "adminPassword",
      token: "token",
    }).save();
    const users = await User.find();
    token = generateJWT({ id: users[0].id });
  });

  afterAll(async () => {
    await User.deleteMany({ name: "userAdmin" });
  });

  beforeEach(async () => {
    await new Product({
      name: "nameTest",
      ingredients: ["ingredients"],
      image: {
        fileName: "filename.jpg",
        url: "img.com",
      },
      description: "descriptionTest",
      price: 99,
    }).save();

    await new Product({
      name: "nameTest2",
      ingredients: ["ingredients2"],
      image: {
        fileName: "filename.jpg",
        url: "img.com",
      },
      description: "descriptionTest2",
      price: 99,
    }).save();

    const result = await Product.find();
    const id = result[0].id.toString();

    await new Category({
      name: "prueba",
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
    const { status } = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(status).toBe(200);
  }, 10000);

  test("recibe datos", async () => {
    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
  }, 10000);

  test("recive un producto segun el id", async () => {
    const { body } = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`)
      .send();
    const response = await request(app)
      .get(`/products/${body[0]._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(body[0]._id);
    expect(response.body.name.includes("nameTest")).toBe(true);
    expect(response.body.description.includes("descriptionTest")).toBe(true);
    expect(response.body.image instanceof Object).toBe(true);
  }, 10000);

  test("crea un producto", async () => {
    const result = await Category.find();
    const id = result[0].id.toString();

    const result2 = await request(app)
      .post(`/${id}/products`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", `${__dirname}/tmp/image.jpg`)
      .field("name", "nameTest3")
      .field("description", "descriptionTest3")
      .field("price", 0)
      .field("ingredients", ["ingrediente1", "ingrediente2"]);

    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(result2.status).toBe(201);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);

    await deleteFile("products", result2.body.image.fileName);
    await Product.deleteMany({ name: "nameTest3" });
  }, 10000);

  test("edita un producto con imagen", async () => {
    const { body } = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`)
      .send();
    const id = body[0]._id;
    const editResponse = await request(app)
      .put(`/products/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", `${__dirname}/tmp/image.jpg`)
      .field("name", "nameTest")
      .field("description", "new descriptionTest")
      .field("price", 50)
      .field("ingredients", ["new ingredients", "new ingredients2"]);

    const response = await request(app).get(`/products/${id}`).send();

    expect(editResponse.status).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(body[0]._id);
    expect(response.body.description).toBe("new descriptionTest");
    expect(response.body.ingredients).toHaveLength(2);
    expect(response.body.name).toBe("nameTest");
    expect(response.body.image instanceof Object).toBe(true);
    expect(response.body.price).toBe(50);

    console.log(response.body.image.fileName);
    await deleteFile("products", response.body.image.fileName);
  }, 10000);

  test("edita un producto sin imagen y conserva la anterior", async () => {
    const { body } = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`)
      .send();
    const id = body[0]._id;
    const holdProduct = await request(app)
      .get(`/products/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();
    const editResponse = await request(app)
      .put(`/products/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "nameTest")
      .field("description", "new descriptionTest")
      .field("price", 50)
      .field("ingredients", ["new ingredients", "new ingredients2"]);

    const response = await request(app).get(`/products/${id}`).send();

    expect(editResponse.status).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(body[0]._id);
    expect(response.body.description).toBe("new descriptionTest");
    expect(response.body.ingredients).toHaveLength(2);
    expect(response.body.name).toBe("nameTest");
    expect(response.body.image instanceof Object).toBe(true);
    expect(response.body.image.fileName).toBe(holdProduct.body.image.fileName);
    expect(response.body.price).toBe(50);
  }, 10000);

  test("elimina un producto", async () => {
    const { body } = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${token}`)
      .send();
    const id = body[0]._id;
    const { status } = await request(app)
      .delete(`/products/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();
    const response = await request(app)
      .get(`/products/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(status).toBe(200);
    expect(response.status).toBe(404);
  }, 10000);
});
