import { Types } from 'mongoose';

export interface IShopItem {
    _id?: Types.ObjectId,
    name: string;
    type: string;
    price: number;
    availability: boolean;
    description: string;
    images?: Types.ObjectId[];
    ageRestrictions: string;
    vendor: string;
}