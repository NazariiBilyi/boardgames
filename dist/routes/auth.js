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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.put("/signup", [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
        const user = yield User_1.default.findOne({ email: value });
        if (user) {
            return Promise.reject('Email already exists');
        }
    }))
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .trim()
        .isLength({ min: 5, max: 255 }),
    (0, express_validator_1.body)('firstName')
        .trim()
        .not()
        .isEmpty(),
    (0, express_validator_1.body)('lastName')
        .trim()
        .not()
        .isEmpty()
], authController_1.signup);
exports.default = router;
