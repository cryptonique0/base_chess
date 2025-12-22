import { NextRequest, NextResponse } from 'next/server';
import { getGeminiMove } from '@/app/lib/genkitChessAI';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameState, difficulty } = body;

    if (!gameState) {
      return NextResponse.json(
        { error: 'Game state is required' },
        { status: 400 }
      );
    }

    // Get the best move from Gemini
    const result = await getGeminiMove(gameState, difficulty || 'medium');

    return NextResponse.json({
      move: {
        from: result.from,
        to: result.to,
      },
      reasoning: result.reasoning,
    });
  } catch (error) {
    console.error('Error in AI move API:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI move', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
