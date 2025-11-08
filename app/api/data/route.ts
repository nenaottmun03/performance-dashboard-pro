import { NextRequest, NextResponse } from 'next/server';
import { generateNextPoints } from '@/lib/dataGenerator';
export const runtime = 'nodejs';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const since = Number(searchParams.get('since') || Date.now());
  const count = Number(searchParams.get('count') || 1);
  const points = generateNextPoints(since, count);
  return NextResponse.json({ points });
}
