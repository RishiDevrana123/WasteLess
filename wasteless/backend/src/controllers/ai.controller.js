import { generateStorageAdvice } from '../services/groq.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getStorageAdvice = async (req, res, next) => {
    try {
        const { itemName } = req.body;
        if (!itemName) {
            return next(new AppError('Item name is required', 400));
        }

        const advice = await generateStorageAdvice(itemName);

        res.json({
            success: true,
            data: { advice }
        });
    } catch (error) {
        next(error);
    }
};
