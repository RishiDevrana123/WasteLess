import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Run test files sequentially (crucial: shared database state)
        sequence: {
            concurrent: false,
        },
        // Detect dangling async operations (open DB connections, timers, etc.)
        detectOpenHandles: true,
        // Generous timeout for DB-backed integration tests
        testTimeout: 30000,
        // Hook timeout for beforeAll/afterAll (DB connect/disconnect can be slow)
        hookTimeout: 30000,
        // Load environment variables before tests
        env: {
            NODE_ENV: 'test',
        },
        // Global setup files that run before each test file
        setupFiles: ['./test/setup.js'],
    },
});
