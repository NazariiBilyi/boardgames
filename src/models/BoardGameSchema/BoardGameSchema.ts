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


ShopItemSchema.discriminator('BoardGame', BoardGameSchema)

export default mongoose.model<BoardGameDocument>('BoardGame')