'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Instagram, Award, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { db } from '@/lib/store';

export default function TeamPage() {
  const team = db.getTeam();

  return (
    <div className="pt-28 pb-24 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Craftsmen</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-bold uppercase mt-2 mb-4">
            The Production Crew
          </h1>
          <p className="text-sm md:text-base text-muted-text font-light leading-relaxed">
            Led by <strong>Abhi Shinde</strong>, our 8-member production ensemble brings together world-class candid photojournalists, commercial drone pilots, traditional strobe lighting masters, and fine-art album curators.
          </p>
        </div>

        {/* TEAM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-card-bg border border-border rounded-3xl overflow-hidden group hover:border-gold/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={member.id === 'tm-1' ? '/images/abhi-shinde-portrait.jpg' : member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[11px] text-gold uppercase tracking-wider font-semibold block">
                      {member.role}
                    </span>
                    <h3 className="font-serif text-2xl text-white font-bold">{member.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <p className="text-xs text-muted-text leading-relaxed font-light">
                    {member.bio}
                  </p>
                  <div className="pt-2 border-t border-border/80">
                    <span className="text-[10px] uppercase tracking-wider text-muted-text block mb-1">
                      Key Specialization:
                    </span>
                    <span className="text-xs text-white font-medium block">
                      {member.specialization}
                    </span>
                  </div>
                </div>
              </div>

              {member.instagram && (
                <div className="p-6 pt-0">
                  <a
                    href={`https://instagram.com/${member.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-gold hover:text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>@{member.instagram}</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CREW STANDARDS BOX */}
        <div className="max-w-4xl mx-auto bg-secondary-bg border border-border rounded-3xl p-8 md:p-12 text-center space-y-4">
          <Award className="w-10 h-10 text-gold mx-auto" />
          <h3 className="font-serif text-2xl md:text-3xl text-white">Full Both-Side Crew Synchronicity</h3>
          <p className="text-xs md:text-sm text-muted-text max-w-2xl mx-auto leading-relaxed">
            Our signature 1,55,000 INR Both-Side wedding package deploys dedicated photographers and videographers for both the bride and groom sides simultaneously, ensuring no rituals or candid tears are ever missed.
          </p>
          <div className="pt-4">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-semibold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Our Crew For Your Date</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
