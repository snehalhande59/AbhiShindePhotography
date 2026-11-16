'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Play, ArrowRight } from 'lucide-react';
import { db } from '@/lib/store';
import Lightbox from '@/components/Lightbox';
import VideoModal from '@/components/VideoModal';
import { PortfolioItem } from '@/types';

export default function PortfolioPage() {
  const portfolio = db.getPortfolio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Wedding',
    'Pre-Wedding',
    'Engagement',
    'Events',
    'Fashion',
    'Maternity',
    'Corporate',
  ];

  // Lightbox & Video
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState('');

  const filtered = portfolio.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openLightbox = (images: string[]) => {
    setActiveImages(images);
    setLightboxIdx(0);
    setLightboxOpen(true);
  };

  const openVideo = (url: string, title: string) => {
    setVideoUrl(url);
    setVideoTitle(title);
    setVideoModalOpen(true);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">Visual Archives</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-foreground font-bold uppercase mt-2 mb-4">
            Master Portfolio
          </h1>
          <p className="text-sm text-muted-text font-light leading-relaxed">
            Explore our curated gallery of royal Maharashtrian weddings, ethereal pre-wedding destinations, and editorial visual stories.
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? 'border-gold bg-gold text-black font-bold shadow-[0_0_15px_rgba(197,164,109,0.3)]'
                    : 'border-border bg-card-bg text-muted-text hover:text-foreground hover:border-gold/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city, couple, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary-bg border border-border rounded-full pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-text">
            No projects found matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group bg-card-bg border border-border rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl hover:border-gold/60 transition-all duration-300"
              >
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(item.galleryImages)}
                >
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80 group-hover:opacity-90" />

                  {item.videoUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openVideo(item.videoUrl!, item.title);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      title="Play Film"
                    >
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </button>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase tracking-wider text-gold font-bold block mb-1">
                      {item.category} • {item.location}
                    </span>
                    <h3 className="font-serif text-xl text-white font-medium group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-text">{item.galleryImages.length} Photographs</span>
                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-foreground uppercase tracking-wider font-semibold transition-colors"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        images={activeImages}
        initialIndex={lightboxIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <VideoModal
        videoUrl={videoUrl}
        title={videoTitle}
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </div>
  );
}
