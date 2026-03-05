import express from 'express';
import { body } from 'express-validator';
import {
    register,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    register
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    login
);

router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', [body('email').isEmail()], forgotPassword);
router.post('/reset-password/:token', [body('password').isLength({ min: 6 })], resetPassword);
router.get('/verify-email/:token', verifyEmail);

export default router;
