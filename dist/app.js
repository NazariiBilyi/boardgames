"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
mongoose_1.default.connect('mongodb+srv://nazar_bilyi:Tobius198815@cluster0.bynzuof.mongodb.net/').then((db) => {
    app.listen(8080);
}).catch((err) => {
    console.log(err);
});
