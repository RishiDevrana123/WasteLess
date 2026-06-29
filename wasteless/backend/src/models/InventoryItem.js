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
// Optimizes the updateMany cleanup process for items crossing the expiration boundary
inventoryItemSchema.index({ status: 1, expiryDate: 1 });

// 1. Define a Virtual Property that dynamically calculates status in real-time on read queries
inventoryItemSchema.virtual('realTimeStatus').get(function() {
    const now = new Date();
    // If the item has crossed its expiration time but the cron job hasn't updated it yet, override dynamically
    if (this.expiryDate <= now && this.status !== 'expired' && this.status !== 'consumed') {
        return 'expired';
    }
    return this.status;
});

// 2. Crucial: Ensure virtual fields are serialized and included whenever Mongoose documents are converted to JSON or Objects
inventoryItemSchema.set('toJSON', { virtuals: true });
inventoryItemSchema.set('toObject', { virtuals: true });

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem;
