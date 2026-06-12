import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const recipes = await Recipe.find({ userId: (session.user as any).id }).sort({ savedAt: -1 });
    return NextResponse.json({ recipes });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}
