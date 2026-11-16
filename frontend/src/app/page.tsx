'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  Pause,
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Star, 
  Instagram, 
  Check, 
  Film,
  Camera,
  Layers,
  Award,
  MessageCircle,
  Mail,
  User,
  Phone,
  MapPin,
  Clock,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Send,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Lightbox from '@/components/Lightbox';
import VideoModal from '@/components/VideoModal';
import EnquiryModal from '@/components/EnquiryModal';
import StudioLogo from '@/components/StudioLogo';
import { db } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { PortfolioItem } from '@/types';

// SIGNATURE SLIDESHOW DATA FOR HOMEPAGE
const FEATURED_SLIDES = [
  {
    id: 1,
    title: 'Shiv // Teju: Royal Maharashtrian Wedding',
    category: 'Traditional Maharashtrian Wedding',
    location: 'Sinnar / Nashik, Maharashtra',
    image: '/images/hero-wedding-bg.jpg',
    description: 'A destiny written in floral garlands, authentic paithani silks, and sacred pheras under the traditional carved mandap.',
    tag: 'Flagship Celebration'
  },
  {
    id: 2,
    title: 'Sunset Whispers: Rohan & Shreya',
    category: 'Coastal Pre-Wedding Story',
    location: 'Varsoli Beach & Palms, Alibaug',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1600&q=85',
    description: 'Golden hour ocean waves, breezy linen attire, and unscripted intimacy along Maharashtra’s sun-drenched coast.',
    tag: 'Pre-Wedding Cinema'
  },
  {
    id: 3,
    title: 'Haldi Euphoria: Mayur & Gauri',
    category: 'Vibrant Haldi Ceremony',
    location: 'Kulkarni Heritage Lawns, Pune',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85',
    description: 'Pure turmeric gold, marigold petal rain, and untamed laughter captured with high-speed 120fps cinema optics.',
    tag: 'Candid Joy'
  },
  {
    id: 4,
    title: 'Bespoke Bridal Portraiture',
    category: 'Fine-Art Editorial',
    location: 'Studio Suites, Sinnar / Nashik',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
    description: 'Heirloom jewelry details, hand-woven gold borders, and serene bridal emotion before stepping into the mandap.',
    tag: 'Editorial Details'
  },
  {
    id: 5,
    title: 'Tanvi & Aditya: Grand Pheras & Fireworks',
    category: 'Royal Wedding Evening',
    location: 'Sayaji Palace, Kolhapur',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    description: 'Night fireworks lighting up the palace courtyards with 4K drone cinematography and live 8x12 LED broadcasts.',
    tag: 'Cinematic Grandeur'
  }
];

export default function HomePage() {
  const packages = db.getPackages();
  const portfolio = db.getPortfolio();
  const testimonials = db.getTestimonials();

  // Signature package matching flyer
  const signaturePackage = packages.find((p) => p.isSignature) || packages[0];

  // Portfolio Filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Wedding', 'Pre-Wedding', 'Haldi & Events', 'Editorial Portraits'];

  const filteredPortfolio = selectedCategory === 'All'
    ? portfolio
    : selectedCategory === 'Haldi & Events'
    ? portfolio.filter((p) => p.category === 'Events' || p.category.includes('Haldi'))
    : selectedCategory === 'Editorial Portraits'
    ? portfolio.filter((p) => p.category === 'Fashion' || p.category === 'Maternity')
    : portfolio.filter((p) => p.category === selectedCategory);

  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlideAutoPlaying, setIsSlideAutoPlaying] = useState(true);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (!isSlideAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSlideAutoPlaying]);

  const handlePrevSlide = () => {
    setIsSlideAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + FEATURED_SLIDES.length) % FEATURED_SLIDES.length);
  };

  const handleNextSlide = () => {
    setIsSlideAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % FEATURED_SLIDES.length);
  };

  // Video Section State (YouTube or Native)
  const [activeVideoTab, setActiveVideoTab] = useState<'trailer' | 'reel'>('trailer');

  // Lightbox & Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState('');

  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryCategory, setEnquiryCategory] = useState('Wedding Photography');
  const [enquiryPackage, setEnquiryPackage] = useState('WEDDING PACKAGE - BOTH SIDE (₹1,55,000)');

  const openPortfolioLightbox = (item: PortfolioItem) => {
    setLightboxImages(item.galleryImages);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const openVideo = (url: string, title: string) => {
    setActiveVideoUrl(url);
    setActiveVideoTitle(title);
    setVideoModalOpen(true);
  };

  const handleOpenEnquiry = (cat = 'Wedding Photography', pkg = 'WEDDING PACKAGE - BOTH SIDE (₹1,55,000)') => {
    setEnquiryCategory(cat);
    setEnquiryPackage(pkg);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-gold selection:text-white">
      
      {/* ==================================================== */}
      {/* 1. HERO SECTION (EDITORIAL "STORIES IN LIGHT" STYLE) */}
      {/* ==================================================== */}
      <section className="relative min-h-screen flex flex-col justify-between pt-24 pb-8 sm:pb-12 px-4 sm:px-8 md:px-12 lg:px-16 border-b border-border overflow-hidden bg-background">
        
        {/* TOP METADATA BAR (EXACT MATCH TO REFERENCE PHOTO) */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-3 sm:pt-6 z-10">
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-muted-text leading-relaxed">
            INDEPENDENT<br />
            PHOTOGRAPHER<br />
            BASED IN SINNAR,<br />
            NASHIK, MAHARASHTRA
          </div>

          <div className="flex items-center gap-6 sm:gap-8 self-end sm:self-auto">
            <div className="text-right text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-muted-text">
              VISUAL STORIES<br />
              SINCE 2018 ↘
            </div>

            {/* Circular Stamp Emblem */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-border flex items-center justify-center text-center p-2 group hover:border-gold transition-colors shrink-0 bg-card-bg/60 shadow-sm">
              <span className="text-[7.5px] sm:text-[8.5px] font-mono uppercase tracking-widest text-muted-text leading-tight group-hover:text-foreground">
                MADE OF<br />REAL<br />MOMENTS ↗
              </span>
            </div>
          </div>
        </div>

        {/* HERO COMPOSITION: MASSIVE EDITORIAL TYPOGRAPHY & FRAMED MANDAP PHOTOGRAPH */}
        <div className="my-auto py-8 sm:py-12 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT: MASSIVE EDITORIAL HEADLINE */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-bg border border-border text-muted-text text-[10px] uppercase tracking-widest mb-2 font-mono">
                <Sparkles className="w-3 h-3 text-gold" />
                <span>Abhi Shinde • Visual Storyteller</span>
              </div>

              <div className="select-none">
                <h1 className="font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] tracking-tighter text-foreground leading-[0.85] uppercase">
                  STORIES
                </h1>
                <div className="flex items-baseline gap-3 sm:gap-5 flex-wrap">
                  <span className="font-sans font-black text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] tracking-tight text-foreground leading-[0.85] uppercase">
                    IN
                  </span>
                  <span className="font-serif italic font-normal text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-normal text-foreground leading-[0.85] lowercase">
                    light.
                  </span>
                </div>
              </div>

              <p className="font-sans text-sm sm:text-base md:text-lg text-muted-text max-w-xl pt-4 font-normal leading-relaxed">
                Honest photographs for the moments you'll want to return to. Capturing timeless Maharashtrian weddings, ethereal pre-weddings, and candid celebrations.
              </p>
            </div>

            {/* RIGHT: FRAMED REAL MANDAP WEDDING PHOTOGRAPH */}
            <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
              <div className="relative aspect-[4/5] w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden border border-border shadow-xl bg-card-bg p-2 hover:shadow-2xl transition-all duration-500 group">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-secondary-bg">
                  <Image
                    src="/images/hero-wedding-bg.jpg"
                    alt="Authentic Maharashtrian Wedding under Mandap by Abhi Shinde"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-gold font-bold block mb-0.5">
                      Shiv // Teju
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-medium leading-snug">
                      Royal Maharashtrian Wedding
                    </h3>
                    <span className="text-[10px] text-zinc-300 block">
                      Shot by Abhi Shinde • Sinnar, Nashik
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-6 border-t border-border z-10">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#slideshow"
              className="inline-flex items-center gap-2 bg-[#181818] hover:bg-gold text-white font-medium uppercase tracking-wider text-xs px-7 py-3 rounded-full transition-all shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Explore Real Shoots</span>
            </a>

            <a
              href="#video"
              className="inline-flex items-center gap-2 bg-card-bg hover:bg-secondary-bg border border-border text-foreground font-medium uppercase tracking-wider text-xs px-7 py-3 rounded-full transition-all shadow-sm"
            >
              <Film className="w-3.5 h-3.5 text-gold" />
              <span>Watch Wedding Films 🎥</span>
            </a>

            <a
              href="#reviews"
              className="inline-flex items-center gap-2 bg-secondary-bg hover:bg-card-bg border border-border text-foreground font-medium uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all"
            >
              <Star className="w-3.5 h-3.5 text-gold fill-gold" />
              <span>Client Reviews</span>
            </a>
          </div>

          <div className="flex items-center gap-3 text-muted-text text-[11px] font-mono uppercase tracking-[0.2em] self-end sm:self-auto">
            <div className="w-10 h-[1px] bg-foreground/40" />
            <a href="#slideshow" className="hover:text-foreground transition-colors">
              SCROLL TO DISCOVER
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. DYNAMIC WORK SLIDESHOW (AUTOPLAYING CAROUSEL)     */}
      {/* ==================================================== */}
      <section id="slideshow" className="py-20 sm:py-24 bg-secondary-bg/50 border-b border-border scroll-mt-20">
        <div className="container mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-semibold font-mono">
                Visual Stories Showcase
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-foreground mt-1">
                Selected Signature Shoots
              </h2>
            </div>
            
            {/* Slideshow Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-text mr-2">
                0{currentSlide + 1} / 0{FEATURED_SLIDES.length}
              </span>
              <button
                onClick={handlePrevSlide}
                className="w-11 h-11 rounded-full bg-card-bg hover:bg-[#181818] hover:text-white border border-border flex items-center justify-center text-foreground transition-all shadow-sm"
                title="Previous Shoot"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-11 h-11 rounded-full bg-card-bg hover:bg-[#181818] hover:text-white border border-border flex items-center justify-center text-foreground transition-all shadow-sm"
                title="Next Shoot"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MAIN SLIDESHOW STAGE */}
          <div 
            className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-border shadow-xl bg-card-bg group"
            onMouseEnter={() => setIsSlideAutoPlaying(false)}
            onMouseLeave={() => setIsSlideAutoPlaying(true)}
          >
            {FEATURED_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                
                {/* Slide Caption Box */}
                <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 right-6 sm:right-12 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="max-w-2xl">
                    <span className="px-3 py-1 rounded-full bg-gold/90 text-black text-[10px] font-mono uppercase tracking-widest font-bold mb-2 inline-block">
                      {slide.tag} • {slide.location}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
                      {slide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-2 font-light max-w-lg leading-relaxed">
                      {slide.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setLightboxImages([slide.image]);
                      setLightboxIndex(0);
                      setLightboxOpen(true);
                    }}
                    className="self-start md:self-auto inline-flex items-center gap-2 bg-white/90 hover:bg-white text-black font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-md backdrop-blur-sm shrink-0"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Full Photograph</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Thumbnail Selector Pills (Bottom Center) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {FEATURED_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsSlideAutoPlaying(false);
                    setCurrentSlide(i);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentSlide ? 'w-8 bg-gold' : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                  title={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. CINEMATIC WEDDING FILMS (VIDEO REEL SHOWCASE)     */}
      {/* ==================================================== */}
      <section id="video" className="py-20 sm:py-24 container mx-auto px-4 md:px-8 scroll-mt-20 border-b border-border">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-bg border border-border text-gold text-xs uppercase tracking-widest mb-3 font-mono">
            <Film className="w-3.5 h-3.5" />
            <span>4K Cinema Optics • Bespoke Audio Scoring</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground font-bold">
            Moving Pictures with Soul
          </h2>
          <p className="text-xs sm:text-sm text-muted-text mt-2 max-w-xl mx-auto">
            Shot on full-frame Sony cinema cameras with anamorphic primes, custom sound design, and soulful speeches that make families relive their vows forever.
          </p>
        </div>

        {/* EMBEDDED CINEMATIC VIDEO THEATER */}
        <div className="max-w-5xl mx-auto bg-card-bg border border-border rounded-3xl p-3 sm:p-5 shadow-2xl">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
            {activeVideoTab === 'trailer' ? (
              <iframe
                src="https://www.youtube-nocookie.com/embed/48yulvK82GA?rel=0&modestbranding=1&playsinline=1"
                title="Abhishinde Photography - Official Wedding Cinema Reel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div 
                className="relative w-full h-full cursor-pointer group"
                onClick={() => openVideo(
                  'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-on-the-beach-at-sunset-41279-large.mp4',
                  'Sunset Romance in Alibaug - Pre-Wedding Reel'
                )}
              >
                <Image
                  src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1400&q=80"
                  alt="Alibaug Video Poster"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-black ml-1 text-black" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase font-mono tracking-widest text-gold font-bold">
                    Pre-Wedding Highlight Reel
                  </span>
                  <h4 className="font-serif text-2xl font-bold mt-1">
                    Rohan & Shreya — Golden Hour Coastal Waves
                  </h4>
                </div>
              </div>
            )}
          </div>

          {/* VIDEO CONTROLS / TABS */}
          <div className="mt-4 px-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveVideoTab('trailer')}
                className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full font-medium transition-all ${
                  activeVideoTab === 'trailer'
                    ? 'bg-[#181818] text-white'
                    : 'bg-secondary-bg text-muted-text hover:text-foreground'
                }`}
              >
                Signature Wedding Film (YouTube 4K)
              </button>
              <button
                onClick={() => setActiveVideoTab('reel')}
                className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full font-medium transition-all ${
                  activeVideoTab === 'reel'
                    ? 'bg-[#181818] text-white'
                    : 'bg-secondary-bg text-muted-text hover:text-foreground'
                }`}
              >
                Alibaug Coastal Reel
              </button>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://youtu.be/48yulvK82GA"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline font-semibold"
              >
                <span>Watch On Official YouTube Channel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. COMPREHENSIVE PORTFOLIO GALLERY (REAL WORK)       */}
      {/* ==================================================== */}
      <section id="portfolio" className="py-20 sm:py-24 container mx-auto px-4 md:px-8 scroll-mt-20 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold font-mono">Curated Visual Archives</span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground mt-1">Real Client Portfolio</h2>
            <p className="text-xs sm:text-sm text-muted-text mt-2 max-w-xl">
              Authentic Maharashtrian weddings, ethereal pre-wedding destinations, and heartfelt family moments documented by Abhi Shinde.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? 'border-[#181818] bg-[#181818] text-white font-bold'
                    : 'border-border bg-card-bg text-muted-text hover:text-foreground hover:border-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolio.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-border bg-card-bg cursor-pointer transition-all duration-300 hover:border-gold hover:-translate-y-1 shadow-sm hover:shadow-lg"
              onClick={() => openPortfolioLightbox(item)}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary-bg">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                {item.videoUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openVideo(item.videoUrl!, item.title);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    title="Play Video Film"
                  >
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  </button>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
                  <span className="text-[10px] uppercase tracking-wider text-gold font-bold font-mono">
                    {item.category} • {item.location}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-medium mt-1 group-hover:text-gold transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <div className="pt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] text-zinc-300">{item.client}</span>
                    <span className="text-[11px] text-gold underline">
                      Click to expand gallery ({item.galleryImages.length} Photos) →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BEFORE & AFTER COLOR SCIENCE DEMO */}
        {portfolio[0]?.beforeAfter && (
          <div className="mt-16 pt-12 border-t border-border">
            <BeforeAfterSlider
              beforeImage={portfolio[0].beforeAfter.beforeImage}
              afterImage={portfolio[0].beforeAfter.afterImage}
              label="Signature DaVinci Color Science: Raw Log vs Final Editorial Grade"
            />
          </div>
        )}

        <div className="text-center mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 border border-border hover:border-gold bg-card-bg text-foreground hover:text-gold font-medium text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow-sm"
          >
            <span>Explore All 50+ Client Archives</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://www.instagram.com/abhishinde_photography/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#181818] hover:bg-gold text-white font-medium text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow-sm"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow Live Stories On Instagram</span>
          </a>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. WHY CLIENTS TRUST ABHISHINDE PHOTOGRAPHY         */}
      {/* ==================================================== */}
      <section className="py-20 sm:py-24 bg-secondary-bg/60 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold font-mono">
              Uncompromising Standards
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground font-bold mt-1">
              Why Couples Choose Us
            </h2>
            <p className="text-xs sm:text-sm text-muted-text mt-2 max-w-xl mx-auto">
              We eliminate the stress of wedding photography. Guaranteed delivery timelines, high-end cinema optics, and luxury Italian-bound physical albums.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-3 shadow-sm hover:border-gold transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-serif text-xl font-bold">
                7D
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">7-Day Raw Turnaround</h3>
              <p className="text-xs text-muted-text leading-relaxed">
                Never wait months. All full-resolution digital raw photographs are delivered within 7 business days following your shoot.
              </p>
            </div>

            <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-3 shadow-sm hover:border-gold transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">8x12 Live LED Broadcast</h3>
              <p className="text-xs text-muted-text leading-relaxed">
                Live camera feed directly broadcast to venue LED screens so all wedding guests enjoy an unblocked view of sacred pheras.
              </p>
            </div>

            <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-3 shadow-sm hover:border-gold transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-serif text-xl font-bold">
                2x
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">Italian Leather Photobooks</h3>
              <p className="text-xs text-muted-text leading-relaxed">
                Two 40-page bespoke heirloom albums bound in archival velvet leather for bride and groom families to cherish for generations.
              </p>
            </div>

            <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-3 shadow-sm hover:border-gold transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-serif text-xl font-bold">
                64G
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">64 GB Wooden Pendrive</h3>
              <p className="text-xs text-muted-text leading-relaxed">
                Complete 4K wedding films, color-graded teasers, and high-res digital albums preserved on a custom keepsake USB presentation box.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. GENUINE CLIENT REVIEWS & LOVE LETTERS             */}
      {/* ==================================================== */}
      <section id="reviews" className="py-20 sm:py-24 container mx-auto px-4 md:px-8 scroll-mt-20 border-b border-border">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold font-mono">Real Couple Words</span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mt-1">Client Reviews & Love Letters</h2>
          <p className="text-xs sm:text-sm text-muted-text mt-2">
            Read what couples and their families say about their experience with Abhi Shinde and the visual crew.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-card-bg border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-center gap-1 text-gold mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-muted-text italic leading-relaxed mb-6 font-light">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-3">
                {t.clientImage && (
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border shrink-0">
                    <Image src={t.clientImage} alt={t.clientName} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="font-serif text-base text-foreground font-bold">{t.clientName}</h4>
                  <span className="text-xs text-gold block">{t.event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. ABOUT THE ARTIST (ABHI SHINDE)                    */}
      {/* ==================================================== */}
      <section id="about" className="py-20 sm:py-24 container mx-auto px-4 md:px-8 scroll-mt-20 border-b border-border">
        <div className="bg-card-bg border border-border rounded-3xl p-8 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center shadow-sm">
          
          {/* Photographer Portrait */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-border shadow-md bg-secondary-bg p-2">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src="/images/abhi-hero-camera.jpg"
                  alt="Abhi Shinde - Lead Photographer holding camera"
                  fill
                  className="object-cover object-[center_10%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold block mb-0.5 font-mono">
                    Creative Director & Founder
                  </span>
                  <h3 className="font-serif text-2xl font-bold">Abhi Shinde</h3>
                  <p className="text-xs text-zinc-300 mt-0.5">Sony Cinema Line & Master Prime Optics</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Sinnar / Nashik • Pune • Mumbai</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Credentials */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-bg border border-border text-gold text-xs uppercase tracking-widest font-mono font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>Behind The Viewfinder</span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl text-foreground font-bold leading-tight">
              "A great photograph is not just seen; it is felt."
            </h2>

            <p className="text-sm text-muted-text leading-relaxed font-light">
              With over a decade behind the camera, <strong>Abhi Shinde</strong> has documented more than 500+ couples across Nashik, Pune, Mumbai, and destination venues throughout India.
            </p>

            <p className="text-sm text-muted-text leading-relaxed font-light">
              We avoid staged, rigid posing. Instead, our team stays attuned to honest glances, quiet tears of joy between parents, and the spirited celebration of your baraat. Every wedding film is finished with bespoke color science and bound in heirloom Italian leather.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-xs text-foreground font-medium">Full-Frame Anamorphic & 4K Drones</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-xs text-foreground font-medium">Both-Side Wedding Ceremony Mastery</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-xs text-foreground font-medium">8x12 Live LED Venue Feed Broadcast</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-xs text-foreground font-medium">7-Day High-Speed Raw Turnaround</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/917822053169"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-medium text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Abhi (+91 7822053169)</span>
              </a>

              <a
                href="https://www.instagram.com/abhishinde_photography/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-card-bg border border-border hover:border-gold text-foreground hover:text-gold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-sm"
              >
                <Instagram className="w-4 h-4 text-gold" />
                <span>@abhishinde_photography</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 8. SERVICES & SIGNATURE PACKAGE RATE CARD           */}
      {/* ==================================================== */}
      <section id="packages" className="py-20 sm:py-24 bg-secondary-bg/60 border-b border-border scroll-mt-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card-bg border border-border text-gold text-xs uppercase tracking-widest mb-3 font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Investment Rate Card</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground font-bold">
              Services & Packages
            </h2>
            <p className="text-xs sm:text-sm text-muted-text mt-2 max-w-xl mx-auto">
              Transparent pricing with no surprises. Written studio guarantee on all raw footage and edited deliverables.
            </p>
          </div>

          {/* SIGNATURE PACKAGE SPOTLIGHT: ₹1,55,000 BOTH SIDE PACKAGE */}
          <div className="max-w-5xl mx-auto bg-card-bg border-2 border-gold/70 rounded-3xl p-6 sm:p-12 shadow-md relative mb-12">
            <div className="text-center mb-8 border-b border-border pb-6">
              <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-1 font-mono">
                ⭐ COMPLETE WEDDING COVERAGE (BRIDE & GROOM SIDES)
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-foreground font-bold">
                WEDDING PACKAGE – BOTH SIDE
              </h3>
              <div className="text-4xl md:text-5xl font-serif text-foreground font-bold mt-2">
                {formatINR(signaturePackage.price)}
              </div>
              <p className="text-xs text-muted-text mt-1">
                Covers Engagement, Mehandi, Haldi & Vaidik Wedding Ceremony
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* COLUMN 1: ENGAGEMENT & MEHANDI */}
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h4 className="font-serif text-xl text-foreground font-bold tracking-wide">
                    ENGAGEMENT
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-text">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" /> Traditional photographer
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" /> Candid photographer
                    </li>
                  </ul>
                </div>

                <div className="border-b border-border pb-4">
                  <h4 className="font-serif text-xl text-foreground font-bold tracking-wide">
                    MEHANDI (Bride)
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-text">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" /> Traditional photographer
                    </li>
                  </ul>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2 font-mono">
                    Works to be Given / Deliverables:
                  </span>
                  <ul className="space-y-2 text-xs text-muted-text">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span>All raw pictures provided within 1 week from wedding shoot.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span>Cinematic video edit + couple reels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span className="text-foreground font-semibold">8x12 LED Screen setup with live camera feed</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* COLUMN 2: HALDI & WEDDING */}
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <h4 className="font-serif text-xl text-foreground font-bold tracking-wide">
                    HALDI & WEDDING
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-text">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" /> Traditional photographer & videographer
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" /> Candid photographer & Cinematic camera
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold" /> High-definition Drone aerials
                    </li>
                  </ul>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2 font-mono">
                    Works to be Given / Deliverables:
                  </span>
                  <ul className="space-y-2 text-xs text-muted-text">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span>Cinematic film + teaser + traditional edit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span className="text-foreground font-semibold">Wedding 2 Photobook Albums (40 Pages each)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span className="text-gold font-semibold">Final complete data on 64 GB Pendrive</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* PAYMENT SCHEDULE */}
            <div className="mt-8 p-6 rounded-2xl bg-secondary-bg/60 border border-border">
              <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-2 font-mono">
                Payment Schedule (3-Tier Protection):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-text">
                <div className="p-3.5 rounded-xl bg-card-bg border border-border">
                  <strong className="text-foreground block text-sm mb-1">30% Advance</strong>
                  Pay on booking day to block calendar ({formatINR(Math.round(155000 * 0.3))}).
                </div>
                <div className="p-3.5 rounded-xl bg-card-bg border border-border">
                  <strong className="text-foreground block text-sm mb-1">60% Before Shoot</strong>
                  Pay prior to wedding morning commencement ({formatINR(Math.round(155000 * 0.6))}).
                </div>
                <div className="p-3.5 rounded-xl bg-card-bg border border-border">
                  <strong className="text-foreground block text-sm mb-1">10% On Delivery</strong>
                  Once complete photobooks and deliverables are handed over ({formatINR(Math.round(155000 * 0.1))}).
                </div>
              </div>
            </div>

            {/* PACKAGE CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => handleOpenEnquiry('Wedding Photography', signaturePackage.title)}
                className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-full transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire For This Package</span>
              </button>
              <Link
                href={`/booking?packageId=${signaturePackage.id}`}
                className="inline-flex items-center justify-center gap-2 bg-[#181818] hover:bg-gold text-white font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-full transition-all shadow-sm"
              >
                <Calendar className="w-4 h-4 text-gold" />
                <span>Book Online (30% Retainer)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 9. MINIMAL FOOTER & DIRECT CONTACT                   */}
      {/* ==================================================== */}
      <footer id="contact" className="py-16 sm:py-20 bg-secondary-bg/80 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <StudioLogo size="lg" className="justify-center mb-3" />
            <p className="text-xs sm:text-sm text-muted-text mt-2 max-w-lg mx-auto">
              Ready to check calendar dates or discuss custom wedding stories? Reach out directly to founder Abhi Shinde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {/* CALL & WHATSAPP */}
            <div className="bg-card-bg border border-border rounded-2xl p-6 text-center shadow-sm hover:border-green-600/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-foreground font-bold">Call & WhatsApp</h3>
              <p className="text-xs text-muted-text mt-0.5">Direct studio founder line</p>
              <div className="mt-3">
                <a
                  href="https://wa.me/917822053169"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm text-green-700 font-bold block hover:underline"
                >
                  +91 78220 53169
                </a>
              </div>
            </div>

            {/* STUDIO REGIONS */}
            <div className="bg-card-bg border border-border rounded-2xl p-6 text-center shadow-sm hover:border-gold transition-colors">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold border border-gold/30 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-foreground font-bold">Studio Locations</h3>
              <p className="text-xs text-muted-text mt-0.5">Available across Maharashtra & Worldwide</p>
              <div className="mt-3 text-xs text-foreground font-medium space-y-1">
                <div>📍 Sinnar / Nashik (Main Studio)</div>
                <div>📍 Pune (Crew Base)</div>
                <div>📍 Mumbai (Editorial Projects)</div>
              </div>
            </div>

            {/* INSTAGRAM CHANNELS */}
            <div className="bg-card-bg border border-border rounded-2xl p-6 text-center shadow-sm hover:border-pink-600/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-700 border border-pink-200 flex items-center justify-center mx-auto mb-3">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg text-foreground font-bold">Official Channels</h3>
              <p className="text-xs text-muted-text mt-0.5">Daily wedding reels & stories</p>
              <div className="mt-3 space-y-1">
                <a
                  href="https://www.instagram.com/abhishinde_photography/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gold hover:underline block font-semibold"
                >
                  @abhishinde_photography
                </a>
                <a
                  href="https://www.instagram.com/abhishinde_06/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted-text hover:underline block"
                >
                  @abhishinde_06 (Personal)
                </a>
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-border/80 text-xs text-muted-text">
            © {new Date().getFullYear()} ABHISHINDE PHOTOGRAPHY. All rights reserved. We make Cine Stories.
          </div>
        </div>
      </footer>

      {/* ==================================================== */}
      {/* MODALS (LIGHTBOX, VIDEO, ENQUIRY)                   */}
      {/* ==================================================== */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <VideoModal
        videoUrl={activeVideoUrl}
        title={activeVideoTitle}
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        defaultCategory={enquiryCategory}
        defaultService={enquiryCategory}
        defaultPackage={enquiryPackage}
      />
    </div>
  );
}
