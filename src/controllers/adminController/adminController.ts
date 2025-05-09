import {NextFunction, Request, Response } from "express";
import {ITEM_TYPES} from "./types";
import BoardGame from "../../models/BoardGameSchema";
import {Error} from "mongoose";
import {IError} from "../authController/types";
import ImagesSchema from "../../models/ImagesSchema";

export const addNewItem = async (req: Request, res: Response, next: NextFunction) => {
    const { itemType } = req.body;
    switch (itemType) {
        case ITEM_TYPES.BOARD_GAME:
            try {
                const { item } = req.body
                const createdBoardGame = await BoardGame.create({
                    ...item
                });
                res.status(200).json({
                    message: "New board game added successfully",
                    boardGameId: createdBoardGame._id.toString()
                })
            } catch (error) {
                const err = new Error(error.message) as IError;
                err.statusCode = error.statusCode;
                throw err;
            }
            break;
    }
}

export const uploadImages= async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { files, body: {
            itemId,
        } } = req
        if(Array.isArray(files)) {
            const imagesArray = files.map((file: any) => ({
                data: file.buffer,
                contentType: file.mimetype
            }))
            const newImagesArray = await ImagesSchema.create({
                images: imagesArray,
                itemId
            })
            res.status(200).json({
                message: "Images uploaded successfully",
                imagesId: newImagesArray._id.toString()
            })
        } else {
            const err = new Error('No images provided') as IError;
            err.statusCode = 400;
            throw err;
        }
    } catch (error) {
        const err = new Error(error.message) as IError;
        err.statusCode = error.statusCode;
        throw err;
    }
}