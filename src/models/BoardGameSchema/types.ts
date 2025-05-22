import {IShopItem} from "../ShopItemSchema/types";
import { Document } from 'mongoose';

export interface IBoardGame extends IShopItem {
    gameTime: string,
    numberOfPlayers: string,
    language: string
}

export type BoardGameDocument = IBoardGame & Document;