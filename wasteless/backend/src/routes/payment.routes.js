import express from 'express';
import {
    createDonationOrder,
    verifyDonationPayment
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-donation', createDonationOrder);
router.post('/verify-donation', verifyDonationPayment);

export default router;
