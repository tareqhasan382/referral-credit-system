import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import ApiResponse from "../utils/ApiResponse";
import config from "../config";

const register = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.registerUser(req.body);
        return res.status(201).json(new ApiResponse(true, 201, "User registered successfully", result));
    } catch (error: any) {
        res.status(400).json(new ApiResponse(false, 400, error.message));
    }
};
const login = async (req: Request, res: Response) => {
    try {
        const {user, accessToken, refreshToken } = await AuthService.loginUser(req.body);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: config.jwt.jwt_cookie_secure === "true",
            secure: config.node_env === "production",
            sameSite:(config.jwt.jwt_cookie_samesite as "lax" | "strict" | "none") || "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json(new ApiResponse(true, 200, "Login successful", {user, accessToken,refreshToken }));
    } catch (error: any) {
        res.status(401).json(new ApiResponse(false, 401, error.message));
    }
};
export default { register,login };