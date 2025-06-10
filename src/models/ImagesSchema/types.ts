import {Document, Types} from "mongoose";

export interface IImageData extends Document{
    data: Buffer,
    contentType: string,
    name: string,
    mimetype: string,
    size: number,
    isTitle: boolean,
}

export interface IImages {
    images: IImageData[],
    itemId: Types.ObjectId,
}