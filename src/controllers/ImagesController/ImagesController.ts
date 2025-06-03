import {Request, Response, NextFunction} from 'express';
import Images from '../../models/ImagesSchema/ImagesSchema'
import { throwNotFound } from "../helpers/valodationHelper";

export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
    const { collectionId, imageId } = req.params;

    const imageCollection = await Images.findById(collectionId);
    throwNotFound(imageCollection, 'Images not found', next);

    const image = imageCollection.images.find(img => img._id.toString() === imageId);
    throwNotFound(image, 'Image not found', next);
    res.set('Content-Type', image.contentType);
    res.send(image.data);
}