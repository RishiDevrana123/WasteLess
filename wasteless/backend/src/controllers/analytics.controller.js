import InventoryItem from '../models/InventoryItem.js';

// Conversion constants
// Assumptions for impact calculation
const KG_PER_ITEM = 0.5; // Average weight of a pantry item (e.g. pack of rice, flour, veggies)
const RUPEES_PER_KG = 120; // Average value of food per kg
const CO2_PER_KG = 2.5; // kg CO2 equivalent prevented per kg of food waste avoided

export const getAnalytics = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Get inventory stats
        const totalItems = await InventoryItem.countDocuments({ user: userId });
        const consumedItems = await InventoryItem.countDocuments({
            user: userId,
            status: 'consumed',
        });
        const expiredItems = await InventoryItem.countDocuments({
            user: userId,
            status: 'expired',
        });


        /* 
           IMPACT CALCULATION LOGIC:
           1. Food Saved: Every item 'consumed' instead of 'expired' counts as food saved from the bin.
              Formula: consumedItems * KG_PER_ITEM
           
           2. Money Saved: The value of the food you consumed (and didn't waste).
              Formula: consumedItems * KG_PER_ITEM * RUPEES_PER_KG
           
           3. CO2 Avoided: The emissions associated with producing that food which wasn't wasted.
              Formula: Food Saved (kg) * CO2_PER_KG
        */

        const foodSavedKg = consumedItems * KG_PER_ITEM;
        const moneySaved = foodSavedKg * RUPEES_PER_KG;
        const co2Avoided = foodSavedKg * CO2_PER_KG;

        res.json({
            success: true,
            data: {
                inventory: {
                    total: totalItems,
                    consumed: consumedItems,
                    expired: expiredItems,
                    active: totalItems - consumedItems - expiredItems,
                },

                impact: {
                    foodSavedKg: Math.round(foodSavedKg * 10) / 10,
                    moneySaved: Math.round(moneySaved),
                    co2AvoidedKg: Math.round(co2Avoided * 10) / 10,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getUserImpact = async (req, res, next) => {
    try {
        // Redundant endpoint often used by profile, simplifying to match above logic
        const userId = req.user._id;

        const consumedItems = await InventoryItem.countDocuments({
            user: userId,
            status: 'consumed',
        });

        const foodSavedKg = consumedItems * KG_PER_ITEM;
        const moneySaved = foodSavedKg * RUPEES_PER_KG;
        const co2AvoidedKg = foodSavedKg * CO2_PER_KG;

        res.json({
            success: true,
            data: {
                foodSavedKg: Math.round(foodSavedKg * 10) / 10,
                co2AvoidedKg: Math.round(co2AvoidedKg * 10) / 10,
                moneySaved: Math.round(moneySaved),
                itemsConsumed: consumedItems,
            },
        });
    } catch (error) {
        next(error);
    }
};
