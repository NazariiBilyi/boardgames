import {NextFunction, Request, Response} from "express";
import {createError} from "../controllers/helpers/valodationHelper";
import jwttoken from "jsonwebtoken";
import {IAuthenticatedRequest, IJWTTokenPayload} from "./types";

export const isAuthMiddleware = (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        const err = createError('Token not found', 401)
        next(err)
    }

    jwttoken.verify(token, process.env.SECRET, (err, user) => {
        if(err){
            const err = createError('Token invalid or expired', 403)
            next(err)
        }

        req.user = user as IJWTTokenPayload;
        next();
    })
}