import express from "express";
import {getImageById, updateImagesById} from "../controllers/ImagesController/ImagesController";
import {uploadMultiple} from "../middleware/uploadMiddleware";
import {isAuthMiddleware} from "../middleware/isAuthMiddleware";
import {isAdminMiddleware} from "../middleware/isAdminMiddleware";

const router = express.Router();

router.get('/img/:collectionId/:imageId', getImageById)
router.put('/img/:collectionId', uploadMultiple, isAuthMiddleware, isAdminMiddleware, updateImagesById)

export default router;

