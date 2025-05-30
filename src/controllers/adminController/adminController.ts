import {NextFunction, Request, Response} from "express";
import {ITEM_TYPES} from "./types";
import Images from '../../models/ImagesSchema/ImagesSchema'
import TemporaryImages from "../../models/TemporaryImagesSchema/TemporaryImagesSchema";
import TemporaryTitleImageSchema from "../../models/TemporaryTitleImageSchema/TemporaryTitleImageSchema";
import {createError, throwIfMissing, validateItemType} from "../helpers/valodationHelper";
import {
    createBoardGame,
    deleteBoardGame,
    findBoardGameById,
    findBoardGames,
    updateBoardGame
} from "../../services/adminservice";

export const addNewItem = async (req: Request, res: Response, next: NextFunction) => {
    const { itemType } = req.params;

    throwIfMissing(itemType, 'Item type is required', next);

    const parsedType = validateItemType(itemType, next);
    if (parsedType === undefined) return;

    switch (parsedType) {
        case ITEM_TYPES.BOARD_GAME:
            try {
                const createdBoardGame = await createBoardGame(req.body)


                const tempTitleImage = await TemporaryTitleImageSchema.findById(req.body.titleImage);
                const tempImages = await TemporaryImages.findById(req.body.images);

                await Images.insertMany([
                    {
                        images: [{ data: tempTitleImage.data, contentType: tempTitleImage.contentType }],
                        itemId: createdBoardGame._id.toString(),
                     },
                    {
                        images: tempImages.images,
                        itemId: createdBoardGame._id.toString(),
                    }
                ]);

                await Promise.all([
                    TemporaryTitleImageSchema.findByIdAndDelete(req.body.titleImage),
                    TemporaryImages.findOneAndDelete({ _id: req.body.images })
                ]);

                res.status(200).json({
                    message: "New board game added successfully",
                    itemId: createdBoardGame._id.toString()
                })
            } catch (error) {
                const err = createError(error.message, error.statusCode);
                next(err);
            }
            break;
    }
}

export const uploadTitleImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            const err = createError('No image provided', 400);
            next(err)
        }

        const newImage = await TemporaryTitleImageSchema.create({
            data: req.file.buffer,
            contentType: req.file.mimetype
        });

        res.status(200).json({
            message: 'Image uploaded successfully',
            imageId: newImage._id.toString(),
        });
    } catch (error) {
        const err = createError(error.message, error.statusCode);
        next(err);
    }
}

export const uploadImages= async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { files } = req
        if(Array.isArray(files)) {
            const imagesArray = files.map((file: any) => ({
                data: file.buffer,
                contentType: file.mimetype
            }))

            const newImagesArray = await TemporaryImages.create({
                images: imagesArray
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

export const editItem = async (req: Request, res: Response, next: NextFunction) => {
    const { itemType, itemId } = req.params

    throwIfMissing(itemType, 'Item type is required', next);
    throwIfMissing(itemId, 'Item id is required', next);

    const parsedType = validateItemType(itemType, next);
    if (parsedType === undefined) return;

    try {
        switch (parsedType) {
            case ITEM_TYPES.BOARD_GAME:
                const boardGameForEdit = await findBoardGameById(itemId)
                if(!boardGameForEdit) {
                    const err = createError('Board game not found', 404)
                    next(err)
                }

                Object.assign(boardGameForEdit, req.body);

                await updateBoardGame(boardGameForEdit)

                res.status(200).json({
                    message: 'Board game successfully updated',
                })
                break;
            default:
                res.status(400).json({
                    message: 'Invalid type'
                })
                break;
        }
    } catch (error){
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
        switch (parsedType) {
            case ITEM_TYPES.BOARD_GAME:
                products = await findBoardGames()
                res.status(200).json({
                    boardGames: products,
                    message: 'Successfully fetched board games'
                })
                break;
            default:
                res.status(400).json({
                    message: 'Invalid type'
                })
                break;
        }
    } catch (error){
        const err = createError(error.message, error.statusCode);
        next(err);
    }
}

export const getItemByTypeAndId = async (request: Request, response: Response, next: NextFunction) => {

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
        switch (parsedType) {
            case ITEM_TYPES.BOARD_GAME:
               await deleteBoardGame(itemId)
                break;
            default:
                res.status(400).json({ message: 'Invalid type' });
                break;
        }

        res.status(200).json({ message: 'Successfully deleted item' });
    } catch (error) {
        const err = createError(error.message, error.statusCode);
        next(err);
    }
};