import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        // Drop all indexes except _id
        await usersCollection.dropIndexes();
        console.log('✅ Dropped all indexes from users collection');

        await mongoose.connection.close();
        console.log('✅ Done! You can now sign up.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

dropIndexes();
