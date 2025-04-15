import User from '../models/User';

import express from 'express';
import {validationResult} from 'express-validator';
import bcrypt from 'bcryptjs';
import jwttoken from 'jsonwebtoken';
import {IError} from "./types";
import {Error} from "mongoose";

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed') as IError;
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const hashedPassword = await bcrypt.hash(password, 12).catch((err: IError) => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
    const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
    })
    return res.status(201).json({
        message: 'User successfully created',
        userId: user._id
    })
}

export const login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email: email}).catch((err) => {
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
    await bcrypt.compare(user.password, password, (err, isMatch) => {
        if(!isMatch) {
            const error = new Error('You entered an incorrect password') as IError;
            error.statusCode = 401;
            throw error;
        }
    });
    const token = jwttoken.sign({
        email: user.email,
        id: user._id.toString(),
    }, process.env.SECRET, {expiresIn: '1d'});
    res.status(200).json({
        message: 'User successfully logged in',
        userId: user._id.toString(),
        token: token
    })
}


