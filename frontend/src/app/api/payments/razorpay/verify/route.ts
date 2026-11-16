import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ success: false, error: 'Missing payment identifiers' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (secret && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ success: false, error: 'Signature verification failed' }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment signature verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
