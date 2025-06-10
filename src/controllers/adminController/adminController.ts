import {NextFunction, Request, Response} from "express";
import {ITEM_TYPES} from "./types";
import {createError, throwIfMissing, validateItemType} from "../helpers/valodationHelper";
import {
    createBoardGame,
    deleteBoardGame,
    findBoardGameById,
    findBoardGames,
    updateBoardGame,
} from "../../services/adminService/adminService";
import BoardGame from '../../models/BoardGameSchema/BoardGameSchema'
import {addImagesToBoardGame} from "../../services/imagesService/imagesService";

export const addNewItem = async (req: Request, res: Response, next: NextFunction) => {
    const { itemType } = req.params;

    throwIfMissing(itemType, 'Item type is required', next);

    const parsedType = validateItemType(itemType, next);
    if (parsedType === undefined) return;

    switch (parsedType) {
        case ITEM_TYPES.BOARD_GAME:
            try {

                const boardGameForCreation = req.body;

                const createdBoardGame = await createBoardGame(boardGameForCreation)

                const imagesId = await addImagesToBoardGame(req.body.images, createdBoardGame._id.toString())

                await BoardGame.findByIdAndUpdate(createdBoardGame._id, {
                    images: imagesId,
                });

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

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
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
                products = await findBoardGames({}, {
                    images: 0,
                    numberOfPlayers: 0,
                    titleImage: 0,
                    language: 0,
                    ageRestrictions: 0,
                    description: 0,
                    gameTime: 0
                })
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

export const getItemByTypeAndId = async (req: Request, res: Response, next: NextFunction) => {
    const {id, type} = req.params;

    throwIfMissing(type, 'Item type is required', next);
    throwIfMissing(id, 'Item id is required', next);

    const parsedType = validateItemType(type, next);

    switch (parsedType) {
        case ITEM_TYPES.BOARD_GAME:
            try {
                const boardGame = await findBoardGameById(id)

                res.status(200).json({
                    boardGame,
                    message: 'Successfully fetched board game'
                })
            } catch (e) {
                const err = createError(e.message, e.statusCode);
                next(err);
            }
            break
        default:
            const err = createError('Invalid type', 400);
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