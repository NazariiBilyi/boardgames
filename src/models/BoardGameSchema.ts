import mongoose from "mongoose";
import ShopItemSchema from "./ShopItemSchema";

const Schema = mongoose.Schema;

const BoardGameSchema = new Schema({
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

export default mongoose.model('BoardGame')