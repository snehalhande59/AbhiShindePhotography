'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface LightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const nextImage = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.75 : 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10 px-4 py-2 border-b border-border/50">
        <span className="text-sm font-sans tracking-widest text-muted-text">
          {currentIndex + 1} / {images.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleZoom}
            className="p-2 text-white hover:text-gold transition-colors rounded-full bg-secondary-bg/80 border border-border"
            title="Toggle Zoom"
          >
            {zoomLevel > 1 ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-gold transition-colors rounded-full bg-secondary-bg/80 border border-border"
            title="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-gold/20 text-white hover:text-gold border border-border transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          className="relative w-full h-full max-w-6xl max-h-[82vh] transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, cursor: zoomLevel > 1 ? 'grab' : 'zoom-in' }}
          onClick={toggleZoom}
        >
          <Image
            src={images[currentIndex]}
            alt={`Gallery frame ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-gold/20 text-white hover:text-gold border border-border transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="flex justify-center gap-2 overflow-x-auto py-2 px-4 z-10 scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setZoomLevel(1);
            }}
            className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
              idx === currentIndex ? 'border-gold scale-105' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image src={img} alt="thumb" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
