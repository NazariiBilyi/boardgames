import {IShopItem} from "../ShopItemSchema/types";

export interface IBoardGame extends IShopItem {
    gameTime: string,
    numberOfPlayers: string,
    language: string
}