import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

const app = express();

app.use(cors());

const MONGODB_URI = process.env.MONGO_URI;

app.use((err, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({
        message
    })
})

mongoose.connect(MONGODB_URI).then((db) => {
    app.listen(8080)
}).catch((err) => {
    console.log(err);
})
