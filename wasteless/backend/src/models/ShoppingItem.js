import mongoose from 'mongoose';

const shoppingItemSchema = new mongoose.Schema(
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
        recipeId: {
            type: String, // Optional, to trace back to the recipe that suggested it
        },
        recipeName: {
            type: String,
        },
        isPurchased: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const ShoppingItem = mongoose.model('ShoppingItem', shoppingItemSchema);

export default ShoppingItem;
