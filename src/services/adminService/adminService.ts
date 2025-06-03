import BoardGame from '../../models/BoardGameSchema/BoardGameSchema'
import Images from '../../models/ImagesSchema/ImagesSchema'
import {BoardGameDocument} from "../../models/BoardGameSchema/types";
import TemporaryTitleImageSchema from "../../models/TemporaryTitleImageSchema/TemporaryTitleImageSchema";
import TemporaryImages from "../../models/TemporaryImagesSchema/TemporaryImagesSchema";
import mongoose, {FilterQuery, ProjectionType} from "mongoose";
import {IFindOptions} from "./types";

export const createBoardGame = async (item: any) => {
    return await BoardGame.create({ ...item });
};

export const createTempTitleImage = async (file) => {
    return await TemporaryTitleImageSchema.create({
        data: file.buffer,
        contentType: file.mimetype
    });
}

export const createTempImages = async (files) => {
    const imagesArray = files.map((file: any) => ({
        data: file.buffer,
        contentType: file.mimetype
    }))

    return await TemporaryImages.create({
        images: imagesArray
    })
}

export const constAddImagesToBoardGame = async (titleImage: string, images: string, boarGameId: string) => {
    const tempTitleImage = await TemporaryTitleImageSchema.findById(titleImage);
    const tempImages = await TemporaryImages.findById(images);

    const insertedImages = await Images.insertMany([
        {
            images: [{ data: tempTitleImage.data, contentType: tempTitleImage.contentType }],
            itemId: new mongoose.Types.ObjectId(boarGameId),
        },
        {
            images: tempImages.images,
            itemId: new mongoose.Types.ObjectId(boarGameId),
        }
    ]);

    await Promise.all([
        TemporaryTitleImageSchema.findByIdAndDelete(titleImage),
        TemporaryImages.findOneAndDelete({ _id: images })
    ]);

    return {
        titleImageId: insertedImages[0]._id,
        imagesId: insertedImages[1]._id
    }
}

export const deleteBoardGame = async (itemId: string) => {
    await BoardGame.findByIdAndDelete(itemId);
    await Images.findOneAndDelete({ itemId });
};

export const findBoardGameById = async (itemId: string) => {
    return BoardGame.findById(itemId).populate('titleImage')
        .populate('images');;
}

export const findBoardGames = async (
    filter: FilterQuery<BoardGameDocument> = {},
    projection: ProjectionType<BoardGameDocument> = {},
    options: IFindOptions = {}
) => {
    return await BoardGame.find(filter, projection)
        .sort(options.sort || {})
        .limit(options.limit || 0)
        .skip(options.skip || 0) as BoardGameDocument[];
}

export const updateBoardGame = async (updateDValues: BoardGameDocument) => {
    return await updateDValues.save()
}