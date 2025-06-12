import {Request, Response, NextFunction} from 'express';
import Images from '../../models/ImagesSchema/ImagesSchema'
import {createError, throwIfMissing, throwNotFound} from "../helpers/valodationHelper";
import {createTempImages, updateImages} from "../../services/imagesService/imagesService";

export const uploadImages= async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { files } = req
        const titleImageIndex = parseInt(req.body.titleImageIndex, 10);
        if(Array.isArray(files)) {

            const newImagesArray = await createTempImages(files, titleImageIndex)

            res.status(200).json({
                message: "Images uploaded successfully",
                imagesId: newImagesArray._id.toString()
            })
        } else {
            const err = createError('No images provided', 400);
            return next(err);
        }
    } catch (error) {
        const err = createError(error.message, error.statusCode);
        next(err);
    }
}

export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
    const { collectionId, imageId } = req.params;

    const imageCollection = await Images.findById(collectionId);
    throwNotFound(imageCollection, 'Images not found', next);

    const image = imageCollection.images.find(img => img._id.toString() === imageId);
    throwNotFound(image, 'Image not found', next);
    res.set('Content-Type', image.contentType);
    res.send(image.data);
}

export const updateImagesById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { files } = req;
        const { collectionId } = req.params
        const imagesForDelete = req.body.imagesForDelete;
        const newTitle = req.body.newTitle
        const normalizedFiles = Array.isArray(files) ? files : [];
        throwIfMissing(collectionId, 'Images not found', next);
        await updateImages(collectionId, normalizedFiles, newTitle, imagesForDelete, next);
        res.status(200).json({
            message: "Images updated successfully"
        })
    } catch (e) {
        const err = createError(e.message, e.statusCode);
        next(err);
    }
}