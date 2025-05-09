import express from "express";
import {addNewItem, uploadImages} from "../controllers/adminController/adminController";

const router = express.Router();

router.put("/add-new-item", addNewItem);
router.put("/upload-images", uploadImages);

export default router;