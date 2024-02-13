import request from "supertest";
import { app } from "../app";

describe("Test a category", () => {
  test("La ruta funciona", async () => {
    const response = await request(app).get("/categories").send();
    expect(response.status).toBe(200);
  });

  test("recive datos", async () => {
    const response = await request(app).get("/categories").send();
    expect(response.body[0]).toBeInstanceOf(Object);
  });
});
