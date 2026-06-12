import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const recipe = await req.json();
    await connectDB();

    const saved = await Recipe.create({
      userId: (session.user as any).id,
      ...recipe,
    });

    return NextResponse.json({ message: 'Recipe saved!', id: saved._id });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 });
  }
}
