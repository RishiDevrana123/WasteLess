/**
 * Test Setup — runs before EVERY test file.
 *
 * Uses mongodb-memory-server to spin up an ephemeral MongoDB instance
 * entirely in RAM. No Atlas connection, no Docker, no local MongoDB needed.
 *
 * Lifecycle:
 *   beforeAll  → Start in-memory MongoDB, connect Mongoose
 *   afterEach  → Wipe all collections (test isolation)
 *   afterAll   → Drop DB, disconnect Mongoose, stop the server
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, afterEach } from 'vitest';

let mongoServer;

beforeAll(async () => {
    // Disconnect any existing connection first
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    // Start an in-memory MongoDB instance (downloads binary on first run)
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    console.log(`\n🧪 In-memory test DB started: ${uri}`);
});

afterEach(async () => {
    // Clean all collections between individual tests for isolation
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    // Drop the database, close connection, stop the server
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
        await mongoServer.stop();
    }
    console.log('🧹 In-memory test DB stopped\n');
});
