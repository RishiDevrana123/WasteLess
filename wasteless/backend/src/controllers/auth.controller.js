import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { jwtConfig } from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendEmail } from '../services/email.service.js';

const generateToken = (id) => {
    return jwt.sign({ id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
};

export const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password, phone, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError('User already exists with this email', 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'user',
            verificationToken,
        });

        // Send verification email (non-blocking)
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
        try {
            await sendEmail({
                to: email,
                subject: 'Verify Your Email - WasteLess',
                html: `
        <h1>Welcome to WasteLess!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `,
            });
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError.message);
            // Continue with registration even if email fails
        }

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshTokens.push(refreshToken);
        await user.save();

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new AppError('No user found with this email', 401));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new AppError('Password is wrong', 401));
        }

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshTokens.push(refreshToken);
        await user.save();

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    emailVerified: user.emailVerified,
                },
                token,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(new AppError('Refresh token is required', 400));
        }

        const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
        const user = await User.findById(decoded.id);

        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return next(new AppError('Invalid refresh token', 401));
        }

        const newToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        res.json({
            success: true,
            data: {
                token: newToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        next(new AppError('Invalid or expired refresh token', 401));
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
            const user = await User.findById(decoded.id);

            if (user) {
                user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
                await user.save();
            }
        }

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError('No user found with this email', 404));
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        try {
            await sendEmail({
                to: email,
                subject: 'Password Reset - WasteLess',
                html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 30 minutes.</p>
      `,
            });
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError.message);
        }

        res.json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(new AppError('Invalid or expired reset token', 400));
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return next(new AppError('Invalid verification token', 400));
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};
