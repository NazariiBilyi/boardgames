import TemporaryImages from "../../models/TemporaryImagesSchema/TemporaryImagesSchema";
import Images from "../../models/ImagesSchema/ImagesSchema";
import mongoose from "mongoose";
import {IImageData} from "./types";
import {throwNotFound} from "../../controllers/helpers/valodationHelper";
import {NextFunction} from "express";


export const createTempImages = async (files: IImageData[], titleImagIndex: number) => {
    const imagesArray = files.map((file: any, index) => ({
        data: file.buffer,
        contentType: file.mimetype,
        name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        isTitle: titleImagIndex === index
    }))

    return await TemporaryImages.create({
        images: imagesArray
    })
}

export const addImagesToBoardGame = async (images: string, boarGameId: string) => {
    const tempImages = await TemporaryImages.findById(images);

    const insertedImages = await Images.create({
        images: tempImages.images,
        itemId: new mongoose.Types.ObjectId(boarGameId),
    });

    await TemporaryImages.findOneAndDelete({ _id: images })

    return insertedImages._id;
}

export const updateImages = async (collectionId: string, files: IImageData[], imagesForDelete: string[], next: NextFunction) => {
    const images = await Images.findById(collectionId);
    throwNotFound(images, 'Images not found', next)

    const newImagesArray = files.map((file: any) => ({
        data: file.buffer,
        contentType: file.mimetype,
        name: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    }))

    const operations: Promise<any>[] = [];

    if (imagesForDelete?.length > 0) {
        operations.push(
            Images.updateOne(
                { _id: collectionId },
                { $pull: { images: { _id: { $in: imagesForDelete } } } }
            )
        );
    }

    if (newImagesArray?.length > 0) {
        operations.push(
            Images.findByIdAndUpdate(
                collectionId,
                { $push: { images: { $each: newImagesArray } } }
            )
        );
    }

    await Promise.all(operations);
}