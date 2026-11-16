'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight, Calendar, Sparkles, MessageCircle } from 'lucide-react';
import { db } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import EnquiryModal from '@/components/EnquiryModal';

export default function ServicesPage() {
  const services = db.getServices().filter((s) => s.isActive);

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{ name: string; category: string }>({
    name: 'Wedding Photography',
    category: 'Wedding',
  });

  const openEnquiry = (name: string, category: string) => {
    setSelectedService({ name, category });
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">Artisanal Offerings</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-bold uppercase mt-2 mb-4">
            Photography & Cinema Services
          </h1>
          <p className="text-sm md:text-base text-muted-text font-light leading-relaxed">
            Tailored visual production with world-class optics, dedicated direction, and high-speed delivery for weddings, fashion, and private galas.
          </p>
        </div>

        {/* SERVICES LISTING */}
        <div className="space-y-12">
          {services.map((svc, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <div
                key={svc.id}
                className="bg-card-bg border border-border rounded-3xl overflow-hidden p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xl hover:border-gold/50 transition-all duration-300"
              >
                {/* Image */}
                <div className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-border ${isReversed ? 'lg:order-2' : ''}`}>
                  <Image src={svc.coverImage} alt={svc.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="text-xs uppercase tracking-widest text-gold bg-black/80 px-3 py-1 rounded-full border border-gold/40">
                      {svc.category}
                    </span>
                    <span className="text-xs text-white font-mono bg-black/80 px-3 py-1 rounded-full border border-border">
                      {svc.duration}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className={`space-y-5 ${isReversed ? 'lg:order-1' : ''}`}>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gold font-bold">
                      Signature Discipline
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-white font-bold mt-1">
                      {svc.name}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-text leading-relaxed font-light">
                    {svc.fullDescription}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-white font-medium block">
                      Inclusions & Deliverables:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-text">
                      {svc.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Booking CTA */}
                  <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-muted-text block">Starting Investment</span>
                      <div className="font-serif text-2xl text-gold font-bold">{formatINR(svc.startingPrice)}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => openEnquiry(svc.name, svc.category)}
                        className="inline-flex items-center justify-center gap-1.5 bg-black/70 hover:bg-zinc-900 border border-gold/50 text-gold hover:text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Quick Enquiry</span>
                      </button>
                      <Link
                        href={`/booking?serviceId=${svc.id}`}
                        className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-black font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-[0_0_15px_rgba(197,164,109,0.3)]"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book Online</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ubiquitous Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        defaultService={selectedService.name}
        defaultCategory={selectedService.category}
      />
    </div>
  );
}
