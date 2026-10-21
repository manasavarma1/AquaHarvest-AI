import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithGemini } from '@/lib/gemini';
import { CalculationInputs, CalculationResults } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputs, results, apiKey, customQuestion } = body as {
      inputs: CalculationInputs;
      results: CalculationResults;
      apiKey?: string;
      customQuestion?: string;
    };

    if (!inputs || !results) {
      return NextResponse.json({ error: 'Missing inputs or results' }, { status: 400 });
    }

    const aiResult = await analyzeWithGemini(inputs, results, apiKey, customQuestion);
    return NextResponse.json(aiResult);
  } catch (err: any) {
    console.error('API Error in /api/ai-analyze:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
