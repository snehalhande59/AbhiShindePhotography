'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Calendar, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';
import { db } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { PackageInclusion, PackageDeliverable } from '@/types';
import EnquiryModal from '@/components/EnquiryModal';

export default function PackagesPage() {
  const packages = db.getPackages().filter((p) => p.isActive);
  const signaturePkg = packages.find((p) => p.isSignature) || packages[0];
  const otherPackages = packages.filter((p) => p.id !== signaturePkg.id);

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedEnquiryPkg, setSelectedEnquiryPkg] = useState<string>(signaturePkg.title);

  const openEnquiry = (pkgTitle: string) => {
    setSelectedEnquiryPkg(pkgTitle);
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Investment</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-bold uppercase mt-2 mb-4">
            Wedding Packages & Pricing
          </h1>
          <p className="text-sm md:text-base text-muted-text font-light leading-relaxed">
            All-inclusive multi-camera coverage, aerial cinema drones, live venue LED walls, handcrafted photobooks, and prompt 7-day RAW delivery.
          </p>
        </div>

        {/* ========================================================== */}
        {/* HERO SIGNATURE PACKAGE (MATCHING FLYER: 1,55,000 BOTH SIDE) */}
        {/* ========================================================== */}
        <div className="mb-20">
          <div className="relative max-w-5xl mx-auto bg-gradient-to-br from-card-bg via-secondary-bg to-card-bg border-2 border-gold rounded-3xl p-8 md:p-14 shadow-[0_0_50px_rgba(197,164,109,0.2)]">
            {/* Top Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/80 pb-6 mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-1">
                  OFFICIAL FLYER & RATE CARD • ABHISHINDE PHOTOGRAPHY
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-white font-bold">
                  WEDDING PACKAGE – BOTH SIDE
                </h2>
                <span className="text-xs text-muted-text">Instagram: @Abhishinde_photography</span>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-xs uppercase tracking-widest text-muted-text block">Complete Investment</span>
                <div className="font-serif text-4xl md:text-5xl text-gold font-bold">{formatINR(signaturePkg.price)}</div>
              </div>
            </div>

            {/* Inclusions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
              {/* Engagement & Mehandi Column */}
              <div className="space-y-6 bg-black/40 p-6 rounded-2xl border border-border">
                <div className="border-b border-border/60 pb-3">
                  <h3 className="font-serif text-2xl text-white font-bold">ENGAGEMENT</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-text">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Traditional photographer</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Candid photographer</li>
                  </ul>
                </div>

                <div className="border-b border-border/60 pb-3">
                  <h3 className="font-serif text-2xl text-white font-bold">MEHANDI (Bride)</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-text">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Traditional photographer</li>
                  </ul>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
                    Works To Be Given / Deliverables:
                  </span>
                  <ul className="space-y-2 text-xs text-muted-text">
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span>All the raw pictures will be provided within one week from the wedding shoot.</span></li>
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span>Cinematic video edit</span></li>
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span>Couple reels edit</span></li>
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span>Photos edits for social media</span></li>
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span className="text-white font-semibold">8x12 LED Screen setup with live camera feed</span></li>
                  </ul>
                </div>
              </div>

              {/* Haldi & Wedding Column */}
              <div className="space-y-6 bg-black/40 p-6 rounded-2xl border border-border">
                <div className="border-b border-border/60 pb-3">
                  <h3 className="font-serif text-2xl text-white font-bold">HALDI & WEDDING</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-text">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Traditional photographer</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Traditional videographer</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Candid photographer</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Cinematic master videographer</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold" /> Drone aerial operator</li>
                  </ul>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
                    Works To Be Given / Deliverables:
                  </span>
                  <ul className="space-y-2 text-xs text-muted-text">
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span>All the raw pictures will be provided within one week from the wedding shoot.</span></li>
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span>Cinematic video edit + teaser film</span></li>
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span>Couple reels edit</span></li>
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span>Traditional video edit</span></li>
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span>Wedding photos edits for social media</span></li>
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span className="text-white font-semibold">Wedding 2 Photobook Album (40 Pages each)</span></li>
                    <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" /> <span className="text-gold font-semibold">The final data will be provided in a 64 GB Pendrive</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Events Strip */}
            <div className="p-4 rounded-xl bg-card-bg border border-border mb-8">
              <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">
                Events Covered:
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-white">
                <span className="px-3 py-1 rounded-full bg-secondary-bg border border-border">ENGAGEMENT</span>
                <span className="px-3 py-1 rounded-full bg-secondary-bg border border-border">MEHANDI</span>
                <span className="px-3 py-1 rounded-full bg-secondary-bg border border-border">MIRAVNUK</span>
                <span className="px-3 py-1 rounded-full bg-secondary-bg border border-border">HALDI</span>
                <span className="px-3 py-1 rounded-full bg-secondary-bg border border-border">VAIDIK WEDDING</span>
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="p-6 rounded-2xl bg-black/80 border border-gold/30 mb-8">
              <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-3">
                Please Note The Below Points Of Payment Method:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-text">
                <div className="p-3 rounded-xl bg-card-bg border border-border">
                  <span className="text-gold font-bold text-sm block">30% Advance</span>
                  You'll need to pay 30% on the day of booking ({formatINR(Math.round(155000 * 0.3))}).
                </div>
                <div className="p-3 rounded-xl bg-card-bg border border-border">
                  <span className="text-gold font-bold text-sm block">60% Prior to Wedding</span>
                  Pay 60% before the wedding day ({formatINR(Math.round(155000 * 0.6))}).
                </div>
                <div className="p-3 rounded-xl bg-card-bg border border-border">
                  <span className="text-gold font-bold text-sm block">Rest 10% On Delivery</span>
                  Once you get your complete work and submission of all pending work ({formatINR(Math.round(155000 * 0.1))}).
                </div>
              </div>
            </div>

            {/* BOOK NOW & ENQUIRY CTAS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/booking?packageId=${signaturePkg.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(197,164,109,0.5)]"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Online (Razorpay)</span>
              </Link>
              <button
                type="button"
                onClick={() => openEnquiry(signaturePkg.title)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-black/80 hover:bg-zinc-900 border border-gold/60 text-gold hover:text-white font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full transition-all"
              >
                <MessageCircle className="w-4 h-4 text-gold" />
                <span>Enquire via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* OTHER PACKAGES GRID */}
        <div>
          <h3 className="text-2xl font-serif text-white mb-8 text-center">Other Curated Packages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {otherPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-card-bg border border-border rounded-3xl p-8 flex flex-col justify-between hover:border-gold/60 transition-all duration-300 shadow-xl"
              >
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gold font-bold px-3 py-1 rounded-full bg-gold/10 border border-gold/30 inline-block mb-3">
                    {pkg.badge || 'Package'}
                  </span>
                  <h4 className="font-serif text-2xl text-white font-bold">{pkg.title}</h4>
                  <p className="text-xs text-muted-text mt-1 mb-4">{pkg.subtitle}</p>

                  <div className="font-serif text-3xl text-gold font-bold mb-4">{formatINR(pkg.price)}</div>

                  <p className="text-xs text-muted-text mb-4">
                    <strong>Coverage:</strong> {pkg.coverage}
                  </p>

                  <div className="space-y-2 border-t border-border pt-4 mb-6">
                    <span className="text-[11px] uppercase tracking-wider text-white font-medium block">
                      Inclusions & Deliverables:
                    </span>
                    <ul className="space-y-1.5 text-xs text-muted-text">
                      {Array.isArray(pkg.deliverables) &&
                        pkg.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                            <span>{typeof item === 'string' ? item : item.title}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <Link
                    href={`/booking?packageId=${pkg.id}`}
                    className="w-full text-center block bg-secondary-bg hover:bg-gold hover:text-black border border-border text-white text-xs uppercase tracking-widest font-bold py-3 rounded-xl transition-all"
                  >
                    Reserve Online
                  </Link>
                  <button
                    type="button"
                    onClick={() => openEnquiry(pkg.title)}
                    className="w-full text-center flex items-center justify-center gap-1.5 bg-black/60 hover:bg-zinc-900 border border-border hover:border-gold/60 text-gold text-xs uppercase tracking-widest font-bold py-2.5 rounded-xl transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Quick Enquiry</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ubiquitous Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        defaultPackage={selectedEnquiryPkg}
      />
    </div>
  );
}
