import { Router } from 'express';
import {authVerify} from "../middlewares/auth.middleware";
import purchaseController from "../controllers/purchase.controller";



const router = Router();

router.post('/order',authVerify(), purchaseController.createOrder);

export default router;
