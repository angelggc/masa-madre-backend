("dotenv/config");
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { JsonWebTokenError } from "jsonwebtoken";
import { TokenInterface, verifyJWT } from "../utils/jwt";

export const checkLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("Se requiere correo electrónico y contraseña");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Credenciales inválidas");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const authToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (token == null) return res.status(401).json({ message: "No autorizado, hablar con el administrador" });
  const result: any = verifyJWT(token);
  if (result instanceof JsonWebTokenError)
    return res.status(401).json({ message: "No autorizado, hablar con el administrador" });
  const { id }: TokenInterface = result;
  const userFound = await User.findById(id);
  if (!userFound) return res.status(401).json({ message: "No autorizado, hablar con el administrador" });
  next();
};
