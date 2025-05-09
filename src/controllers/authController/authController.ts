import UserSchema from '../../models/UserSchema';

import express from 'express';
import {validationResult} from 'express-validator';
import {IError} from "./types";
import {Error } from "mongoose";
import {compareUserPasswordService, createUserPasswordService} from "../../services/authService";
import {sendMail} from "../../services/mailService";

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed') as IError;
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const { email, password, firstName, lastName } = req.body;

    const hashPassword = await createUserPasswordService(password, next)

    const user = await UserSchema.create({
        email,
        password: hashPassword,
        role: 0,
        firstName,
        lastName,
    })
    return res.status(201).json({
        message: 'User successfully created',
        userId: user._id
    })
}

export const login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({email: email}).catch((err) => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
    if (!user) {
        const error = new Error('User does not exist') as IError;
        error.statusCode = 404;
        throw error;
    }

    const match = await compareUserPasswordService(password, user.password, next)
    if(!match) {
        const error = new Error('You entered an incorrect password') as IError;
        error.statusCode = 401;
        throw error;
    }
    const token = user.generateAccessToken();
    res.status(200).json({
        message: 'User successfully logged in',
        token: token
    })
}

export const forgotPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {email, environmentURL} = req.body;

    const user = await UserSchema.findOne({email})
    if (!user) {
        const error = new Error('User does not exist') as IError;
        error.statusCode = 404;
        throw error;
    }

    const token = user.generateResetPasswordToken();
    const resetURL = `${environmentURL}/reset-password/${token}/${user._id.toString()}`;
    user.resetPasswordToken = token;
    await user.save()

    const text = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`;
    await sendMail('nazarbiliy@gmail.com', email, 'Reset Password', text);

    res.status(200).json({ message: 'Password reset link sent' });
}

export const resetPassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {password, token, userId} = req.body;

    const user = await UserSchema.findOne({_id: userId})

    if (!user) {
        const error = new Error('User does not exist') as IError;
        error.statusCode = 404;
        throw error;
    }

    if(user.resetPasswordToken !== token) {
        const error = new Error('Invalid token') as IError;
        error.statusCode = 401;
        throw error;
    }

    user.password = await createUserPasswordService(password, next)
    user.resetPasswordToken = ''
    await user.save()
    res.status(200).json({ message: 'Password has been changed' });
}


