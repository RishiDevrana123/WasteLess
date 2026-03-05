import axios from 'axios';

// Cache for recipe details to save API points (simple in-memory cache)
const recipeCache = new Map();

/**
 * Get recipe suggestions based on available ingredients using Spoonacular API
 * This approach is deterministic and uses a dedicated food database.
 */
export const getRecipeSuggestions = async (inventory, limit = 5) => {
    const ingredients = inventory.map(item => item.name).join(',');

    // Check for API Key
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
        const error = new Error('Please configure SPOONACULAR_API_KEY in backend .env to generate real recipes.');
        error.statusCode = 503;
        throw error;
    }

    try {
        // 1. Find recipes by ingredients
        // Endpoint: https://spoonacular.com/food-api/docs#Search-Recipes-by-Ingredients
        const findResponse = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
            params: {
                apiKey,
                ingredients,
                number: limit,
                ranking: 1, // Minimize missing ingredients
                ignorePantry: true
            }
        });

        const recipes = findResponse.data;
        if (!recipes.length) return [];

        // 2. Get detailed information (instructions, cooking time) for the found recipes
        // We use Get Recipe Information Bulk to save requests
        const recipeIds = recipes.map(r => r.id).join(',');

        const infoResponse = await axios.get('https://api.spoonacular.com/recipes/informationBulk', {
            params: {
                apiKey,
                ids: recipeIds,
                includeNutrition: false
            }
        });

        const detailedRecipes = infoResponse.data;

        // 3. Merge and format data for the frontend
        return detailedRecipes.map(detail => {
            // Find the original "findByIngredients" result to get used/missed ingredient counts if needed
            // (Spoonacular detail response also has extendedIngredients)
            const summaryObj = recipes.find(r => r.id === detail.id);

            // Format instructions from array of objects to array of strings
            const instructions = detail.analyzedInstructions?.[0]?.steps?.map(s => s.step)
                || (detail.instructions ? [detail.instructions] : ['No instructions available.']);

            // Calculate a pseudo-match percentage based on used ingredients vs total ingredients
            // strict math: used / (used + missed)
            const usedCount = summaryObj?.usedIngredientCount || 0;
            const missedCount = summaryObj?.missedIngredientCount || 0;
            const totalCount = usedCount + missedCount;
            const matchPercentage = totalCount > 0 ? Math.round((usedCount / totalCount) * 100) : 0;

            // Determine difficulty approximately
            let difficulty = 'Medium';
            if (detail.readyInMinutes <= 30) difficulty = 'Easy';
            if (detail.readyInMinutes > 60) difficulty = 'Hard';

            return {
                id: detail.id,
                name: detail.title,
                description: detail.summary ? detail.summary.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...' : 'No description available',
                cookingTime: detail.readyInMinutes,
                difficulty,
                image: detail.image,
                servings: detail.servings,
                matchPercentage,
                ingredients: detail.extendedIngredients.map(i => i.original),
                availableIngredients: summaryObj?.usedIngredients?.map(i => i.name) || [],
                missingIngredients: summaryObj?.missedIngredients?.map(i => i.name) || [],
                instructions,
                sourceUrl: detail.sourceUrl
            };
        });

    } catch (error) {
        console.error('Spoonacular API Error:', error.response?.data || error.message);
        // If query fails (e.g. quota exceeded), throw appropriate error
        if (error.response?.status === 402) {
            throw new Error('Spoonacular API quota exceeded. Please try again tomorrow or update key.');
        }
        throw new Error('Failed to fetch recipes from Spoonacular');
    }
};
