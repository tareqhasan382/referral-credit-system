
import { Types, Document } from "mongoose";

export interface IOrder extends Document {
    user: Types.ObjectId;
    totalAmount: number;
    status: 'pending' | 'completed' | 'failed';
}