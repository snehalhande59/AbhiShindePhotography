import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  const bookings = db.getBookings();
  return NextResponse.json({ success: true, data: bookings });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if this is a conversion from enquiry
    if (body.action === 'CONVERT_ENQUIRY' && body.enquiryId) {
      const converted = db.convertEnquiryToBooking(body.enquiryId, {
        advanceAmount: body.advanceAmount,
        assignedPhotographer: body.assignedPhotographer,
        adminNotes: body.adminNotes,
      });

      if (!converted) {
        return NextResponse.json({ success: false, error: 'Enquiry not found for conversion' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: converted }, { status: 201 });
    }

    const newBooking = db.createBooking(body);
    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, updates, auditNote, updatedBy } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Booking id is required' }, { status: 400 });
    }

    const updated = db.updateBooking(id, updates, auditNote, updatedBy || 'Abhi Shinde');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
