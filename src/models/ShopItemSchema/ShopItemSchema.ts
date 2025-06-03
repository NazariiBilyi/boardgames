import mongoose from "mongoose";
import {IShopItem} from "./types";

const Schema = mongoose.Schema;

const ShopItemSchema = new Schema<IShopItem>({
    name: {
        type: String,
        required: true
    },
    titleImage: {
        ref: 'Images',
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
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

ShopItemSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;

        if (ret.__t) {
            ret.type = ret.__t;
            delete ret.__t;
        }

        return ret;
    }
});

export default mongoose.model<IShopItem>('ShopItem', ShopItemSchema);