import { Response } from "express";
import { Types } from "mongoose";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'

export interface TokenInterface {
    id : Types.ObjectId
}


export const generateJWT = (payload : TokenInterface) => jwt.sign(payload, process.env.JWT_SECRET as string,{
    expiresIn : '1h'
   })






