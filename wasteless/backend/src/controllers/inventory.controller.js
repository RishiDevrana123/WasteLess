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

        let items = [];
        let aiParsedSuccessfully = true;

        try {
            // LAYER 1: Raw Response Interception and Sanitization
            const rawResponse = await parseSmartEntry(prompt);
            
            let sanitizedString = '';
            if (typeof rawResponse === 'string') {
                // Regex isolating the JSON content safely between the first '[' and last ']' or '{' and '}'
                const jsonMatch = rawResponse.match(/[\{\[][\s\S]*[\}\]]/);
                if (!jsonMatch) {
                    throw new Error("No structural JSON patterns identified in AI text response.");
                }
                sanitizedString = jsonMatch[0];
                items = JSON.parse(sanitizedString);
            } else if (Array.isArray(rawResponse)) {
                items = rawResponse;
            } else if (rawResponse && typeof rawResponse === 'object') {
                items = [rawResponse];
            }

            // Standardize items layout to an array
            if (!Array.isArray(items)) {
                items = [items];
            }

            // LAYER 2: Structural Integrity and Type Validation Validation Check
            items = items.map(item => {
                // Ensure a valid item name string exists
                const validName = item.name || item.itemName || prompt.substring(0, 30);
                
                // Defensive Expiry Check: If date parsing fails, cleanly default to 5 days from now
                let validExpiry = new Date(item.expiryDate);
                if (isNaN(validExpiry.getTime())) {
                    validExpiry = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); 
                }
                
                // Validate category enum
                const validCategories = ['vegetables', 'fruits', 'dairy', 'meat', 'grains', 'spices', 'beverages', 'snacks', 'other'];
                const category = String(item.category).toLowerCase();

                // Validate unit enum
                const validUnits = ['kg', 'g', 'l', 'ml', 'pieces', 'packets'];
                let quantityValue = 1;
                let quantityUnit = 'pieces';
                if (item.quantity && typeof item.quantity === 'object') {
                    quantityValue = Number(item.quantity.value) || 1;
                    quantityUnit = validUnits.includes(String(item.quantity.unit).toLowerCase()) ? String(item.quantity.unit).toLowerCase() : 'pieces';
                } else if (item.quantity) {
                    quantityValue = Number(item.quantity) || 1;
                }

                return {
                    name: String(validName).trim(),
                    quantity: {
                        value: quantityValue,
                        unit: quantityUnit
                    },
                    category: validCategories.includes(category) ? category : 'other',
                    expiryDate: validExpiry,
                };
            });

        } catch (aiError) {
            // LAYER 3: Defensive Catch & Heuristic Failure Recovery Mode
            console.error("Groq Ingestion Layer crashed or returned malformed payloads. Triggering Heuristic Fallback:", aiError.message);
            
            aiParsedSuccessfully = false;
            
            // Build a single baseline tracking item directly out of the raw text so the app remains interactive
            items = [{
                name: prompt.substring(0, 40).trim() + "...",
                quantity: { value: 1, unit: 'pieces' },
                category: 'other',
                expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Default window of 3 days
            }];
        }

        // Processing database insertions using structural maps
        if (items.length === 0) {
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

        // Fire background push hooks for critical shelf-life warnings
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

        // Return unified status payloads with explicit processing health indicator flags
        res.status(201).json({
            success: true,
            aiParsedSuccessfully, // Tells frontend whether parsing worked perfectly or a fallback occurred
            count: createdItems.length,
            data: createdItems
        });
    } catch (error) {
        next(error);
    }
};
