import mongoose from "mongoose";
import {ITemporaryImages} from "./types";

const Schema = mongoose.Schema;

const TemporaryImagesSchema = new Schema({
    images: [
        {
            data: Buffer,
            contentType: String
        }
    ],
    uploadedAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60,
    },
})

export default mongoose.model<ITemporaryImages>('TemporaryImages', TemporaryImagesSchema)