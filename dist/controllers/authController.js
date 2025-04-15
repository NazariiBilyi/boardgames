"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        const error = new mongoose_1.Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    const user = yield User_1.default.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
    });
    return res.status(201).json({
        message: 'User successfully created',
        userId: user._id
    });
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const user = yield User_1.default.findOne({ email: email }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
    if (!user) {
        const error = new mongoose_1.Error('User does not exist');
        error.statusCode = 404;
        throw error;
    }
    yield bcryptjs_1.default.compare(user.password, password, (err, isMatch) => {
        if (!isMatch) {
            const error = new mongoose_1.Error('You entered an incorrect password');
            error.statusCode = 401;
            throw error;
        }
    });
    const token = jsonwebtoken_1.default.sign({
        email: user.email,
        id: user._id.toString(),
    }, process.env.SECRET, { expiresIn: '1d' });
    res.status(200).json({
        message: 'User successfully logged in',
        userId: user._id.toString(),
        token: token
    });
});
exports.login = login;
