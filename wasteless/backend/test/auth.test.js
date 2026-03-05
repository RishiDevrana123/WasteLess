import { describe, it, expect } from 'vitest';
import request from 'supertest';
import fc from 'fast-check';

// We will test against the actively running server
const API_URL = 'http://localhost:5000/api';

describe('WasteLess Auth API - Property-Based Chaos Testing', () => {
    it('Should survive 1000 randomized, extreme login attempts without throwing a 500 Internal Server error', async () => {

        // Fast-check automates permutations: feeding bizarre symbols, massive strings, nulls, emojis, etc.
        await fc.assert(
            fc.asyncProperty(
                fc.string(), // Random email payload
                fc.string(), // Random password payload
                async (randomEmail, randomPassword) => {
                    const response = await request(API_URL)
                        .post('/auth/login')
                        .send({ email: randomEmail, password: randomPassword });

                    // The server might reject the data (400, 401, 404), which is GOOD.
                    // But it should NEVER crash completely and return a 500 status code.
                    expect(response.status).not.toBe(500);

                    // If the input was completely weird, it should ideally trigger our validation
                    // and return something between 400 and 404.
                    expect(response.status).toBeGreaterThanOrEqual(400);
                    expect(response.status).toBeLessThan(500);
                }
            ),
            {
                numRuns: 1000, // Execute 1,000 completely unique test cases
                endOnFailure: true
            }
        );

    }, 120000); // Allow up to 2 minutes for all 1000 requests to fire
});
