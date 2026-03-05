import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const allowedFields = ['name', 'phone', 'address', 'preferences'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const uploadAvatar = async (req, res, next) => {
    try {
        const { avatar } = req.body;

        if (!avatar) {
            return next(new AppError('Please provide an image', 400));
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar },
            { new: true }
        );

        res.json({
            success: true,
            data: { avatar: user.avatar },
        });
    } catch (error) {
        next(error);
    }
};

import bcrypt from 'bcryptjs';

export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return next(new AppError('Incorrect current password', 400));
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

export const recordCookedRecipe = async (req, res, next) => {
    try {
        const { title } = req.body;

        if (!title) {
            return next(new AppError('Recipe title is required', 400));
        }

        const user = await User.findById(req.user._id);
        user.cookedRecipes.push({ title, date: new Date() });
        await user.save();

        res.json({ success: true, data: user.cookedRecipes });
    } catch (error) {
        next(error);
    }
};
