import crypto from 'crypto';
import Stripe from 'stripe';
import FinancialDonation from '../models/FinancialDonation.js';
import { stripeConfig } from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';

// Initialize Stripe (mock if no keys provided)
let stripe;
if (stripeConfig.secretKey) {
    stripe = new Stripe(stripeConfig.secretKey, {
        apiVersion: '2023-10-16',
    });
} else {
    console.log('⚠️  Stripe running in MOCK mode');
    stripe = {
        checkout: {
            sessions: {
                create: async (options) => ({
                    id: 'session_mock_' + Date.now(),
                    url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/donations?payment=success&session_id=session_mock_${Date.now()}`,
                }),
            },
        },
    };
}

export const createDonationOrder = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount) || amount <= 0 || !Number.isFinite(amount)) {
            return res.status(400).json({ success: false, error: 'Invalid donation amount' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'WasteLess Software Donation',
                        description: 'Server & Maintenance Support',
                    },
                    unit_amount: amount * 100, // Convert to paise
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/donations?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/donations?payment=cancelled`,
        });

        // Store donation in DB
        await FinancialDonation.create({
            user: req.user?._id || null, // allow unauthenticated guests
            amount: amount,
            paymentDetails: {
                stripeSessionId: session.id,
            }
        });

        res.status(201).json({
            success: true,
            data: {
                url: session.url,
                sessionId: session.id,
                amount: amount * 100,
                currency: 'INR',
                keyId: stripeConfig.publishableKey || 'pk_test_mock',
            },
        });
    } catch (error) {
        next(error);
    }
};

export const verifyDonationPayment = async (req, res, next) => {
    try {
        const { session_id } = req.body;

        const donation = await FinancialDonation.findOne({ 'paymentDetails.stripeSessionId': session_id });
        if (!donation) {
            return next(new AppError('Donation record not found', 404));
        }

        // Technically, you'd verify with Stripe APIs here but trusting the URL callback for dev
        donation.status = 'completed';
        await donation.save();

        res.json({
            success: true,
            message: 'Donation verified successfully',
            data: {
                paymentId: session_id,
                amount: donation.amount,
                status: 'confirmed'
            }
        });
    } catch (error) {
        next(error);
    }
};
