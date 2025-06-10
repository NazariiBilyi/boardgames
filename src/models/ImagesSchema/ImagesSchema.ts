import mongoose from "mongoose";
import {IImages} from "./types";

const Schema = mongoose.Schema

const ImagesSchema = new Schema<IImages>({
    images: [
        {
            data: Buffer,
            contentType: String,
            name: String,
            mimetype: String,
            size: Number,
            isTitle: Boolean
        }
    ],
    itemId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ShopItem'
    }
})

export default mongoose.model<IImages>('Images', ImagesSchema);