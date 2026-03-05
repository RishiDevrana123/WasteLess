import axios from 'axios';

export const getGroqRecipeSuggestions = async (inventory, prompt) => {
    // We default to the provided key if not in env
    const apiKey = process.env.GROQ_API_KEY;
    const ingredientsList = inventory.map(i => i.name).join(', ');

    // We give a few generic unsplash food images to choose randomly since Groq cannot browse
    const genericImages = [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
        "https://images.unsplash.com/photo-1490645935967-10de6ba8219d?w=500&q=80",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
        "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=500&q=80",
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80"
    ];

    const systemPrompt = `You are a world-class Indian AI chef powering the WasteLess platform. 
Your primary goal is to suggest incredible, realistic, and highly culinary recipes catering specifically to an Indian audience, based on a user's prompt and their available pantry ingredients.
Assume the user prefers Indian cuisines, flavor profiles, and cooking methods unless they specify otherwise.
Use common Indian nomenclature for ingredients where appropriate (e.g., 'paneer' instead of 'cottage cheese', 'besan' instead of 'gram flour', 'jeera', 'dhaniya').
If they ask for something specific (e.g., "vegan", "no onions", "using tomatoes"), YOU MUST RESPECT THOSE FILTERS STRICTLY.

Here is the user's current pantry inventory: [${ingredientsList || 'None provided'}].

IMPORTANT INSTRUCTIONS:
- You MUST respond with ONLY a valid JSON object. No markdown, no pre-text, no post-text. 
- The JSON object must contain a 'recipes' array with 1 to 4 recipe objects.
- Each recipe must match this EXACT schema:
{
    "id": (number) random unique 5 digit integer,
    "name": (string) creative recipe title,
    "description": (string) short appetizing 2-sentence description,
    "cookingTime": (number) in minutes,
    "difficulty": (string) "Easy", "Medium", or "Hard",
    "image": (string) pick one random URL strictly from this list precisely: ${JSON.stringify(genericImages)},
    "servings": (number),
    "matchPercentage": (number) 0-100 indicating how many of the needed ingredients they already have in the pantry,
    "ingredients": [(array of strings) list of all ingredients needed with amounts],
    "availableIngredients": [(array of strings) ONLY list the ingredient NAMES from this recipe that are also present in the user's pantry inventory],
    "missingIngredients": [(array of strings) ONLY list the ingredient NAMES from this recipe that the user needs to buy (not in their pantry)],
    "instructions": [(array of strings) step by step cooking instructions]
}`;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt || "Suggest some delicious recipes I can make to reduce food waste." }
            ],
            response_format: { type: "json_object" },
            temperature: 0.5
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const data = JSON.parse(response.data.choices[0].message.content);
        return data.recipes || [];
    } catch (error) {
        console.error("Groq API JSON Error:", error.response?.data || error.message);
        throw new Error("Failed to generate recipes from AI. " + (error.response?.data?.error?.message || ""));
    }
};

export const parseSmartEntry = async (prompt) => {
    const apiKey = process.env.GROQ_API_KEY;

    const systemPrompt = `You are a highly intelligent Indian Pantry Manager AI.
The user will provide a raw text describing their recent grocery haul or items they want to add to their pantry.
Your job is to parse this natural language into a structured JSON array of inventory items.

Calculate a realistic 'expiryDate' (in ISO 8601 format like "2024-05-24T00:00:00.000Z") for each item based on average shelf life in an Indian household (e.g. paneer = 5 days, coriander = 4 days, milk = 3 days, potatoes = 14 days, dal = 180 days). Calculate this STRICTLY AS A FUTURE DATE relative to TODAY'S DATE which is ${new Date().toISOString()}.

IMPORTANT INSTRUCTIONS:
- You MUST respond with ONLY a valid JSON object.
- The JSON object must contain an 'items' array.
- Each item must EXACTLY match this schema:
{
    "name": (string) The name of the item (e.g. "Coriander", "Paneer", "Full Cream Milk"),
    "category": (string) MUST BE exactly one of: "vegetables", "fruits", "dairy", "meat", "grains", "spices", "beverages", "snacks", "other",
    "quantity": {
        "value": (number) amount,
        "unit": (string) MUST BE exactly one of: "kg", "g", "l", "ml", "pieces", "packets"
    },
    "expiryDate": (string) ISO date string predicting expiration.
}
Do not include any other markdown or text. Just the JSON object.`;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.2
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const data = JSON.parse(response.data.choices[0].message.content);
        return data.items || [];
    } catch (error) {
        console.error("Groq API JSON Error for Smart Entry:", error.response?.data || error.message);
        throw new Error("Failed to parse grocery items from AI. " + (error.response?.data?.error?.message || ""));
    }
};

export const generateStorageAdvice = async (itemName) => {
    const apiKey = process.env.GROQ_API_KEY;

    const systemPrompt = `You are a culinary expert specialized in traditional Indian household preservation methods.
The user will ask how to store a specific ingredient. 
Give them exactly 2 to 3 short, practical sentences explaining the best way to store this item to maximize its shelf-life (e.g., specifying if it should be refrigerated, kept in a dark dry place, wrapped in paper, etc.). Use an engaging and warm tone.
Respond with ONLY the plain text advice, no markdown, formatting, or extra text.`;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `How should I store ${itemName}?` }
            ],
            temperature: 0.5
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error("Groq API Error for Storage Advice:", error.response?.data || error.message);
        throw new Error("Failed to get storage advice from AI.");
    }
};
