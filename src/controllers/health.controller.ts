import { Request, Response } from 'express';
import ApiResponse from '../utils/ApiResponse';
import { healthService } from '../services/health.service';

export const getHealth = async(req: Request, res: Response) => {
  //   const data = {
  //   uptime: process.uptime(),
  //   timestamp: new Date().toISOString(),
  //   status: 'ok',
  // };
  const data = await healthService();
  res.json(new ApiResponse(true, 200, 'Server is healthyyy 🚀',data));
};