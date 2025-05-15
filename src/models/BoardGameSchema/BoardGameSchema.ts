import mongoose from "mongoose";
import ShopItemSchema from "../ShopItemSchema/ShopItemSchema";
import {IBoardGame} from "./types";

const Schema = mongoose.Schema;

const BoardGameSchema = new Schema<IBoardGame>({
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

export default mongoose.model<IBoardGame>('BoardGame')