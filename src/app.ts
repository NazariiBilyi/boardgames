import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import bodyParser from 'body-parser';

import authRouter from './routes/auth';

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGO_URI;

app.use((err, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({
        message
    })
})

app.use('/auth', authRouter)

mongoose.connect(MONGODB_URI).then((db) => {
    app.listen(process.env.PORT || 8080)
}).catch((err) => {
    console.log(err);
})
