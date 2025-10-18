import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';


export default function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
  logger.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}