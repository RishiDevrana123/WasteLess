/**
 * WasteLess Auth API — Full Integration Test Suite
 *
 * Tests the COMPLETE authentication flow against the real Express app
 * with a real (test) MongoDB instance. No mocking, no running server needed.
 *
 * Endpoints covered:
 *   POST /api/auth/register     — User registration
 *   POST /api/auth/login        — User login
 *   POST /api/auth/refresh-token — Token rotation
 *   POST /api/auth/logout       — Session termination
 *   POST /api/auth/forgot-password — Password reset initiation
 */
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

// ─── Test Data ──────────────────────────────────────────────────────────────
const TEST_USER = {
    name: 'Rishi Test',
    email: 'rishi@test.com',
    password: 'SecurePass123',
    phone: '9876543210',
};

/**
 * Helper: Seed a user directly into the database (bypasses registration
 * endpoint so we can test login independently)
 */
const seedUser = async (overrides = {}) => {
    const hashedPassword = await bcrypt.hash(TEST_USER.password, 10);
    return User.create({
        name: TEST_USER.name,
        email: TEST_USER.email,
        password: hashedPassword,
        phone: TEST_USER.phone,
        refreshTokens: [],
        ...overrides,
    });
};

// ═══════════════════════════════════════════════════════════════════════════
//  REGISTRATION TESTS
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /api/auth/register', () => {

    it('✅ should register a new user and return tokens', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(TEST_USER);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=/);
        expect(res.body.data.user.email).toBe(TEST_USER.email);
        expect(res.body.data.user.name).toBe(TEST_USER.name);
        // Password should NEVER be returned
        expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('❌ should reject duplicate email registration', async () => {
        // First registration
        await request(app).post('/api/auth/register').send(TEST_USER);

        // Second registration with same email
        const res = await request(app)
            .post('/api/auth/register')
            .send(TEST_USER);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('❌ should reject registration with missing name', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'no-name@test.com', password: 'Pass123456' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('❌ should reject registration with invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Bad Email', email: 'not-an-email', password: 'Pass123456' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('❌ should reject registration with short password (<6 chars)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Short Pass', email: 'short@test.com', password: '123' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
//  LOGIN TESTS
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /api/auth/login', () => {

    beforeEach(async () => {
        // Seed a user so login has something to authenticate against
        await seedUser();
    });

    it('✅ should log in with correct credentials and return tokens', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: TEST_USER.email, password: TEST_USER.password });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=/);
        expect(res.body.data.user.email).toBe(TEST_USER.email);
    });

    it('❌ should reject login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: TEST_USER.email, password: 'WrongPassword999' });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('❌ should reject login with non-existent email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'ghost@nowhere.com', password: 'anything' });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('❌ should reject login with missing password field', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: TEST_USER.email });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('❌ should reject login with invalid email format', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'notanemail', password: 'anything' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
//  REFRESH TOKEN TESTS
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /api/auth/refresh-token', () => {

    let validCookie = '';

    beforeEach(async () => {
        // Register + login to get a real refresh token
        await request(app).post('/api/auth/register').send(TEST_USER);
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: TEST_USER.email, password: TEST_USER.password });
        validCookie = loginRes.headers['set-cookie'].find(c => c.startsWith('refreshToken='));
    });

    it('✅ should issue a new token pair with valid refresh token (rotation)', async () => {
        const res = await request(app)
            .post('/api/auth/refresh-token')
            .set('Cookie', validCookie);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        const newCookie = res.headers['set-cookie'].find(c => c.startsWith('refreshToken='));
        expect(newCookie).toBeDefined();
        // The NEW refresh token should be different from the old one (rotation)
        expect(newCookie).not.toBe(validCookie);
    });

    it('❌ should reject an already-used (rotated) refresh token', async () => {
        // Use the refresh token once (this rotates it)
        await request(app)
            .post('/api/auth/refresh-token')
            .set('Cookie', validCookie);

        // Try to use the OLD token again — should be rejected
        const res = await request(app)
            .post('/api/auth/refresh-token')
            .set('Cookie', validCookie);

        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
    });

    it('❌ should reject request with no refresh token provided', async () => {
        const res = await request(app)
            .post('/api/auth/refresh-token')
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('❌ should reject a completely fabricated refresh token', async () => {
        const res = await request(app)
            .post('/api/auth/refresh-token')
            .set('Cookie', 'refreshToken=completely.fake.token.string');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
//  LOGOUT TESTS
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /api/auth/logout', () => {

    let validCookie = '';

    beforeEach(async () => {
        await request(app).post('/api/auth/register').send(TEST_USER);
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: TEST_USER.email, password: TEST_USER.password });
        validCookie = loginRes.headers['set-cookie'].find(c => c.startsWith('refreshToken='));
    });

    it('✅ should log out and invalidate the refresh token', async () => {
        const logoutRes = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', validCookie);

        expect(logoutRes.status).toBe(200);
        expect(logoutRes.body.success).toBe(true);

        // The invalidated refresh token should no longer work
        const refreshRes = await request(app)
            .post('/api/auth/refresh-token')
            .set('Cookie', validCookie);

        expect(refreshRes.status).toBe(403);
    });

    it('✅ should handle logout gracefully even without a refresh token', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .send({});

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
//  FORGOT PASSWORD TESTS
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /api/auth/forgot-password', () => {

    beforeEach(async () => {
        await seedUser();
    });

    it('✅ should accept forgot-password for a registered email', async () => {
        const res = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: TEST_USER.email });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('❌ should reject forgot-password for a non-existent email', async () => {
        const res = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'nonexistent@test.com' });

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
//  HEALTH CHECK TEST
// ═══════════════════════════════════════════════════════════════════════════
describe('GET /health', () => {

    it('✅ should return health status', async () => {
        const res = await request(app).get('/health');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body).toHaveProperty('timestamp');
    });
});
