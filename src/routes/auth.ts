import express from "express";
import {body} from "express-validator";
import User from '../models/User';
import {signup} from "../controllers/authController";

const router = express.Router();

router.put("/signup", [
    body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .custom(async (value, {req}) => {
            const user = await User.findOne({email: value});
            if (user) {
                return Promise.reject('Email already exists');
            }
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5, max: 255 }),
    body('firstName')
        .trim()
        .not()
        .isEmpty(),
    body('lastName')
        .trim()
        .not()
        .isEmpty()
], signup)

export default router
