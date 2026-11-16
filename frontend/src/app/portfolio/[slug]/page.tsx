'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, User, Play, ArrowLeft, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { db } from '@/lib/store';
import Lightbox from '@/components/Lightbox';
import VideoModal from '@/components/VideoModal';
import EnquiryModal from '@/components/EnquiryModal';

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const item = db.getPortfolioBySlug(params.slug);
  const allPortfolio = db.getPortfolio();

  if (!item) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif text-white">Project Not Found</h2>
        <Link href="/portfolio" className="mt-4 inline-block text-gold underline">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  // Related projects
  const related = allPortfolio.filter((p) => p.id !== item.id && p.category === item.category).slice(0, 2);

  // Lightbox & Video State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const [videoOpen, setVideoOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        {/* Back Link */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-text hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>

        {/* HEADER */}
        <div className="max-w-4xl mb-12">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            {item.category} Visual Saga
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-bold mt-2 mb-6">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-text border-y border-border py-4">
            <span className="flex items-center gap-1.5 text-white">
              <User className="w-4 h-4 text-gold" />
              <span><strong>Couple/Client:</strong> {item.client}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold" />
              <span><strong>Location:</strong> {item.location}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold" />
              <span><strong>Shoot Date:</strong> {item.date}</span>
            </span>
            <span className="flex items-center gap-1.5 text-gold font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Abhishinde Production</span>
            </span>
          </div>

          <p className="text-sm md:text-base text-muted-text mt-6 font-light leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* VIDEO PREVIEW (IF AVAILABLE) */}
        {item.videoUrl && (
          <div className="mb-14">
            <h3 className="text-xl font-serif text-white mb-4">Official 4K Cinema Film</h3>
            <div
              className="relative aspect-video max-w-4xl rounded-3xl overflow-hidden border border-border group cursor-pointer shadow-2xl"
              onClick={() => setVideoOpen(true)}
            >
              <Image
                src={item.coverImage}
                alt="Video poster"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-black ml-1" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FULL GALLERY GRID */}
        <div className="mb-20">
          <h3 className="text-xl font-serif text-white mb-6">High-Resolution Photographs ({item.galleryImages.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {item.galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card-bg cursor-pointer group shadow-lg"
                onClick={() => {
                  setActiveImageIdx(idx);
                  setLightboxOpen(true);
                }}
              >
                <Image
                  src={img}
                  alt={`${item.title} - Frame ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs uppercase tracking-widest text-gold bg-black/80 px-4 py-2 rounded-full border border-gold/40">
                    Expand Fullscreen
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOOKING CTA BANNER */}
        <div className="bg-gradient-to-r from-card-bg via-secondary-bg to-card-bg border border-gold/40 rounded-3xl p-8 md:p-12 mb-20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-gold font-bold">Inspired By This Project?</span>
            <h3 className="text-2xl md:text-3xl font-serif text-white">Let’s Document Your Special Celebration</h3>
            <p className="text-xs text-muted-text">Check live date availability or explore our Both Side 1,55,000 package.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsEnquiryModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black/70 hover:bg-zinc-900 border border-gold/60 text-gold hover:text-white font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-full transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enquire for this Style</span>
            </button>
            <Link
              href="/booking"
              className="w-full sm:w-auto text-center bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(197,164,109,0.3)]"
            >
              Book Your Shoot Now
            </Link>
          </div>
        </div>

        {/* RELATED PROJECTS */}
        {related.length > 0 && (
          <div className="border-t border-border pt-16">
            <h3 className="text-2xl font-serif text-white mb-8">Related {item.category} Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/portfolio/${rel.slug}`}
                  className="group bg-card-bg border border-border rounded-2xl overflow-hidden flex items-center gap-4 p-4 hover:border-gold transition-all"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <Image src={rel.coverImage} alt={rel.title} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gold uppercase tracking-wider">{rel.location}</span>
                    <h4 className="font-serif text-lg text-white font-medium group-hover:text-gold transition-colors">
                      {rel.title}
                    </h4>
                    <span className="text-xs text-muted-text flex items-center gap-1 mt-1">
                      <span>View Story</span>
                      <ArrowRight className="w-3 h-3 text-gold" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Lightbox
        images={item.galleryImages}
        initialIndex={activeImageIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <VideoModal
        videoUrl={item.videoUrl || null}
        title={item.title}
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
      />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        defaultCategory={item.category}
        defaultService={item.category.includes('Wedding') ? 'Wedding Photography' : item.category}
      />
    </div>
  );
}
