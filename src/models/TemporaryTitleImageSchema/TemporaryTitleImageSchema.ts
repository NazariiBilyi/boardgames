import mongoose from "mongoose";
import {ITemporaryTitleImage} from "./types";

const Schema = mongoose.Schema;

const TemporaryTitleImageSchema = new Schema({
    data: Buffer,
    contentType: String,
    uploadedAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60,
    },
});

export default mongoose.model<ITemporaryTitleImage>('TemporaryTitleImage', TemporaryTitleImageSchema);