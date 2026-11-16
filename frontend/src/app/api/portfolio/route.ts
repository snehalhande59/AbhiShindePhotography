import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  const items = db.getPortfolio();
  return NextResponse.json({ success: true, data: items });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = db.addPortfolioItem(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
