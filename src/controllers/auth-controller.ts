import { Request, Response } from "express";
import createError from "http-errors";
import { errorResponse, generateJWT, generateTokenRandom } from "../utils/index";
import User from "../models/user";
import { compare } from "bcryptjs"

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw createError(400, "Todos los campos son obligatorios");
        }

        if ([name, email, password].includes("")) {
            throw createError(400, "Todos los campos son requeridos");
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            throw createError(400, "El email ya se encuentra registrado");
        }

        const newUser = new User({
            name,
            email,
            password,
            token: generateTokenRandom()
        });

        await newUser.save();

        return res.status(201).json({
            ok: true,
            msg: "Usuario Registrado exitosamente."
        });
    } catch (error) {
        errorResponse(res, error, 'REGISTER');
    }
};
    
export const login = async (req : Request,res : Response) => { 
        try { 
            const {email,password} = req.body;

            if(!email || !password) throw createError(400,"Todos los campos son obligatorios");
            
                let user = await User.findOne({email });
                if(!user) throw createError(403,"Credenciales inválidas | EMAIL");
                
                if(!user) throw createError(403,"Tu cuenta no ha sido confirmada");
    
                if (!(await compare(password, user.password))) throw createError(403,"Credenciales inválidas | PASSWORD"); 
                        

            return res.status(200).json({ 
                ok : true, 
                msg :'Usuario Logueado',
                user : {
                    nombre : user.name,
                    email : user.email,
                    token : generateJWT({ id: user._id })
                    }
                   
            }) 
        } catch (error) { 
            errorResponse(res,error, 'LOGIN')

        } 
    }
   