import mongoose from "mongoose";

const Schema = mongoose.Schema

const ImagesSchema = new Schema({
    images: [
        {
            data: Buffer,
            contentType: String
        }
    ],
    itemId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ShopItem'
    }
})

export default mongoose.model('Images', ImagesSchema);