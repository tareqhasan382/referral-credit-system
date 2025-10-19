import { Router } from 'express';
import referralController from "../controllers/referral.controller";



const router = Router();

router.get('/get-referrals', referralController.getReferral);

export default router;