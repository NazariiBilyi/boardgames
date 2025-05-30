import express from "express";
import {
    addNewItem,
    getItemsByType,
    uploadImages,
    deleteItem,
    editItem, uploadTitleImage, getItemByTypeAndId
} from "../controllers/adminController/adminController";
import {isAuthMiddleware} from "../middleware/isAuthMiddleware";
import {isAdminMiddleware} from "../middleware/isAdminMiddleware";
import {getItemValidationRules} from "./validators/getItemValidationRules";
import {validate} from "./validators/validator";
import {uploadMultiple, uploadSingle} from "../middleware/uploadMiddleware";

const router = express.Router();

router.use(isAuthMiddleware, isAdminMiddleware);

router.put('/item/image', uploadSingle, uploadTitleImage);
router.put('/item/images', uploadMultiple, uploadImages);

router.put("/item/:itemType/:itemId", validate(getItemValidationRules, true), editItem);
router.put("/item/:itemType", validate(getItemValidationRules, false), addNewItem);

router.get('/item/:id/:itemType', getItemByTypeAndId);
router.get('/items/:itemType', getItemsByType);
router.delete('/item/:itemType/:itemId', deleteItem);

export default router;