import ShoppingItem from '../models/ShoppingItem.js';
import { AppError } from '../middleware/errorHandler.js';

export const addShoppingItems = async (req, res, next) => {
    try {
        const { items, recipeId, recipeName } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return next(new AppError('Please provide a valid array of items to add', 400));
        }

        const existingItems = await ShoppingItem.find({ user: req.user._id });
        const existingNames = new Set(existingItems.map(item => item.name.toLowerCase()));

        const itemsToAdd = items.filter(itemName => !existingNames.has(itemName.toLowerCase()));

        if (itemsToAdd.length === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'All items are already in your shopping list.',
                data: []
            });
        }

        const newItems = itemsToAdd.map(itemName => ({
            user: req.user._id,
            name: itemName,
            recipeId,
            recipeName
        }));

        const result = await ShoppingItem.insertMany(newItems);
        res.status(201).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(new AppError('Failed to add shopping items: ' + error.message, 500));
    }
};

export const getShoppingList = async (req, res, next) => {
    try {
        const list = await ShoppingItem.find({ user: req.user._id });
        res.status(200).json({
            status: 'success',
            data: list
        });
    } catch (error) {
        next(new AppError('Failed to retrieve shopping list: ' + error.message, 500));
    }
};

export const markAsPurchased = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentItem = await ShoppingItem.findOne({ _id: id, user: req.user._id });
        if (!currentItem) {
            return next(new AppError('Shopping item not found', 404));
        }

        const item = await ShoppingItem.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { isPurchased: !currentItem.isPurchased },
            { new: true }
        );
        res.status(200).json({
            status: 'success',
            data: item
        });
    } catch (error) {
        next(new AppError('Failed to update shopping item: ' + error.message, 500));
    }
};

export const clearShoppingList = async (req, res, next) => {
    try {
        const { recipeId, purchasedOnly } = req.query;
        let query = { user: req.user._id };

        if (recipeId) {
            query.recipeId = recipeId;
        }

        if (purchasedOnly === 'true') {
            query.isPurchased = true;
        }

        await ShoppingItem.deleteMany(query);
        res.status(200).json({
            status: 'success',
            message: 'Cleared items successfully'
        });
    } catch (error) {
        next(new AppError('Failed to clear shopping list: ' + error.message, 500));
    }
};
