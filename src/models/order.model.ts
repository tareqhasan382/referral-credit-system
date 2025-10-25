import { Schema, model, Types } from "mongoose";
import {IOrder} from "../types/order.interface";

const orderSchema = new Schema<IOrder>(
    {
        user: {type: Schema.Types.ObjectId, ref: "User" },
        totalAmount: {type: Number, required: true},
        status: {type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'completed'
        },
    },
    { timestamps: true }
);

export const OrderModel = model<IOrder>("Order", orderSchema);