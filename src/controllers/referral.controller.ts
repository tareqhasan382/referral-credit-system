import { Request, Response } from "express";
import ReferralService from "../services/referral.service";
import ApiResponse from "../utils/ApiResponse";
import {JwtPayload} from "jsonwebtoken";

const getReferral = async (req: Request, res: Response) => {
    try {
        if (!req.user?.userId) {
            return res
                .status(401)
                .json(new ApiResponse(false, 401, "Unauthorized: Missing user info"));
        }
        const {userId} = req.user;
        const result = await ReferralService.getReferral(userId);
        return res.status(201).json(new ApiResponse(true, 201, "Referrals retrieve successfully", result));
    } catch (error: any) {
        res.status(400).json(new ApiResponse(false, 400, error.message));
    }
};

export default { getReferral};