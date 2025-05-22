import express from "express";
import {addNewItem, getItemsByType, uploadImages, deleteItem} from "../controllers/adminController/adminController";

const router = express.Router();

router.put("/add-new-item", addNewItem);
router.put("/upload-images", uploadImages);
router.get('/get-items/:itemType', getItemsByType)
router.delete('/delete-item/:itemType/:itemId', deleteItem)

export default router;