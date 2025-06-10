import {Response, NextFunction} from 'express';
import {IAuthenticatedRequest} from "./types";
import {createError} from "../controllers/helpers/valodationHelper";
import {getUser} from "../services/authService/authService";

export const isAdminMiddleware = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    const reqUser = req.user;
    if(!reqUser) {
        const err = createError('User not provided', 400);
        next(err)
    }

    const user = await getUser(reqUser.id);
    if(!user) {
        const err = createError('User not found', 404);
        next(err)
    }

    if(user.role !== 1) {
        const err = createError('You are not authorized to perform this action', 403);
        next(err)
    }

    next()
}