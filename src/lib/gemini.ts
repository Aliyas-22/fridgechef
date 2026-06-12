import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateRecipes(ingredients: string[], preferences?: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a world-class chef. Generate 3 creative and delicious recipes using these ingredients: ${ingredients.join(', ')}.
${preferences ? `Dietary preferences/notes: ${preferences}` : ''}

Respond ONLY with a valid JSON array (no markdown, no explanation) in this exact format:
[
  {
    "title": "Recipe Name",
    "description": "A mouth-watering 2-sentence description",
    "ingredients": ["ingredient 1 with amount", "ingredient 2 with amount"],
    "instructions": ["Step 1", "Step 2", "Step 3"],
    "cookTime": "30 minutes",
    "servings": "4 servings",
    "difficulty": "Easy",
    "cuisine": "Italian",
    "tips": ["Pro tip 1", "Pro tip 2"]
  }
]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}
