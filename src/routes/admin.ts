import express from "express";
import {addNewItem, getItemsByType, uploadImages, deleteItem} from "../controllers/adminController/adminController";
import {isAuthMiddleware} from "../middleware/isAuthMiddleware";
import {isAdminMiddleware} from "../middleware/isAdminMiddleware";

const router = express.Router();

router.use(isAuthMiddleware, isAdminMiddleware);

router.put("/add-new-item", addNewItem);
router.put("/upload-images", uploadImages);
router.get('/get-items/:itemType', getItemsByType)
router.delete('/delete-item/:itemType/:itemId', deleteItem)

export default router;