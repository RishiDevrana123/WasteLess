import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import InventoryItem from '../models/InventoryItem.js';
import SurplusPost from '../models/SurplusPost.js';
import Donation from '../models/Donation.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await InventoryItem.deleteMany({});
        await SurplusPost.deleteMany({});
        await Donation.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = await User.create([
            {
                name: 'Rahul Sharma',
                email: 'rahul@example.com',
                password: hashedPassword,
                phone: '+919876543210',
                role: 'user',
                emailVerified: true,
                address: {
                    street: '123 MG Road',
                    city: 'Delhi',
                    state: 'Delhi',
                    pincode: '110001',
                    coordinates: {
                        type: 'Point',
                        coordinates: [77.2090, 28.6139], // [lng, lat]
                    },
                },
                preferences: {
                    dietaryRestrictions: ['vegetarian'],
                    cuisinePreferences: ['indian', 'italian'],
                },
            },
            {
                name: 'Priya Patel',
                email: 'priya@example.com',
                password: hashedPassword,
                phone: '+919876543211',
                role: 'user',
                emailVerified: true,
                address: {
                    street: '456 Connaught Place',
                    city: 'Delhi',
                    state: 'Delhi',
                    pincode: '110002',
                    coordinates: {
                        type: 'Point',
                        coordinates: [77.2167, 28.6304],
                    },
                },
            },
            {
                name: 'Spice Garden Restaurant',
                email: 'spicegarden@example.com',
                password: hashedPassword,
                phone: '+919876543212',
                role: 'restaurant',
                emailVerified: true,
                address: {
                    street: '789 Nehru Place',
                    city: 'Delhi',
                    state: 'Delhi',
                    pincode: '110019',
                    coordinates: {
                        type: 'Point',
                        coordinates: [77.2502, 28.5494],
                    },
                },
            },
            {
                name: 'Delhi Food Bank NGO',
                email: 'foodbank@example.com',
                password: hashedPassword,
                phone: '+919876543213',
                role: 'ngo',
                emailVerified: true,
                address: {
                    street: '321 Karol Bagh',
                    city: 'Delhi',
                    state: 'Delhi',
                    pincode: '110005',
                    coordinates: {
                        type: 'Point',
                        coordinates: [77.1905, 28.6519],
                    },
                },
            },
        ]);

        console.log('✅ Created users');

        // Create inventory items
        const now = new Date();
        const inventoryItems = await InventoryItem.create([
            {
                user: users[0]._id,
                name: 'Tomatoes',
                category: 'vegetables',
                quantity: { value: 500, unit: 'g' },
                expiryDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
                storage: 'refrigerator',
                status: 'fresh',
            },
            {
                user: users[0]._id,
                name: 'Milk',
                category: 'dairy',
                quantity: { value: 1, unit: 'l' },
                expiryDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day
                storage: 'refrigerator',
                status: 'expiring-soon',
            },
            {
                user: users[0]._id,
                name: 'Rice',
                category: 'grains',
                quantity: { value: 5, unit: 'kg' },
                expiryDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months
                storage: 'pantry',
                status: 'fresh',
            },
            {
                user: users[1]._id,
                name: 'Paneer',
                category: 'dairy',
                quantity: { value: 200, unit: 'g' },
                expiryDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
                storage: 'refrigerator',
                status: 'fresh',
            },
        ]);

        console.log('✅ Created inventory items');

        // Create surplus posts
        const surplusPosts = await SurplusPost.create([
            {
                restaurant: users[2]._id,
                title: 'Delicious Paneer Butter Masala Combo',
                description: 'Fresh paneer butter masala with 4 butter naans and rice',
                category: 'indian',
                images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7'],
                originalPrice: 400,
                discountedPrice: 200,
                quantity: { available: 5, total: 10 },
                pickupTime: {
                    start: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
                    end: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours from now
                },
                location: {
                    address: '789 Nehru Place, Delhi',
                    coordinates: {
                        type: 'Point',
                        coordinates: [77.2502, 28.5494],
                    },
                },
                dietaryInfo: {
                    isVeg: true,
                    isVegan: false,
                    allergens: ['dairy'],
                },
                status: 'active',
                averageRating: 4.5,
            },
            {
                restaurant: users[2]._id,
                title: 'Mixed Veg Thali',
                description: 'Complete vegetarian thali with dal, sabzi, roti, rice, and dessert',
                category: 'indian',
                images: ['https://images.unsplash.com/photo-1546833998-877b37c2e5c6'],
                originalPrice: 300,
                discountedPrice: 150,
                quantity: { available: 8, total: 10 },
                pickupTime: {
                    start: new Date(now.getTime() + 1 * 60 * 60 * 1000),
                    end: new Date(now.getTime() + 3 * 60 * 60 * 1000),
                },
                location: {
                    address: '789 Nehru Place, Delhi',
                    coordinates: {
                        type: 'Point',
                        coordinates: [77.2502, 28.5494],
                    },
                },
                dietaryInfo: {
                    isVeg: true,
                    isVegan: false,
                },
                status: 'active',
                averageRating: 4.8,
            },
        ]);

        console.log('✅ Created surplus posts');

        // Create donations
        const donations = await Donation.create([
            {
                donor: users[0]._id,
                title: 'Fresh Vegetables and Fruits',
                description: 'Assorted fresh vegetables and seasonal fruits',
                foodItems: [
                    { name: 'Tomatoes', quantity: '1 kg', category: 'vegetables' },
                    { name: 'Potatoes', quantity: '2 kg', category: 'vegetables' },
                    { name: 'Apples', quantity: '500g', category: 'fruits' },
                ],
                servings: 10,
                pickupLocation: {
                    address: '123 MG Road, Delhi',
                    coordinates: {
                        type: 'Point',
                        coordinates: [77.2090, 28.6139],
                    },
                },
                pickupTime: {
                    start: new Date(now.getTime() + 2 * 60 * 60 * 1000),
                    end: new Date(now.getTime() + 6 * 60 * 60 * 1000),
                },
                status: 'available',
            },
            {
                donor: users[1]._id,
                title: 'Cooked Rice and Dal',
                description: 'Freshly cooked rice and dal, enough for 5 people',
                foodItems: [
                    { name: 'Rice', quantity: '1 kg', category: 'grains' },
                    { name: 'Dal', quantity: '500g', category: 'lentils' },
                ],
                servings: 5,
                pickupLocation: {
                    address: '456 Connaught Place, Delhi',
                    coordinates: {
                        type: 'Point',
                        coordinates: [77.2167, 28.6304],
                    },
                },
                pickupTime: {
                    start: new Date(now.getTime() + 1 * 60 * 60 * 1000),
                    end: new Date(now.getTime() + 3 * 60 * 60 * 1000),
                },
                status: 'available',
            },
        ]);

        console.log('✅ Created donations');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Test Credentials:');
        console.log('User: rahul@example.com / password123');
        console.log('User: priya@example.com / password123');
        console.log('Restaurant: spicegarden@example.com / password123');
        console.log('NGO: foodbank@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
