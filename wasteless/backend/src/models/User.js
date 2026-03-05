import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,
        },
        phone: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        avatar: {
            type: String,
            default: '',
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            coordinates: {
                type: { type: String, default: 'Point' },
                coordinates: [Number], // [longitude, latitude]
            },
        },
        preferences: {
            dietaryRestrictions: [String],
            cuisinePreferences: [String],
            allergens: [String],
            notificationSettings: {
                email: { type: Boolean, default: true },
                push: { type: Boolean, default: true },
                sms: { type: Boolean, default: false },
            },
        },
        fcmTokens: [String],
        refreshTokens: [String],
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        emailVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: String,
        cookedRecipes: [
            {
                title: String,
                date: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true,
    }
);

// Index for geospatial queries (disabled - causing issues with empty coordinates)
// userSchema.index({ 'address.coordinates': '2dsphere' });

const User = mongoose.model('User', userSchema);

export default User;
