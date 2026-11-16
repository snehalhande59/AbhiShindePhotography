'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Film, Calendar, Sparkles } from 'lucide-react';
import VideoModal from '@/components/VideoModal';

interface FilmItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  couple: string;
  venue: string;
  videoUrl: string;
  posterImage: string;
  description: string;
}

const FILMS: FilmItem[] = [
  {
    id: 'f1',
    title: 'The Royal Maharashtrian Saga of Tanvi & Aditya',
    category: 'Wedding Cinema',
    duration: '04:30',
    couple: 'Tanvi & Aditya Shinde',
    venue: 'Fort JadhavGADH, Pune',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-in-a-park-42407-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    description: 'A grand royal Marathi wedding featuring traditional Dhol Tasha, yellow Haldi splashes, and emotional Vaidik pheras.',
  },
  {
    id: 'f2',
    title: 'Sunset Whispers: Coastal Romance in Alibaug',
    category: 'Pre-Wedding Trailer',
    duration: '02:45',
    couple: 'Rohan & Shreya',
    venue: 'Varsoli Beach, Alibaug',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-on-the-beach-at-sunset-41279-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    description: 'Golden hour waves, candid whispers, and cinematic drone sweeps across the serene coastal shoreline.',
  },
  {
    id: 'f3',
    title: 'Haldi Petal Rain & Miravnuk Procession',
    category: 'Event Highlight Reel',
    duration: '01:30',
    couple: 'Mayur & Gauri',
    venue: 'Mulshi Lakefront Resort',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-posing-in-a-park-42407-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80',
    description: 'Explosions of marigolds, joyous water splashes, and high-energy dhol beats captured at 120fps slow-motion.',
  },
  {
    id: 'f4',
    title: 'Royal Heritage Pheras at City Palace',
    category: 'Full Feature Film',
    duration: '08:15',
    couple: 'Kunal & Riya',
    venue: 'Sayaji Palace, Kolhapur',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-on-the-beach-at-sunset-41279-large.mp4',
    posterImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    description: '8-member production crew with anamorphic prime lenses, 4K aerial tracking, and live LED multi-camera feed.',
  },
];

export default function FilmsPage() {
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs uppercase tracking-widest mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>Moving Cinema</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-bold uppercase mt-2 mb-4">
            Cinematic Films & Reels
          </h1>
          <p className="text-sm md:text-base text-muted-text font-light leading-relaxed">
            Every couple has an epic love story. We capture it with Hollywood-grade 4K color science, authentic vows, and bespoke soundtrack engineering.
          </p>
        </div>

        {/* HERO FEATURED FILM */}
        <div className="max-w-5xl mx-auto mb-20">
          <div
            className="relative aspect-video rounded-3xl overflow-hidden border-2 border-gold/60 group cursor-pointer shadow-2xl"
            onClick={() => setSelectedVideo({ url: FILMS[0].videoUrl, title: FILMS[0].title })}
          >
            <Image
              src={FILMS[0].posterImage}
              alt={FILMS[0].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
              priority
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gold text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-black ml-1" />
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase tracking-widest text-gold font-bold bg-black/80 px-3 py-1 rounded-full border border-gold/40">
                {FILMS[0].category} • {FILMS[0].duration}
              </span>
              <h2 className="font-serif text-2xl md:text-4xl text-white font-bold mt-2">
                {FILMS[0].title}
              </h2>
              <p className="text-xs md:text-sm text-muted-text mt-1 max-w-2xl">{FILMS[0].description}</p>
            </div>
          </div>
        </div>

        {/* FILMS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {FILMS.slice(1).map((film) => (
            <div
              key={film.id}
              className="group bg-card-bg border border-border rounded-2xl overflow-hidden shadow-xl hover:border-gold/60 transition-all cursor-pointer"
              onClick={() => setSelectedVideo({ url: film.videoUrl, title: film.title })}
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={film.posterImage}
                  alt={film.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-85"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gold/90 text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>
                <span className="absolute top-3 right-3 text-[10px] font-mono bg-black/80 text-white px-2 py-0.5 rounded">
                  {film.duration}
                </span>
              </div>

              <div className="p-5">
                <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">
                  {film.category} • {film.venue}
                </span>
                <h4 className="font-serif text-lg text-white font-medium mt-1 group-hover:text-gold transition-colors">
                  {film.title}
                </h4>
                <p className="text-xs text-muted-text mt-2 line-clamp-2">{film.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-full transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Your Wedding Film Crew</span>
          </Link>
        </div>
      </div>

      <VideoModal
        videoUrl={selectedVideo?.url || null}
        title={selectedVideo?.title}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}
