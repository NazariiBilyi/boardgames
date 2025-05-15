import {Types} from "mongoose";

export interface IImage {
    data: Buffer,
    contentType: string
}

export interface IImages {
    images: IImage[],
    itemId: Types.ObjectId
}