import multer from "multer";
import express from "express";
import supertest from "supertest";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();

app.post("/upload", upload.single("image"), (req, res) => {
  res.send("Archivo subido correctamente");
});

describe("Multer Middleware Test", () => {
  test("should upload a file successfully", async () => {
    app.post("/upload", upload.single("image"), (req, res) => {
      res.send("Archivo subido correctamente");
    });

    const agent = supertest(app);

    const response = await agent
      .post("/upload")
      .attach("image", `${__dirname}/tmp/image.jpg`)
      .expect(200);

    expect(response.text).toBe("Archivo subido correctamente");
  });
});
