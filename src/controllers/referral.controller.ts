import { Request, Response } from "express";
import ReferralService from "../services/referral.service";
import ApiResponse from "../utils/ApiResponse";

const getReferral = async (req: Request, res: Response) => {
    try {
        const {userId} = req.body;
        console.log("userId------->",userId);
        const result = await ReferralService.getReferral(userId);
        return res.status(201).json(new ApiResponse(true, 201, "Referrals retrieve successfully", result));
    } catch (error: any) {
        res.status(400).json(new ApiResponse(false, 400, error.message));
    }
};

export default { getReferral};