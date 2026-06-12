import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateRecipes } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { ingredients, preferences } = await req.json();
    if (!ingredients || ingredients.length === 0)
      return NextResponse.json({ error: 'No ingredients provided' }, { status: 400 });

    console.log('🔑 Gemini key exists:', !!process.env.GEMINI_API_KEY);
    console.log('🥕 Ingredients:', ingredients);
    
    const recipes = await generateRecipes(ingredients, preferences);
    return NextResponse.json({ recipes });
  } catch (err: any) {
    console.error('❌ Generate error:', err.message);
    console.error('❌ Full error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate recipes' }, { status: 500 });
  }
}
