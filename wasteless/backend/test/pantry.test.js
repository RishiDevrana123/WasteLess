import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import fc from 'fast-check';

const API_URL = 'http://localhost:5000/api';
let authToken = '';

describe('WasteLess Pantry API - Deep Permutation Testing', () => {

    // Setup: Create a temporary user to get a valid authentication token
    beforeAll(async () => {
        const uniqueEmail = `pantry_tester_${Date.now()}@test.com`;
        const res = await request(API_URL)
            .post('/auth/register')
            .send({
                name: 'Pantry Tester',
                email: uniqueEmail,
                password: 'password123',
                phone: '1234567890'
            });

        // Save the valid token to inject into our 1000 pantry requests
        if (res.body?.data?.token) {
            authToken = res.body.data.token;
        }
    });

    it('Should survive 1000 extreme randomized pantry additions without crashing (No 500 Errors)', async () => {

        await fc.assert(
            fc.asyncProperty(
                fc.string({ maxLength: 1000 }), // Huge random strings, emojis, unicode
                fc.oneof(fc.integer(), fc.double(), fc.constant(NaN), fc.constant(null)), // Edge case numbers
                fc.string({ maxLength: 10 }), // Unit types
                fc.string(), // Random Categories
                fc.date(), // Completely random dates (thousands of years past/future)

                async (name, quantity, unit, category, expiryDate) => {
                    const response = await request(API_URL)
                        .post('/inventory')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send({
                            name,
                            quantity,
                            unit,
                            category,
                            expiryDate: (expiryDate && !isNaN(expiryDate)) ? expiryDate.toISOString() : null
                        });

                    // Our backend validators should catch the bad data, returning 400 Bad Request
                    // but the backend should *never* explode completely (500 Internal Server Error)
                    if (response.status === 500) {
                        console.error("SERVER CRASH PAYLOAD:", response.body);
                    }
                    expect(response.status).not.toBe(500);
                }
            ),
            {
                numRuns: 1000,
                endOnFailure: true
            }
        );

    }, 120000); // Allow maximum of 2 minutes to pound the server with 1000 requests
});
