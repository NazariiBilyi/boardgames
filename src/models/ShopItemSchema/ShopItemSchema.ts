import mongoose from "mongoose";
import {IShopItem} from "./types";

const Schema = mongoose.Schema;

const ShopItemSchema = new Schema<IShopItem>({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availability: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        ref: 'Images',
        type: [Schema.Types.ObjectId],
    },
    ageRestrictions: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    }
})

export default mongoose.model<IShopItem>('ShopItem', ShopItemSchema);