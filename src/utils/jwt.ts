import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";

export interface TokenInterface {
  id: Types.ObjectId;
  iat?: number;
  exp?: number;
}

export const generateJWT = (payload: TokenInterface) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" });

export const verifyJWT = (token: string) => {
  const result = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err, decoded) => {
      if (err) return err;
      return decoded;
    }
  );
  return result;
};
