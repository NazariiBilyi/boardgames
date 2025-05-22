import {NextFunction, Request, Response} from "express";
import {ITEM_TYPES} from "./types";
import Images from "../../models/ImagesSchema/ImagesSchema";
import {createError, throwIfMissing, validateItemType} from "../helpers/valodationHelper";
import {createBoardGame, deleteBoardGame, findBoardGames} from "../../services/adminservice";

export const addNewItem = async (req: Request, res: Response, next: NextFunction) => {
    const { itemType } = req.body;

    throwIfMissing(itemType, 'Item type is required', next);

    const parsedType = validateItemType(itemType, next);
    if (parsedType === undefined) return;

    switch (itemType) {
        case ITEM_TYPES.BOARD_GAME:
            try {
                const { item } = req.body
                const createdBoardGame = await createBoardGame(item)
                res.status(200).json({
                    message: "New board game added successfully",
                    itemId: createdBoardGame._id.toString()
                })
            } catch (error) {
                throw createError(error.message, error.statusCode);
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
            const newImagesArray = await Images.create({
                images: imagesArray,
                itemId
            })
            res.status(200).json({
                message: "Images uploaded successfully",
                imagesId: newImagesArray._id.toString()
            })
        } else {
            const err = createError('No images provided', 400);
            return next(err);
        }
    } catch (error) {
        const err = createError(error.message, error.statusCode);
        next(err);
    }
}

export const getItemsByType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { itemType } = req.params
    let products = []
    throwIfMissing(itemType, 'Item type is required', next);

    const parsedType = validateItemType(itemType, next);

    if (parsedType === undefined) return;

    try {
        switch (Number(itemType)) {
            case ITEM_TYPES.BOARD_GAME:
                products = await findBoardGames()
                res.status(200).json({
                    boardGames: products,
                    message: 'Successfully fetched board games'
                })
                return;
            default:
                res.status(400).json({
                    message: 'Invalid type'
                })
                return
        }
    } catch (error){
        const err = createError(error.message, error.statusCode);
        next(err);
    }
}

export const deleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { itemId, itemType } = req.params;

    throwIfMissing(itemType, 'Item type is required', next);

    const parsedType = validateItemType(itemType, next);

    if (parsedType === undefined) return;

    try {
        switch (Number(itemType)) {
            case ITEM_TYPES.BOARD_GAME:
               await deleteBoardGame(itemId)
                break;
            default:
                res.status(400).json({ message: 'Invalid type' });
                return;
        }

        res.status(200).json({ message: 'Successfully deleted item' });
    } catch (error) {
        const err = createError(error.message, error.statusCode);
        next(err);
    }
};