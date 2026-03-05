# WasteLess Automated Testing Strategy

## 1. Overview
This document outlines the testing strategy for the WasteLess application. Our goal is to run a large number of permutations (up to 1,000+ data combinations) to find edge-case bugs without manually clicking through the website.

## 2. Tools Used
- **Vitest**: The core test runner. It allows us to execute tests extremely fast.
- **Supertest**: For testing the backend API endpoints (simulating frontend requests).
- **React Testing Library**: For simulating user clicks and inputs on the Frontend.
- **Fast-Check** (Property-Based Testing): A library that automatically generates hundreds of random permutations (strings, numbers, edge cases) to forcefully find crashes.

## 3. Permutations & Combinations (The 1000+ Cases)

We will implement "Property-Based Testing" and "Data-Driven Testing". Instead of writing 1,000 manual tests, we write a template and the testing framework generates the permutations.

### A. Authentication & User Combinations
- **Email inputs:** Valid emails, missing '@', extremely long strings, SQL injection attempts (`' OR 1=1;`), emojis, empty strings.
- **Password inputs:** Too short, extremely long, symbols, numbers only, empty strings.
- **Action:** Test Login and Signup endpoints against 100 random combinations of the above.

### B. Pantry Inventory Combinations
- **Item Names:** Special characters, huge strings, numbers, empty.
- **Dates:** Dates in the past, highly futuristic dates, invalid formats, leap year dates.
- **Quantities:** Negative numbers, zero, extremely large numbers (e.g., 999999999).
- **Categories:** Missing categories, unmapped categories.
- **Action:** Test the Add Pantry Item system against 250 combinations.

### C. Recipe Generation Combinations
- **Ingredient arrays:** Empty array, 100+ ingredients, weird ingredient strings ("asdf123", "🍎"), combinations of non-food items.
- **Preferences:** E.g., vegetarian + contains meat (contradictory inputs).

## 4. Execution Plan
1. **Setup:** Install testing libraries in both `frontend` and `backend`.
2. **Write Suites:** Create parameter-driven test arrays.
3. **Execution:** Run the test suites via terminal commanded `npm run test` to expose hidden bugs.
