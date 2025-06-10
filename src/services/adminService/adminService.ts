import BoardGame from '../../models/BoardGameSchema/BoardGameSchema'
import Images from '../../models/ImagesSchema/ImagesSchema'
import {BoardGameDocument} from "../../models/BoardGameSchema/types";
import {FilterQuery, ProjectionType} from "mongoose";
import {IFindOptions} from "./types";

export const createBoardGame = async (item: any) => {
    return await BoardGame.create({ ...item });
};


export const deleteBoardGame = async (itemId: string) => {
    await BoardGame.findByIdAndDelete(itemId);
    await Images.findOneAndDelete({ itemId });
};

export const findBoardGameById = async (itemId: string) => {
    return BoardGame.findById(itemId)
        .populate('images');
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