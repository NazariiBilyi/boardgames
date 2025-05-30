import express from "express";
import {
    addNewItem,
    getItemsByType,
    uploadImages,
    deleteItem,
    editItem, uploadTitleImage
} from "../controllers/adminController/adminController";
import {isAuthMiddleware} from "../middleware/isAuthMiddleware";
import {isAdminMiddleware} from "../middleware/isAdminMiddleware";
import {getItemValidationRules} from "./validators/getItemValidationRules";
import {validate} from "./validators/validator";
import {uploadMultiple, uploadSingle} from "../middleware/uploadMiddleware";

const router = express.Router();

router.use(isAuthMiddleware, isAdminMiddleware);

router.put("/add-new-item/:itemType", validate(getItemValidationRules, false), addNewItem);
router.put('/edit-item/:itemType/:itemId', validate(getItemValidationRules, true), editItem)
router.put('/upload-title-image', uploadSingle, uploadTitleImage)
router.put("/upload-images", uploadMultiple, uploadImages);
router.get('/get-items/:itemType', getItemsByType)
router.delete('/delete-item/:itemType/:itemId', deleteItem)

export default router;