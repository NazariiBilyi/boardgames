import {Types, Document} from "mongoose";

export interface ITemporaryImageData extends Document{
    data: Buffer;
    contentType: string;
    name: string;
    mimetype: string;
    size: number;
    isTitle: boolean;
}

export interface ITemporaryImages extends Document {
    images: ITemporaryImageData[],
    uploadedAt: {
        type: Date,
        default: Date,
        expires: number,
    },
}