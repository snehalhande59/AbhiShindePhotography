import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="font-serif text-3xl md:text-5xl text-white font-bold mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-gold uppercase tracking-widest mb-8">
          Last Updated: November 2026 • Lens & Light Studio / Abhishinde Photography
        </p>

        <div className="space-y-6 text-sm text-muted-text leading-relaxed font-light">
          <section className="space-y-2">
            <h2 className="text-xl font-serif text-white">1. Introduction</h2>
            <p>
              Lens & Light Studio (operated by Abhishinde Photography) respects your privacy and is committed to protecting the personal data of our couples, families, models, and corporate clients. This policy explains how we collect, store, and utilize your information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-serif text-white">2. Data We Collect</h2>
            <p>
              We collect information provided directly by you when you book a shoot, submit an inquiry, or access private galleries. This includes names, email addresses, WhatsApp phone numbers, event dates, shoot venues, and photographic references.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-serif text-white">3. Image Rights & Private Galleries</h2>
            <p>
              Photographs uploaded to our Private Client Gallery are strictly password-protected and accessible solely via authorized PINs or encrypted access tokens. We do not license, sell, or disclose personal family wedding photographs to third parties without prior explicit authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-serif text-white">4. Secure Payment Processing</h2>
            <p>
              Online payments (including the 30% booking advance) are processed via secure PCI-DSS compliant payment gateways like Razorpay. Lens & Light Studio never stores your credit card numbers, CVVs, or banking credentials on our local servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-serif text-white">5. Contact Our Data Officer</h2>
            <p>
              If you have any questions or wish to request image removals from our public showcase, please write to{' '}
              <a href="mailto:privacy@lensandlightstudio.com" className="text-gold underline">
                privacy@lensandlightstudio.com
              </a>{' '}
              or contact Abhi Shinde directly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
