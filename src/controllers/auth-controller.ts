import { Request, Response } from "express";
import { generateJWT } from "../utils/index";
import { errorResponse } from "../utils/error-response";
import User from "../models/user";
import { compare } from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("Todos los campos son obligatorios");
    }

    if ([name, email, password].includes("")) {
      throw new Error("Todos los campos son requeridos");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new Error("El email ya se encuentra registrado");
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    return res.status(201).json({
      ok: true,
      msg: "Usuario Registrado exitosamente.",
    });
  } catch (error) {
    errorResponse(res, error, "REGISTER");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new Error("Todos los campos son obligatorios");

    let user = await User.findOne({ email });
    if (!user) throw new Error("Credenciales inválidas");

    if (!user) throw new Error("Tu cuenta no ha sido confirmada");

    if (!(await compare(password, user.password)))
      throw new Error("Credenciales inválidas");

    return res.status(200).json({
      ok: true,
      msg: "Usuario Logueado",
      user: {
        nombre: user.name,
        email: user.email,
        token: generateJWT({ id: user._id }),
      },
    });
  } catch (error) {
    errorResponse(res, error, "LOGIN");
  }
};
