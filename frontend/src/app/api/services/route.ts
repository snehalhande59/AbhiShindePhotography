import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  const services = db.getServices();
  return NextResponse.json({ success: true, data: services });
}
