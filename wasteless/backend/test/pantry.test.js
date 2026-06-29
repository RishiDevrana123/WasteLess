/**
 * WasteLess Pantry (Inventory) API — Property-Based Chaos Testing
 *
 * Fires 1000 randomized extreme payloads at the inventory endpoint
 * to verify the server never crashes with a 500 Internal Server Error.
 *
 * Uses fast-check for automated permutation generation.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import fc from 'fast-check';
import app from '../src/app.js';
import * as groqService from '../src/services/groq.service.js';

let authToken = '';

describe('WasteLess Pantry API - Deep Permutation Testing', () => {

    // Setup: Register a temporary user to get a valid authentication token
    beforeEach(async () => {
        const uniqueEmail = `pantry_tester_${Date.now()}@test.com`;
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Pantry Tester',
                email: uniqueEmail,
                password: 'password123',
                phone: '1234567890'
            });

        if (res.body?.data?.token) {
            authToken = res.body.data.token;
        }
    });

    it('Should survive 100 extreme randomized pantry additions without crashing (No 500 Errors)', async () => {

        await fc.assert(
            fc.asyncProperty(
                fc.string({ maxLength: 1000 }), // Huge random strings, emojis, unicode
                fc.oneof(fc.integer(), fc.double(), fc.constant(NaN), fc.constant(null)), // Edge case numbers
                fc.string({ maxLength: 10 }), // Unit types
                fc.string(), // Random Categories
                fc.date(), // Completely random dates (thousands of years past/future)

                async (name, quantity, unit, category, expiryDate) => {
                    const response = await request(app)
                        .post('/api/inventory')
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
                numRuns: 100,
                endOnFailure: true
            }
        );

    }, 120000); // Allow maximum of 2 minutes
    
    it('Should trigger Heuristic Fallback when AI response is malformed or crashes (Sad Path)', async () => {
        // Mock the Groq service to throw a network error/crash
        const parseSpy = vi.spyOn(groqService, 'parseSmartEntry').mockRejectedValueOnce(new Error('Simulated Groq API Crash'));

        const badPrompt = "I bought 3 apples and some weird alien fruit.";
        const response = await request(app)
            .post('/api/inventory/smart-entry')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ prompt: badPrompt });

        // Endpoint should not crash (no 500)
        expect(response.status).toBe(201); // Or whatever success code is returned, typically 200/201
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBe(1);

        // Verify heuristic fallback data
        const fallbackItem = response.body.data[0];
        expect(fallbackItem.category).toBe('other');
        expect(fallbackItem.name).toContain('I bought 3 apples and some weird');

        parseSpy.mockRestore();
    });
});
