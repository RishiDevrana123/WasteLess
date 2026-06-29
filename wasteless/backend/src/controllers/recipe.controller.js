import InventoryItem from '../models/InventoryItem.js';
import { getRecipeSuggestions } from '../services/recipe.service.js';
import { getGroqRecipeSuggestions } from '../services/groq.service.js';

export const getSuggestions = async (req, res, next) => {
    try {
        const { limit = 5, prioritizeExpiring = true } = req.query;

        // OPTIMIZATION: Added a hard limit of 15 items at the database layer
        // to prevent context bloat while prioritizing critically expiring foods
        const inventory = await InventoryItem.find({
            user: req.user._id,
            status: { $in: ['fresh', 'expiring-soon'] },
        })
        .sort(prioritizeExpiring === 'true' || prioritizeExpiring === true ? 'expiryDate' : '-createdAt')
        .limit(15); 

        if (inventory.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: 'No inventory items found',
            });
        }

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

        // OPTIMIZATION: Capped inventory items at 15 for the custom prompt route
        // ensures the LLM receives a highly targeted set of ingredients
        const inventory = await InventoryItem.find({
            user: req.user._id,
            status: { $in: ['fresh', 'expiring-soon'] },
        })
        .sort('expiryDate')
        .limit(15);

        const recipes = await getGroqRecipeSuggestions(inventory, prompt);

        res.json({
            success: true,
            data: recipes,
        });
    } catch (error) {
        next(error);
    }
};
