import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    orders: {
        type: Schema.Types.ObjectId,
        ref: "Order",
    }
})

export default mongoose.model('User', User);