import {SortOrder} from "mongoose";

type SortType = string | { [key: string]: SortOrder };

export interface IFindOptions {
    sort?: SortType;
    limit?: number;
    skip?: number;
}