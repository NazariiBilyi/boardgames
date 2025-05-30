import {Request, Response, NextFunction} from "express";
import { body } from 'express-validator';
import {throwIfMissing, validateItemType} from "../../controllers/helpers/valodationHelper";
import {ITEM_TYPES} from "../../controllers/adminController/types";

const validateIfPresent = (field: string, isEdit: boolean = false) =>
    isEdit
        ? body(field).optional()
        : body(field).notEmpty().withMessage(`${field} is required`);

export const getItemValidationRules = (req: Request, res: Response, next: NextFunction, isEdit: boolean = false) => {
    const { itemType } = req.params;

    throwIfMissing(itemType, 'Item type is required', next);

    const baseRules = [
        validateIfPresent('name', isEdit),
        validateIfPresent('type', isEdit),
        validateIfPresent('price', isEdit),
        validateIfPresent('availability', isEdit),
        validateIfPresent('description', isEdit),
        validateIfPresent('ageRestrictions', isEdit),
        validateIfPresent('vendor', isEdit),
    ];

    const parsedType = validateItemType(itemType, next);
    if (parsedType === undefined) return;

    switch (Number(itemType)) {
        case ITEM_TYPES.BOARD_GAME:
            return [
                ...baseRules,
                validateIfPresent('gameTime', isEdit),
                validateIfPresent('numberOfPlayers', isEdit),
                validateIfPresent('language', isEdit),
            ];

        default:
            return baseRules;
    }
};