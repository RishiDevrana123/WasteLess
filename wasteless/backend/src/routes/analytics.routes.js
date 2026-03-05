import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAnalytics, getUserImpact } from '../controllers/analytics.controller.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getAnalytics);
router.get('/impact', getUserImpact);

export default router;
