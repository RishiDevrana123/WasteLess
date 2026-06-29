/**
 * WasteLess Systems API — Deep Permutation Testing
 *
 * Tests Profile, Notifications, Analytics, and Payment endpoints
 * with randomized extreme payloads to ensure no 500 errors.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import fc from 'fast-check';
import app from '../src/app.js';

let authToken = '';
let userId = '';

describe('WasteLess Profile, Notifications & Analytics API - Deep Permutation Testing', () => {

    // Setup Temporary User
    beforeAll(async () => {
        const uniqueEmail = `user_systems_tester_${Date.now()}@test.com`;
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'System Tester',
                email: uniqueEmail,
                password: 'password123',
                phone: '1234567890'
            });

        if (res.body?.data?.token) {
            authToken = res.body.data.token;
            userId = res.body.data.user.id;
        }
    });

    it('Should handle 100 extreme profile avatar/settings updates without crashing', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string({ maxLength: 5000 }), // Large random strings (avatar data)
                fc.string({ maxLength: 100 }), // Corrupted names
                fc.string({ maxLength: 50 }), // Corrupted phone numbers

                async (avatarData, name, phone) => {
                    const response = await request(app)
                        .put('/api/users/profile')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send({ avatar: avatarData, name, phone });

                    expect(response.status).not.toBe(500);
                }
            ),
            { numRuns: 100, endOnFailure: true }
        );
    }, 60000);

    it('Should process 50 randomized financial donation requests securely without crashing', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.oneof(fc.integer({ min: -9999999, max: 9999999 }), fc.double(), fc.constant(NaN), fc.constant(null)), // Edge case numbers

                async (amount) => {
                    const response = await request(app)
                        .post('/api/payments/create-donation')
                        .send({ amount }); // No auth needed for this endpoint, but edge numbers shouldn't crash it!

                    expect(response.status).not.toBe(500);
                }
            ),
            { numRuns: 50, endOnFailure: true }
        );
    }, 60000);

    it('Should handle 100 bizarre Analytics Dashboard parameter requests without crashing', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string(), // Random timeframe parameter
                fc.date(), // Random 'from' date
                fc.date(), // Random 'to' date

                async (timeframe, fromDate, toDate) => {
                    const response = await request(app)
                        .get(`/api/analytics?timeframe=${timeframe}&from=${fromDate}&to=${toDate}`)
                        .set('Authorization', `Bearer ${authToken}`);

                    expect(response.status).not.toBe(500);
                }
            ),
            { numRuns: 100, endOnFailure: true }
        );
    }, 60000);

});
