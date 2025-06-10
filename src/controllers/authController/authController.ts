import UserSchema from '../../models/UserSchema/UserSchema';

import express, {NextFunction, Request, Response} from 'express';
import {IError} from "./types";
import {Error } from "mongoose";
import {compareUserPasswordService, createNewUser, createUserPasswordService} from "../../services/authService/authService";
import {sendMail} from "../../services/mailService/mailService";
import {IUser, UserDocument} from "../../models/UserSchema/types";
import {createError, throwNotFound, throwNotMatch, validateInputData} from "../helpers/valodationHelper";

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    validateInputData(req, next)

    const { email, password, firstName, lastName } = req.body;

    let user: IUser
    try {
        const hashPassword = await createUserPasswordService(password, next)

        user = await createNewUser({
            email,
            password: hashPassword,
            role: 0,
            firstName,
            lastName,
        })
    } catch (error) {
        const err = createError(error)
        next(err)
    }

    res.status(201).json({
        message: 'User successfully created',
        userId: user._id
    })
}

export const login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({email: email}) as UserDocument;

    throwNotFound(user, 'User does not exist', next)

    try{
        const match = await compareUserPasswordService(password, user.password, next)
        throwNotMatch(match, next, 'You entered an incorrect password')
        const token = user.generateAccessToken() ;
        res.status(200).json({
            message: 'User successfully logged in',
            token: token
        })
    } catch(error) {
        const err = createError(error);
        next(err)
    }

}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const {email, environmentURL} = req.body;

    const user = await UserSchema.findOne({email}) as UserDocument;

    throwNotFound(user, 'User does not exist', next)

    try {
        const token = user.generateResetPasswordToken();
        const resetURL = `${environmentURL}/reset-password/${token}/${user._id.toString()}`;
        user.resetPasswordToken = token;
        await user.save()

        const text = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${resetURL}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        await sendMail('nazarbiliy@gmail.com', email, 'Reset Password', text);
    } catch (error){
        const err = createError(error.message, error.statusCode);
        next(err);
    }
    res.status(200).json({ message: 'Password reset link sent' });
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const {password, token, userId} = req.body;

    const user = await UserSchema.findOne({_id: userId}) as UserDocument

    throwNotFound(user, 'User does not exist', next)

    throwNotMatch(user.resetPasswordToken !== token, next,'Invalid token')

    try {
        user.password = await createUserPasswordService(password, next)
        user.resetPasswordToken = ''
        await user.save()
    } catch (error){
        const err = createError(error.message, error.statusCode);
        next(err);
    }

    res.status(200).json({ message: 'Password has been changed' });
}


