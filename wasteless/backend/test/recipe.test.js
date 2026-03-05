import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import fc from 'fast-check';

const API_URL = 'http://localhost:5000/api';
let authToken = '';

describe('WasteLess Recipe API - Deep Permutation Testing', () => {

    // Setup Temporary User
    beforeAll(async () => {
        const uniqueEmail = `recipe_tester_${Date.now()}@test.com`;
        const res = await request(API_URL)
            .post('/auth/register')
            .send({
                name: 'Recipe Tester',
                email: uniqueEmail,
                password: 'password123',
                phone: '1234567890'
            });

        if (res.body?.data?.token) {
            authToken = res.body.data.token;
        }
    });

    it('Should process 1000 randomized AI recipe generation requests without crashing', async () => {

        // Fast-check will generate arrays with random strings, empty arrays, weird characters
        await fc.assert(
            fc.asyncProperty(
                fc.array(fc.string({ maxLength: 50 }), { maxLength: 20 }), // Array of 0-20 bizarre ingredients
                fc.array(fc.string({ maxLength: 20 }), { maxLength: 5 }),  // Preferences like vegan, weird strings
                fc.string({ maxLength: 20 }), // Cuisine style, languages, empty

                async (ingredients, preferences, cuisine) => {
                    // Send bizarre configurations directly to the AI Recipe generator route
                    const response = await request(API_URL)
                        .post('/recipes/generate')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send({
                            ingredients,
                            preferences,
                            cuisine
                        });

                    // Even if Groq API fails or invalid ingredients are passed,
                    // our error handling middleware should catch it cleanly, avoiding a full 500 server crash!
                    expect(response.status).not.toBe(500);
                }
            ),
            {
                numRuns: 1000,
                endOnFailure: true
            }
        );

    }, 240000); // 4 minutes timeout (AI/external requests take longer!)
});
