import {Request} from 'express'

export interface IJWTTokenPayload {
    id: string,
    userRole: number
}

export interface IAuthenticatedRequest extends Request {
    user?: IJWTTokenPayload;
}