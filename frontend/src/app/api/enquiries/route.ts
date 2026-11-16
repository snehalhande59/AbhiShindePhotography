import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  const enquiries = db.getEnquiries();
  return NextResponse.json({ success: true, data: enquiries });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Field Validations
    if (!body.customerName || !body.mobileNumber || !body.email || !body.preferredShootDate || !body.shootLocation) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing: Name, Mobile, Email, Shoot Date, Location' },
        { status: 400 }
      );
    }

    // Save into actual Store / Database
    const created = db.addEnquiry({
      customerName: body.customerName,
      countryCode: body.countryCode || '+91',
      mobileNumber: body.mobileNumber,
      whatsappNumber: body.whatsappNumber || body.mobileNumber,
      email: body.email,
      photographyCategory: body.photographyCategory || 'Wedding Photography',
      selectedService: body.selectedService || 'Wedding Photography',
      preferredPhotographerId: body.preferredPhotographerId,
      preferredPhotographerName: body.preferredPhotographerName,
      preferredPhotographerPhoto: body.preferredPhotographerPhoto,
      selectedPackage: body.selectedPackage || 'WEDDING PACKAGE - BOTH SIDE (₹1,55,000)',
      packagePriceSnapshot: Number(body.packagePriceSnapshot) || 155000,
      preferredShootDate: body.preferredShootDate,
      preferredShootTime: body.preferredShootTime || 'Flexible',
      shootLocation: body.shootLocation,
      shootCity: body.shootCity,
      shootArea: body.shootArea,
      venueName: body.venueName,
      eventDate: body.eventDate || body.preferredShootDate,
      eventType: body.eventType || 'Celebration',
      guestCount: body.guestCount,
      shootDuration: body.shootDuration || 'Full Day',
      specialInstructions: body.specialInstructions,
      additionalRequirements: body.additionalRequirements || '',
      referenceImages: body.referenceImages || [],
      referenceVideo: body.referenceVideo,
      whatsappConsent: Boolean(body.whatsappConsent),
      internalNotes: body.internalNotes || '',
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, internalNotes } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 });
    }

    const updated = db.updateEnquiryStatus(id, status, internalNotes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
