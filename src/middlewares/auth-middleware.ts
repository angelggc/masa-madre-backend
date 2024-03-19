import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";

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
