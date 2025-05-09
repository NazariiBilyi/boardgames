import mongoose from "mongoose";
import jwttoken from "jsonwebtoken";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true,
    },
    orders: {
        type: Schema.Types.ObjectId,
        ref: "Order",
    },
    resetPasswordToken: String,
}, {
    methods: {
        generateAccessToken: function () {
            return jwttoken.sign({
                id: this._id.toString(),
                userRole: this.role || 0,
            }, process.env.SECRET, {expiresIn: '1d'})
        },
        generateResetPasswordToken: function () {
            const secret = process.env.SECRET + this.password;
            return jwttoken.sign({id: this._id.toString(), email: this.email}, secret, {expiresIn: '1d'});
        },
    },
})

export default mongoose.model('User', UserSchema);