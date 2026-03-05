import InventoryItem from '../models/InventoryItem.js';
import { AppError } from '../middleware/errorHandler.js';
import { parseSmartEntry } from '../services/groq.service.js';
import { createNotification } from '../services/notification.service.js';

export const getInventory = async (req, res, next) => {
    try {
        const { status, category, sortBy = 'expiryDate' } = req.query;

        const filter = { user: req.user._id };
        if (status) filter.status = status;
        if (category) filter.category = category;

        const items = await InventoryItem.find(filter).sort(sortBy);

        res.json({
            success: true,
            count: items.length,
            data: items,
        });
    } catch (error) {
        next(error);
    }
};

export const getInventoryItem = async (req, res, next) => {
    try {
        const item = await InventoryItem.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!item) {
            return next(new AppError('Item not found', 404));
        }

        res.json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

export const createInventoryItem = async (req, res, next) => {
    try {
        const itemData = {
            ...req.body,
            user: req.user._id,
        };

        // Determine status based on expiry date
        const daysUntilExpiry = Math.ceil(
            (new Date(itemData.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilExpiry < 0) {
            itemData.status = 'expired';
        } else if (daysUntilExpiry <= 3) {
            itemData.status = 'expiring-soon';
        } else {
            itemData.status = 'fresh';
        }

        const item = await InventoryItem.create(itemData);

        if (item.status === 'expiring-soon') {
            await createNotification({
                user: req.user._id,
                type: 'expiry-alert',
                title: 'Item Expiring Soon!',
                message: `Your ${item.name} will expire in ${daysUntilExpiry} day(s)`,
                data: { itemId: item._id, daysUntilExpiry },
            });
            item.alertSent = true;
            await item.save();
        }

        res.status(201).json({
            success: true,
            data: item,
        });
    } catch (error) {
        next(error);
    }
};

export const updateInventoryItem = async (req, res, next) => {
    try {
        let item = await InventoryItem.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!item) {
            return next(new AppError('Item not found', 404));
        }

        item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

export const deleteInventoryItem = async (req, res, next) => {
    try {
        const item = await InventoryItem.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!item) {
            return next(new AppError('Item not found', 404));
        }

        await item.deleteOne();

        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getExpiringItems = async (req, res, next) => {
    try {
        const { days = 3 } = req.query;
        const expiryThreshold = new Date();
        expiryThreshold.setDate(expiryThreshold.getDate() + parseInt(days));

        const items = await InventoryItem.find({
            user: req.user._id,
            expiryDate: { $lte: expiryThreshold },
            status: { $in: ['fresh', 'expiring-soon'] },
        }).sort('expiryDate');

        res.json({
            success: true,
            count: items.length,
            data: items,
        });
    } catch (error) {
        next(error);
    }
};

export const processSmartEntry = async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return next(new AppError('Please provide a grocery haul description', 400));
        }

        const items = await parseSmartEntry(prompt);

        if (!items || items.length === 0) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        const itemsToInsert = items.map(item => {
            const daysUntilExpiry = Math.ceil(
                (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
            );

            let status = 'fresh';
            if (daysUntilExpiry < 0) {
                status = 'expired';
            } else if (daysUntilExpiry <= 3) {
                status = 'expiring-soon';
            }

            return {
                ...item,
                user: req.user._id,
                status,
                image: ''
            };
        });

        const createdItems = await InventoryItem.insertMany(itemsToInsert);

        for (const item of createdItems) {
            if (item.status === 'expiring-soon') {
                const daysUntilExpiry = Math.ceil(
                    (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
                );
                await createNotification({
                    user: req.user._id,
                    type: 'expiry-alert',
                    title: 'Item Expiring Soon!',
                    message: `Your ${item.name} will expire in ${daysUntilExpiry} day(s)`,
                    data: { itemId: item._id, daysUntilExpiry },
                });
                await InventoryItem.findByIdAndUpdate(item._id, { alertSent: true });
            }
        }

        res.status(201).json({
            success: true,
            count: createdItems.length,
            data: createdItems
        });
    } catch (error) {
        next(error);
    }
};
