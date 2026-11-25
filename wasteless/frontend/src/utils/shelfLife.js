/**
 * Comprehensive culinary shelf-life & category knowledge base.
 * Categorizes food items and computes realistic shelf-life durations (in days).
 */

export const FOOD_DATABASE = [
    // --- Dairy (Refrigerated) ---
    { keywords: ['milk', 'doodh'], category: 'dairy', days: 4, unit: 'l', defaultQty: 1 },
    { keywords: ['paneer', 'cottage cheese'], category: 'dairy', days: 5, unit: 'g', defaultQty: 250 },
    { keywords: ['curd', 'dahi', 'yogurt'], category: 'dairy', days: 6, unit: 'g', defaultQty: 400 },
    { keywords: ['cream', 'malai'], category: 'dairy', days: 5, unit: 'ml', defaultQty: 200 },
    { keywords: ['cheese', 'cheddar', 'mozzarella'], category: 'dairy', days: 14, unit: 'g', defaultQty: 200 },
    { keywords: ['butter', 'makhan'], category: 'dairy', days: 30, unit: 'g', defaultQty: 100 },

    // --- Vegetables (Fresh Produce) ---
    { keywords: ['coriander', 'dhaniya', 'cilantro'], category: 'vegetables', days: 4, unit: 'pieces', defaultQty: 1 },
    { keywords: ['spinach', 'palak', 'methi', 'fenugreek', 'lettuce', 'greens'], category: 'vegetables', days: 4, unit: 'g', defaultQty: 250 },
    { keywords: ['mushroom', 'mushrooms'], category: 'vegetables', days: 4, unit: 'packets', defaultQty: 1 },
    { keywords: ['tomato', 'tomatoes', 'tamatar'], category: 'vegetables', days: 7, unit: 'kg', defaultQty: 1 },
    { keywords: ['cucumber', 'kheera'], category: 'vegetables', days: 7, unit: 'pieces', defaultQty: 2 },
    { keywords: ['capsicum', 'bell pepper', 'shimla mirch'], category: 'vegetables', days: 7, unit: 'pieces', defaultQty: 2 },
    { keywords: ['cauliflower', 'gobi', 'broccoli'], category: 'vegetables', days: 7, unit: 'pieces', defaultQty: 1 },
    { keywords: ['cabbage', 'patta gobi'], category: 'vegetables', days: 14, unit: 'pieces', defaultQty: 1 },
    { keywords: ['carrot', 'carrots', 'gajar'], category: 'vegetables', days: 14, unit: 'kg', defaultQty: 1 },
    { keywords: ['chilli', 'chilies', 'chili', 'mirchi'], category: 'vegetables', days: 10, unit: 'g', defaultQty: 100 },
    { keywords: ['ginger', 'adrak'], category: 'vegetables', days: 21, unit: 'g', defaultQty: 100 },
    { keywords: ['garlic', 'lehsun'], category: 'vegetables', days: 30, unit: 'pieces', defaultQty: 2 },
    { keywords: ['onion', 'onions', 'pyaz'], category: 'vegetables', days: 21, unit: 'kg', defaultQty: 1 },
    { keywords: ['potato', 'potatoes', 'aloo'], category: 'vegetables', days: 30, unit: 'kg', defaultQty: 1 },
    { keywords: ['lemon', 'lemons', 'nimbu', 'lime'], category: 'vegetables', days: 21, unit: 'pieces', defaultQty: 4 },

    // --- Fruits ---
    { keywords: ['banana', 'bananas', 'kela'], category: 'fruits', days: 4, unit: 'pieces', defaultQty: 6 },
    { keywords: ['berry', 'berries', 'strawberry', 'blueberries'], category: 'fruits', days: 4, unit: 'packets', defaultQty: 1 },
    { keywords: ['mango', 'mangoes', 'aam'], category: 'fruits', days: 5, unit: 'kg', defaultQty: 1 },
    { keywords: ['grape', 'grapes', 'angoor'], category: 'fruits', days: 6, unit: 'g', defaultQty: 500 },
    { keywords: ['apple', 'apples', 'seb'], category: 'fruits', days: 21, unit: 'kg', defaultQty: 1 },
    { keywords: ['orange', 'oranges', 'santara'], category: 'fruits', days: 14, unit: 'kg', defaultQty: 1 },

    // --- Meat, Seafood & Poultry ---
    { keywords: ['chicken', 'murgi'], category: 'meat', days: 2, unit: 'g', defaultQty: 500 },
    { keywords: ['fish', 'prawn', 'shrimp', 'machli'], category: 'meat', days: 2, unit: 'g', defaultQty: 500 },
    { keywords: ['mutton', 'lamb', 'goat', 'meat', 'beef', 'pork'], category: 'meat', days: 3, unit: 'g', defaultQty: 500 },
    { keywords: ['egg', 'eggs', 'ande'], category: 'meat', days: 21, unit: 'pieces', defaultQty: 6 },

    // --- Bakery & Grains ---
    { keywords: ['bread', 'pav', 'bun', 'buns', 'toast'], category: 'grains', days: 5, unit: 'packets', defaultQty: 1 },
    { keywords: ['roti', 'chapati', 'paratha', 'naan'], category: 'grains', days: 2, unit: 'pieces', defaultQty: 4 },
    { keywords: ['atta', 'flour', 'maida', 'wheat'], category: 'grains', days: 90, unit: 'kg', defaultQty: 1 },
    { keywords: ['besan', 'gram flour'], category: 'grains', days: 90, unit: 'g', defaultQty: 500 },
    { keywords: ['rice', 'chawal', 'basmati'], category: 'grains', days: 180, unit: 'kg', defaultQty: 1 },
    { keywords: ['dal', 'lentil', 'lentils', 'moong', 'toor', 'chana', 'rajma', 'urad'], category: 'grains', days: 180, unit: 'kg', defaultQty: 1 },
    { keywords: ['pasta', 'noodle', 'noodles', 'maggi', 'macaroni'], category: 'grains', days: 180, unit: 'packets', defaultQty: 1 },
    { keywords: ['oats'], category: 'grains', days: 180, unit: 'g', defaultQty: 500 },

    // --- Spices & Condiments ---
    { keywords: ['salt', 'namak'], category: 'spices', days: 365, unit: 'packets', defaultQty: 1 },
    { keywords: ['haldi', 'turmeric'], category: 'spices', days: 365, unit: 'g', defaultQty: 100 },
    { keywords: ['jeera', 'cumin'], category: 'spices', days: 365, unit: 'g', defaultQty: 100 },
    { keywords: ['garam masala', 'spice', 'spices', 'masala', 'pepper'], category: 'spices', days: 365, unit: 'packets', defaultQty: 1 },
    { keywords: ['oil', 'tel', 'mustard oil', 'sunflower oil'], category: 'spices', days: 180, unit: 'l', defaultQty: 1 },
    { keywords: ['ghee'], category: 'spices', days: 180, unit: 'g', defaultQty: 500 },

    // --- Beverages & Snacks ---
    { keywords: ['tea', 'chai', 'coffee'], category: 'beverages', days: 180, unit: 'g', defaultQty: 250 },
    { keywords: ['juice', 'shake'], category: 'beverages', days: 5, unit: 'l', defaultQty: 1 },
    { keywords: ['biscuit', 'biscuits', 'cookie', 'cookies', 'chips', 'namkeen'], category: 'snacks', days: 60, unit: 'packets', defaultQty: 1 },
];

export const EXPIRY_PRESETS = [
    { label: '3 Days', days: 3 },
    { label: '1 Week', days: 7 },
    { label: '2 Weeks', days: 14 },
    { label: '1 Month', days: 30 },
    { label: '6 Months', days: 180 },
];

/**
 * Returns ISO Date string (YYYY-MM-DD) offset by `days` from today.
 */
export const getDatePlusDays = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + Number(days));
    return d.toISOString().split('T')[0];
};

/**
 * Parses raw ingredient string like "500g paneer" or "2 medium onions" or "Milk"
 * and infers quantity, unit, category, and realistic shelf-life days.
 */
export const inferFoodAttributes = (rawString) => {
    if (!rawString || typeof rawString !== 'string') {
        return {
            cleanName: 'Item',
            category: 'other',
            quantityValue: 1,
            quantityUnit: 'pieces',
            shelfLifeDays: 7,
            expiryDate: getDatePlusDays(7),
        };
    }

    const lower = rawString.toLowerCase().trim();

    // 1. Try to extract quantity and unit from string (e.g. "500g", "1.5 kg", "2 packets", "3 pieces")
    let extractedValue = null;
    let extractedUnit = null;

    const qtyUnitMatch = lower.match(/^([\d.]+)\s*(kg|g|l|ml|pieces|packets|cup|cups|tbsp|tsp)?\b/i) ||
                         lower.match(/\b([\d.]+)\s*(kg|g|l|ml|pieces|packets)\b/i);

    if (qtyUnitMatch) {
        const val = parseFloat(qtyUnitMatch[1]);
        if (!isNaN(val) && val > 0) {
            extractedValue = val;
            const unitCandidate = (qtyUnitMatch[2] || '').toLowerCase();
            if (['kg', 'g', 'l', 'ml', 'pieces', 'packets'].includes(unitCandidate)) {
                extractedUnit = unitCandidate;
            } else if (unitCandidate === 'cup' || unitCandidate === 'cups') {
                extractedValue = val * 200;
                extractedUnit = 'g';
            } else if (unitCandidate === 'tbsp' || unitCandidate === 'tsp') {
                extractedValue = val * 15;
                extractedUnit = 'g';
            }
        }
    }

    // 2. Clean name by stripping obvious leading quantities and common descriptors
    let cleanName = rawString
        .replace(/^[\d./\s]+(kg|g|l|ml|pieces|packets|cups?|tbsp|tsp)?\s*(of)?\s*/i, '')
        .replace(/\b(medium|large|small|fresh|chopped|diced|sliced|ripe|crumbled)\b/gi, '')
        .trim();

    // Capitalize first letter
    if (cleanName.length > 0) {
        cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    } else {
        cleanName = rawString;
    }

    // 3. Match against food knowledge base
    let matchedEntry = null;
    for (const entry of FOOD_DATABASE) {
        if (entry.keywords.some(kw => lower.includes(kw))) {
            matchedEntry = entry;
            break;
        }
    }

    if (matchedEntry) {
        const days = matchedEntry.days;
        return {
            cleanName,
            category: matchedEntry.category,
            quantityValue: extractedValue !== null ? extractedValue : matchedEntry.defaultQty,
            quantityUnit: extractedUnit || matchedEntry.unit,
            shelfLifeDays: days,
            expiryDate: getDatePlusDays(days),
        };
    }

    // 4. Fallback defaults if item not matched in database
    return {
        cleanName,
        category: 'other',
        quantityValue: extractedValue !== null ? extractedValue : 1,
        quantityUnit: extractedUnit || 'pieces',
        shelfLifeDays: 7,
        expiryDate: getDatePlusDays(7),
    };
};

