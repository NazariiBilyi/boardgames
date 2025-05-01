export interface IError extends Error {
    statusCode: number;
    data: any[]
}