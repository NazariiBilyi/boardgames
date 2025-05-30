import express, {Response, Request, NextFunction} from "express";
import mongoose from "mongoose";
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';

import authRouter from './routes/auth';
import adminRouter from './routes/admin'
import {IError} from "./controllers/authController/types";

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGO_URI;

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({
        message
    })
})

app.use('/auth', authRouter)
app.use('/admin', adminRouter)

mongoose.connect(MONGODB_URI).then((db) => {
    app.listen(process.env.PORT || 8080)
}).catch((err) => {
    console.log(err);
})
