import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  const packages = db.getPackages();
  return NextResponse.json({ success: true, data: packages });
}
