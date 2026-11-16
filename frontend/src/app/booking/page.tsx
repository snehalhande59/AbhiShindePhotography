'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingWizard from '@/components/BookingWizard';
import { Sparkles } from 'lucide-react';

function BookingContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId') || undefined;
  const packageId = searchParams.get('packageId') || undefined;

  return (
    <div className="pt-28 pb-24 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Step Studio Concierge</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-bold uppercase mt-2 mb-4">
            Book Your Shoot
          </h1>
          <p className="text-sm text-muted-text font-light leading-relaxed">
            Reserve your wedding dates with Abhi Shinde Photography. Real-time availability check, transparent payment schedules, and verified Razorpay advance security.
          </p>
        </div>

        <BookingWizard initialServiceId={serviceId} initialPackageId={packageId} />
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-gold">Loading booking studio...</div>}>
      <BookingContent />
    </Suspense>
  );
}
