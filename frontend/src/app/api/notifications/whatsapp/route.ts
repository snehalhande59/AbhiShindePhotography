import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { 
      enquiryId, 
      customerName, 
      mobileNumber, 
      whatsappNumber, 
      email, 
      photographyCategory,
      preferredPhotographer,
      selectedPackage, 
      packagePrice, 
      preferredShootDate, 
      preferredShootTime, 
      eventDate,
      shootLocation,
      eventType,
      guestCount,
      shootDuration,
      additionalRequirements,
      referenceImages,
      referenceVideo,
      whatsappConsent
    } = await req.json();

    const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER || '+917822053169';
    const now = new Date();
    const submittedDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const submittedTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const formatDDMMYYYY = (iso?: string) => {
      if (!iso || !iso.includes('-')) return iso || 'Not Provided';
      const [y, m, d] = iso.split('-');
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    };

    const cleanWaNumber = (whatsappNumber || mobileNumber || '').replace(/[^0-9]/g, '');
    const customerWaLink = cleanWaNumber.length >= 10 
      ? `https://wa.me/${cleanWaNumber.startsWith('91') ? cleanWaNumber : '91' + cleanWaNumber}` 
      : 'Not Provided';

    const refImgs = Array.isArray(referenceImages) && referenceImages.length > 0
      ? referenceImages.join('\n')
      : 'Not Provided';

    // Format Exact Section J Specification Message
    const adminMessageText = 
`📸 NEW PHOTOGRAPHY ENQUIRY

ABHISHINDE PHOTOGRAPHY

━━━━━━━━━━━━━━━━

ENQUIRY DETAILS

Enquiry ID: ${enquiryId || 'AS-ENQ-0001'}
Submitted Date: ${submittedDate}
Submitted Time: ${submittedTime}

━━━━━━━━━━━━━━━━

CLIENT INFORMATION

Client Name: ${customerName || 'Not Provided'}
Mobile Number: ${mobileNumber || 'Not Provided'}
WhatsApp Number: ${whatsappNumber || mobileNumber || 'Not Provided'}
Email Address: ${email || 'Not Provided'}

━━━━━━━━━━━━━━━━

PHOTOGRAPHY REQUIREMENTS

Photography Category: ${photographyCategory || 'Wedding Photography'}
Preferred Photographer: ${preferredPhotographer || 'Any Available Photographer'}
Selected Package: ${selectedPackage || 'WEDDING PACKAGE - BOTH SIDE (₹1,55,000)'}
Package Price: ₹${packagePrice ? Number(packagePrice).toLocaleString('en-IN') : '1,55,000'}

Preferred Shoot Date: ${formatDDMMYYYY(preferredShootDate)}
Preferred Shoot Time: ${preferredShootTime || 'Full Day'}
Event Date: ${formatDDMMYYYY(eventDate || preferredShootDate)}
Shoot Location: ${shootLocation || 'Not Provided'}
Event Type: ${eventType || 'Not Provided'}
Number of Guests: ${guestCount ?? 'Not Provided'}
Shoot Duration: ${shootDuration || 'Not Provided'}

━━━━━━━━━━━━━━━━

ADDITIONAL REQUIREMENTS

${additionalRequirements || 'Not Provided'}

Reference Images:
${refImgs}

Reference Video:
${referenceVideo || 'Not Provided'}

WhatsApp Consent:
${whatsappConsent ? 'Yes (Opted In for WhatsApp Updates)' : 'No'}

━━━━━━━━━━━━━━━━

ADMIN ACTION

Open Admin Dashboard:
http://localhost:3000/admin-dashboard

Contact Customer:
${customerWaLink}

Status: NEW ENQUIRY

ABHISHINDE PHOTOGRAPHY
Admin: Abhi Shinde`;

    const encodedText = encodeURIComponent(adminMessageText);
    const manualWhatsAppUrl = `https://wa.me/917822053169?text=${encodedText}`;

    // Cloud API Integration
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    let apiDeliverySuccess = false;
    let providerResponse = null;

    if (token && phoneId) {
      try {
        const cleanRecipient = adminNumber.replace(/[^0-9]/g, '');
        const metaRes = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: cleanRecipient,
            type: 'text',
            text: { body: adminMessageText },
          }),
        });

        providerResponse = await metaRes.json();
        apiDeliverySuccess = metaRes.ok;
      } catch (e: any) {
        console.error('[WhatsApp Cloud API Network Error]', e.message);
      }
    }

    return NextResponse.json({
      success: true,
      apiDeliverySuccess,
      providerResponse,
      adminNumber,
      manualWhatsAppUrl,
      customerWhatsAppUrl: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`,
      formattedMessage: adminMessageText,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
