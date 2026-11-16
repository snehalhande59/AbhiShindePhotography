import React from 'react';

export default function TermsAndConditionsPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="font-serif text-3xl md:text-5xl text-white font-bold mb-6">
          Terms & Conditions
        </h1>
        <p className="text-xs text-gold uppercase tracking-widest mb-8">
          Abhishinde Photography • Official Service Terms
        </p>

        <div className="space-y-6 text-sm text-muted-text leading-relaxed font-light">
          <section className="space-y-2">
            <h2 className="text-xl font-serif text-white">1. Booking & Date Blocking</h2>
            <p>
              A shoot date is considered confirmed and blocked only upon receipt of the mandatory <strong>30% advance payment</strong> along with a signed booking confirmation. Dates cannot be held verbally.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-serif text-white">2. Official Payment Schedule</h2>
            <p>
              As outlined in our official rate card:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>30% on the day of booking</strong> (non-refundable date retainer).</li>
              <li><strong>60% before the wedding day</strong> (due at call time on the first day of ceremonies).</li>
              <li><strong>Rest 10% once you get your complete work</strong> and submission of all pending work/photobooks.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-serif text-white">3. Deliverables & Timelines</h2>
            <p>
              All RAW photographs will be made accessible within one week (7 days) from the conclusion of the wedding shoot. Edited cinematic teasers and reels are delivered within 10 to 14 business days. Handcrafted 40-page photobooks are dispatched within 3 to 4 weeks after client photo selection. Final master data is delivered in an authentic 64 GB USB Pendrive.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-serif text-white">4. Travel & Outstation Accommodations</h2>
            <p>
              For destination weddings and shoots taking place outside Pune municipal limits, the client agrees to provide suitable hotel accommodation, meals, and flight/fuel transport for the photography crew.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-serif text-white">5. Force Majeure & Rescheduling</h2>
            <p>
              In the unlikely event of severe weather, natural acts, or unforeseen emergencies, the studio will make every professional effort to provide equivalent substitute lead artists from our elite network or reschedule according to calendar availability.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
