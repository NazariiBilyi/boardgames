import express, {Response, Request, NextFunction} from "express";
import mongoose from "mongoose";
import cors from 'cors';

import authRouter from './routes/auth';
import adminRouter from './routes/admin';
import imagesRouter from './routes/images';
import {IError} from "./controllers/authController/types";

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());

const MONGODB_URI = process.env.MONGO_URI;

app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/images', imagesRouter)

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({
        message,
    })
})

mongoose.connect(MONGODB_URI).then((db) => {
    app.listen(process.env.PORT || 8080)
}).catch((err) => {
    console.log(err);
})
