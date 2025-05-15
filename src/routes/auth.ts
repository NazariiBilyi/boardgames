import express from "express";
import {body} from "express-validator";
import UserSchema from '../models/UserSchema/UserSchema';
import {signup, login, forgotPassword, resetPassword} from "../controllers/authController/authController";

const router = express.Router();

router.put("/signup", [
    body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .custom(async (value, {req}) => {
            const user = await UserSchema.findOne({email: value});
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

router.post("/login", [
    body('email')
        .isEmail()
        .withMessage('Please enter valid email'),
    body('password')
        .trim()
        .isLength({ min: 5, max: 255 }),
], login)

router.post("/forgotPassword", [
    body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .custom(async (value: string, {req}) => {
            const user = await UserSchema.findOne({email: value});
            if (!user) {
                return Promise.reject('Email doesnt exist');
            }
        })
        .normalizeEmail()
], forgotPassword)

router.post("/resetPassword", [
    body('password')
        .trim()
        .isLength({ min: 5, max: 255 }),
], resetPassword)

export default router
