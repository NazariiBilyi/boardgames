export interface IError extends Error {
    statusCode: number;
    data: any[]
}

export interface ISignupBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}