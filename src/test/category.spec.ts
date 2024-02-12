import request from "supertest";
import { app } from "../app";

describe("Test a category", () => {
  test("La ruta funciona", async () => {
    const response = await request(app).get("/").send();

    expect(response.status).toBe(200);
  });
});
