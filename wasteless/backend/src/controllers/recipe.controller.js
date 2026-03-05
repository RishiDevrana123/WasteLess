import InventoryItem from '../models/InventoryItem.js';
import { getRecipeSuggestions } from '../services/recipe.service.js';
import { getGroqRecipeSuggestions } from '../services/groq.service.js';

export const getSuggestions = async (req, res, next) => {
    try {
        const { limit = 5, prioritizeExpiring = true } = req.query;

        // Get user's inventory
        const inventory = await InventoryItem.find({
            user: req.user._id,
            status: { $in: ['fresh', 'expiring-soon'] },
        }).sort(prioritizeExpiring === 'true' ? 'expiryDate' : '-createdAt');

        if (inventory.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: 'No inventory items found',
            });
        }

        // Get recipe suggestions
        const recipes = await getRecipeSuggestions(inventory, parseInt(limit));

        res.json({
            success: true,
            data: recipes,
        });
    } catch (error) {
        next(error);
    }
};

export const getCustomSuggestions = async (req, res, next) => {
    try {
        const { prompt } = req.body;

        // Get user's inventory
        const inventory = await InventoryItem.find({
            user: req.user._id,
            status: { $in: ['fresh', 'expiring-soon'] },
        }).sort('expiryDate');

        const recipes = await getGroqRecipeSuggestions(inventory, prompt);

        res.json({
            success: true,
            data: recipes,
        });
    } catch (error) {
        next(error);
    }
};
