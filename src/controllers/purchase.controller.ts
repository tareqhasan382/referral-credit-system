import { Request, Response } from 'express';
import ApiResponse from "../utils/ApiResponse";
import PurchaseService from "../services/purchase.service";
import mongoose from "mongoose";

export type IPurchaseRequestBody = {
    userId: string;
    amount: number;
}

const createOrder = async (req: Request, res: Response) => {
    try {
        if (!req.user?.userId) {
            return res
                .status(401)
                .json(new ApiResponse(false, 401, "Unauthorized: Missing user info"));
        }
        const {userId} = req.user;
        const result = await PurchaseService.createOrder({...req.body, userId: userId});
        return res.status(201).json(new ApiResponse(true, 201, "Order Purchase successfully", result));
    } catch (error: any) {
        res.status(400).json(new ApiResponse(false, 400, error.message));
    }
};

export default { createOrder };