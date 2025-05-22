import BoardGame from '../models/BoardGameSchema/BoardGameSchema'
import Images from '../models/ImagesSchema/ImagesSchema'
import {BoardGameDocument} from "../models/BoardGameSchema/types";

export const createBoardGame = async (item: any) => {
    return await BoardGame.create({ ...item });
};

export const deleteBoardGame = async (itemId: string) => {
    await BoardGame.findByIdAndDelete(itemId);
    await Images.findOneAndDelete({ itemId });
};

export const findBoardGames = async () => {
    return await BoardGame.find().lean() as BoardGameDocument[];
}