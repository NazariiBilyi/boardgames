import { Types } from 'mongoose';

export interface IShopItem {
    name: string;
    type: string;
    price: number;
    availability: boolean;
    description: string;
    images?: Types.ObjectId[]; // Optional because not marked `required`
    ageRestrictions: string;
    vendor: string;
}