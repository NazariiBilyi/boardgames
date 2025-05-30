import BoardGame from '../models/BoardGameSchema/BoardGameSchema'
import Images from '../models/ImagesSchema/ImagesSchema'
import {BoardGameDocument} from "../models/BoardGameSchema/types";

export const createBoardGame = async (item: any) => {
    return await BoardGame.create({ ...item });
};

export const createTitleImage = async () => {

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