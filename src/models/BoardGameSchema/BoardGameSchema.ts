import mongoose from "mongoose";
import ShopItemSchema from "../ShopItemSchema/ShopItemSchema";
import {BoardGameDocument, IBoardGame} from "./types";

const Schema = mongoose.Schema;

const BoardGameSchema = new Schema<BoardGameDocument>({
    gameTime: {
        type: String,
        required: true
    },
    numberOfPlayers: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    }
})

BoardGameSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});

ShopItemSchema.discriminator('BoardGame', BoardGameSchema)

export default mongoose.model<BoardGameDocument>('BoardGame')