import {Model, Types, Document} from "mongoose";

export interface IUser {
    _id?: Types.ObjectId;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: number;
    orders?: Types.ObjectId; // Since it's optional and a reference
    resetPasswordToken?: string;
}

export interface IUserMethods {
    generateAccessToken(): string;
    generateResetPasswordToken(): string;
}

export type UserDocument = Document<unknown, {}, IUser> & IUser & IUserMethods;

// Optional: You can also define the model type explicitly if needed
export type UserModel = Model<IUser, {}, IUserMethods>;