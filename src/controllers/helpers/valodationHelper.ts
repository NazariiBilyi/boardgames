import { NextFunction, Request } from "express";
import {IError} from "../authController/types";
import {ITEM_TYPES} from "../adminController/types";
import {validationResult} from "express-validator";
import {Error} from "mongoose";

export const throwIfMissing = (value: string | number | boolean, message: string, next: NextFunction) => {
    if (value === null || value === undefined || value === "") {
        const err = createError(message, 400);
        return next(err);
    }
};

export const throwNotFound = (
    value: string | number | boolean | object | null | undefined,
    message: string,
    next: NextFunction
) => {
    if (value === null || value === undefined || value === "") {
        const err = createError(message, 404);
        return next(err);
    }
};

export const throwNotMatch = (match: boolean | void, next: NextFunction, message) => {
    if(!match) {
        const error = new Error(message) as IError;
        error.statusCode = 401;
        return next(error);
    }
}

export const validateItemType = (itemType: string, next: NextFunction): number | void => {
    if (!(Number(itemType) in ITEM_TYPES)) {
        const err = createError('Invalid item type', 400)
        return next(err);
    }
    return Number(itemType);
}

export const validateInputData = (req: Request, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed') as IError;
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }
}

export const createError = (message: string, statusCode: number = 400): IError => {
    const err = new Error(message) as IError;
    err.statusCode = statusCode;
    return err;
};