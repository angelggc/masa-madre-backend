import { dbConnect, dbDisconnect } from "../config/db";
import Category from "../models/category";

describe("db test", () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    await dbDisconnect();
  });

  test("se conecta", async () => {
    const result = await Category.find();
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toBeInstanceOf(Object);
  });
});
