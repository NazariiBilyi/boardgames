import BoardGame from '../models/BoardGameSchema/BoardGameSchema'
import Images from '../models/ImagesSchema/ImagesSchema'
import {BoardGameDocument} from "../models/BoardGameSchema/types";
import TemporaryTitleImageSchema from "../models/TemporaryTitleImageSchema/TemporaryTitleImageSchema";
import TemporaryImages from "../models/TemporaryImagesSchema/TemporaryImagesSchema";

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

    await Images.insertMany([
        {
            images: [{ data: tempTitleImage.data, contentType: tempTitleImage.contentType }],
            itemId: boarGameId,
        },
        {
            images: tempImages.images,
            itemId: boarGameId,
        }
    ]);

    await Promise.all([
        TemporaryTitleImageSchema.findByIdAndDelete(titleImage),
        TemporaryImages.findOneAndDelete({ _id: images })
    ]);
}

export const deleteBoardGame = async (itemId: string) => {
    await BoardGame.findByIdAndDelete(itemId);
    await Images.findOneAndDelete({ itemId });
};

export const findBoardGameById = async (itemId: string) => {
    return BoardGame.findById(itemId);
}

export const findBoardGames = async () => {
    return await BoardGame.find().lean() as BoardGameDocument[];
}

export const updateBoardGame = async (updateDValues: BoardGameDocument) => {
    return await updateDValues.save()
}