'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Award, Heart, Shield, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { db } from '@/lib/store';

export default function AboutPage() {
  const team = db.getTeam();

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <section className="container mx-auto px-4 md:px-8 text-center max-w-3xl mb-16">
        <span className="text-xs uppercase tracking-widest text-gold font-semibold">Our Heritage & Vision</span>
        <h1 className="font-serif text-4xl sm:text-6xl text-foreground font-bold uppercase mt-2 mb-6">
          We Craft Forever In Every Frame
        </h1>
        <p className="text-sm md:text-base text-muted-text font-light leading-relaxed">
          Founded by <strong>Abhi Shinde</strong>, <strong>ABHISHINDE PHOTOGRAPHY</strong> is an artisanal luxury visual house crafting <strong>"CINE STORIES"</strong> 🎥🎬 across Nashik, Pune, Mumbai and destination celebrations worldwide.
        </p>
      </section>

      {/* FOUNDER SPOTLIGHT */}
      <section className="container mx-auto px-4 md:px-8 mb-24">
        <div className="bg-card-bg border border-border rounded-3xl p-8 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-gold/40 shadow-2xl">
            <Image
              src="/images/abhi-shinde-portrait.jpg"
              alt="Abhi Shinde"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase tracking-widest text-gold font-bold">Creative Director & Founder</span>
              <h3 className="font-serif text-2xl text-foreground font-bold">Abhi Shinde</h3>
              <p className="text-xs text-muted-text">Instagram: @abhishinde_photography • @abhishinde_06</p>
              <p className="text-xs text-gold mt-1">📍 Nashik / Pune / Mumbai • +91 7822053169</p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold font-bold">The Philosophy</span>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              "A great photograph is not just seen; it is felt."
            </h2>
            <p className="text-sm text-muted-text leading-relaxed font-light">
              With over a decade behind the viewfinder, Abhi Shinde has refined a distinctive aesthetic: rich film tones, honest emotional candids, and expansive cinematic compositions. We avoid generic poses, focusing instead on the subtle touch between mother and bride, the father's pride, and the untamed joy of the baraat.
            </p>
            <p className="text-sm text-muted-text leading-relaxed font-light">
              We operate with high-speed delivery standards: all raw files are handed over within 7 days, social media reels within 72 hours, and heirloom photobooks crafted in Italian leather.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-xs text-foreground">Complete Both-Side Wedding Experts</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-xs text-foreground">Cinematic 4K Anamorphic & Drones</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-xs text-foreground">8x12 Live LED Screen Broadcast</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-xs text-foreground">64 GB Custom Pendrive Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="bg-secondary-bg py-20 border-y border-border mb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">Studio Standards</span>
            <h2 className="text-3xl font-serif text-foreground mt-1">Our Guiding Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card-bg border border-border p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-foreground">Editorial Authenticity</h3>
              <p className="text-xs text-muted-text leading-relaxed">
                We balance candid documentary moments with magazine-grade editorial lighting, ensuring you look like cinema royalty without feeling stiff.
              </p>
            </div>

            <div className="bg-card-bg border border-border p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-foreground">Uncompromising Reliability</h3>
              <p className="text-xs text-muted-text leading-relaxed">
                Every camera on set shoots with dual SD slots. Backups are synced to cloud and mirrored to SSDs before we leave the venue.
              </p>
            </div>

            <div className="bg-card-bg border border-border p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-foreground">Empathetic Storytelling</h3>
              <p className="text-xs text-muted-text leading-relaxed">
                We blend in like family members, making elders comfortable and capturing unguarded warmth across all rituals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTION CREW */}
      <section className="container mx-auto px-4 md:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">The Specialists</span>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mt-1">Meet The Production Team</h2>
          <p className="text-sm text-muted-text mt-2">
            Our 8-member ensemble of cinematographers, candid eyes, lighting masters, and album curators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.id} className="bg-card-bg border border-border rounded-2xl overflow-hidden group">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] text-gold uppercase tracking-wider block font-medium">
                    {member.role}
                  </span>
                  <h4 className="font-serif text-xl text-foreground font-bold">{member.name}</h4>
                  <p className="text-[11px] text-muted-text mt-1">{member.specialization}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 border border-gold/40 text-gold hover:bg-gold hover:text-black text-xs uppercase tracking-widest px-8 py-3 rounded-full transition-all"
          >
            <span>Learn More About Our Team</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
