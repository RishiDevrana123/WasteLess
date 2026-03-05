import express from 'express';
import { protect } from '../middleware/auth.js';
import { getStorageAdvice } from '../controllers/ai.controller.js';

const router = express.Router();

router.use(protect);

router.post('/storage-advice', getStorageAdvice);

export default router;
