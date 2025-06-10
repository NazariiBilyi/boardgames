import { Types, Document } from 'mongoose';

export interface IShopItem extends Document{
    name: string;
    type: string;
    price: number;
    availability: boolean;
    description: string;
    images: Types.ObjectId;
    ageRestrictions: string;
    vendor: string;
}