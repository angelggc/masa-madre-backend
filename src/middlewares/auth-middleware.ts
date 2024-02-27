import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import createHttpError from "http-errors";



export const checkLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            throw createHttpError(400, "Se requiere correo electrónico y contraseña");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw createHttpError(401, "Credenciales inválidas");
        }


        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw createHttpError(401, "Credenciales inválidas");
        }

        next();
    } catch (error) {
        // Manejar errores
        next(error);
    }
};
