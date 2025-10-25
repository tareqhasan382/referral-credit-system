import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { StatusCodes } from "http-status-codes";

export const authVerify =
    (...requiredRoles: string[]) =>
        (req: Request, res: Response, next: NextFunction): void => {
            try {
                const token = req.headers.authorization;

                if (!token) {
                    res.status(StatusCodes.UNAUTHORIZED).json({
                        statusCode: StatusCodes.UNAUTHORIZED,
                        success: false,
                        message: "You are not authorized",
                        data: null,
                    });
                    return;
                }

                const secret = config.jwt.jwt_access_secret;
                if (!secret) {
                    throw new Error("JWT secret not configured");
                }

                const verifiedUser = jwt.verify(token, secret) as JwtPayload & {
                    userId: string;
                    role?: string;
                };

                req.user = verifiedUser;

                if (
                    requiredRoles.length > 0 &&
                    (!verifiedUser.role || !requiredRoles.includes(verifiedUser.role))
                ) {
                    res.status(StatusCodes.FORBIDDEN).json({
                        statusCode: StatusCodes.FORBIDDEN,
                        success: false,
                        message: "Forbidden",
                        data: null,
                    });
                    return;
                }

                next();
            } catch (error) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized: Invalid or expired token",
                });
            }
        };
