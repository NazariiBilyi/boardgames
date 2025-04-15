"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const MONGODB_URI = process.env.MONGO_URI;
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({
        message
    });
});
app.use('/auth', auth_1.default);
mongoose_1.default.connect(MONGODB_URI).then((db) => {
    app.listen(process.env.PORT || 8080);
}).catch((err) => {
    console.log(err);
});
