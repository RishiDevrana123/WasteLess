import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Item name is required'],
            trim: true,
        },
        category: {
            type: String,
            enum: [
                'vegetables',
                'fruits',
                'dairy',
                'meat',
                'grains',
                'spices',
                'beverages',
                'snacks',
                'other',
            ],
            required: true,
        },
        quantity: {
            value: { type: Number, required: true, min: 0 },
            unit: {
                type: String,
                enum: ['kg', 'g', 'l', 'ml', 'pieces', 'packets'],
                required: true,
            },
        },
        purchaseDate: {
            type: Date,
            default: Date.now,
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiry date is required'],
        },
        barcode: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            default: '',
        },
        storage: {
            type: String,
            enum: ['refrigerator', 'freezer', 'pantry', 'counter'],
            default: 'pantry',
        },
        status: {
            type: String,
            enum: ['fresh', 'expiring-soon', 'expired', 'consumed'],
            default: 'fresh',
        },
        notes: {
            type: String,
            trim: true,
        },
        alertSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for expiry date queries
inventoryItemSchema.index({ expiryDate: 1, status: 1 });
inventoryItemSchema.index({ user: 1, status: 1 });

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem;
