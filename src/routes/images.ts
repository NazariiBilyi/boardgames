import express from "express";
import {getImageById} from "../controllers/ImagesController/ImagesController";

const router = express.Router();

router.get('/img/:collectionId/:imageId', getImageById)

export default router;

