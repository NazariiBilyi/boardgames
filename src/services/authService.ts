import bcrypt from "bcryptjs";
import {IError} from "../controllers/authController/types";
import {NextFunction} from "express";

export const createUserPasswordService = async (password: string, next: NextFunction) => {
   return await bcrypt.hash(password, 12).catch((err: IError) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }) as string;
}

export const compareUserPasswordService = async (password: string, hashedPassword: string, next: NextFunction) => {
    return await bcrypt.compare(password, hashedPassword).catch((err: IError) => {
        next(err)
    })
}