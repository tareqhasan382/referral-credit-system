import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import ApiResponse from "../utils/ApiResponse";

const register = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.registerUser(req.body);
        return res.status(201).json(new ApiResponse(true, 201, "User registered successfully", result));
    } catch (error: any) {
        res.status(400).json(new ApiResponse(false, 400, error.message));
    }
};
export default { register };