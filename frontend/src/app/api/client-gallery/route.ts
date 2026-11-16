import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { key } = await req.json();
    const album = db.getAlbumByAccess(key);
    if (!album) {
      return NextResponse.json({ success: false, error: 'Invalid PIN or Access Token' }, { status: 401 });
    }
    return NextResponse.json({ success: true, data: album });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
