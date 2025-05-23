import bcrypt from "bcryptjs";
import {IError} from "../controllers/authController/types";
import {NextFunction} from "express";
import {IUser} from "../models/UserSchema/types";
import UserSchema from "../models/UserSchema/UserSchema";

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

export const createNewUser = async (user: IUser) => {
    return await UserSchema.create(user)
}

export const getUser = async (userId: string):Promise<IUser | null> => {
    return UserSchema.findById(userId);
}