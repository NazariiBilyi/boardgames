import express from "express";
import {
    addNewItem,
    getItemsByType,
    deleteItem, getItemByTypeAndId, updateItem
} from "../controllers/adminController/adminController";
import {isAuthMiddleware} from "../middleware/isAuthMiddleware";
import {isAdminMiddleware} from "../middleware/isAdminMiddleware";
import {getItemValidationRules} from "./validators/getItemValidationRules";
import {validate} from "./validators/validator";
import {uploadMultiple, uploadSingle} from "../middleware/uploadMiddleware";
import {uploadImages} from "../controllers/ImagesController/ImagesController";

const router = express.Router();

router.use(isAuthMiddleware, isAdminMiddleware);

router.put('/item/images', uploadMultiple, uploadImages);

router.put("/item/:itemId/:itemType", validate(getItemValidationRules, true), updateItem);
router.put("/item/:itemType", validate(getItemValidationRules, false), addNewItem);

router.get('/item/:id/:type', getItemByTypeAndId);
router.get('/items/:itemType', getItemsByType);
router.delete('/item/:itemType/:itemId', deleteItem);

export default router;