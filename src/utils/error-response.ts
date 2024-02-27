import { Response } from "express";

export const errorResponse = (res: Response, error: any, origin : string) => {

    return res.status(error.status || 500).json({ 
        ok : false, 
        msg : error instanceof Error ? error.message : `Upss, hubo un error en ${origin}`
    }) 
}