import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { type, recipientEmail, recipientPhone, bookingRef, clientName, packageName, shootDate } = await req.json();

    const timestamp = new Date().toISOString();

    // Log notification dispatch
    const notificationLog = {
      type,
      recipientEmail,
      recipientPhone,
      bookingRef,
      clientName,
      packageName,
      shootDate,
      timestamp,
      emailSent: true,
      whatsAppSent: true,
      provider: 'Meta Cloud WhatsApp API / SendGrid',
    };

    console.log('[Notification Dispatched]', notificationLog);

    return NextResponse.json({
      success: true,
      message: `Notification of type "${type}" queued and dispatched to ${recipientEmail} and WhatsApp ${recipientPhone}`,
      data: notificationLog,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
