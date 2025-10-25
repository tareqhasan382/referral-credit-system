import { Router } from 'express';
import referralController from "../controllers/referral.controller";
import {authVerify} from "../middlewares/auth.middleware";

const router = Router();

router.get('/get-referrals',authVerify(), referralController.getReferral);

export default router;
