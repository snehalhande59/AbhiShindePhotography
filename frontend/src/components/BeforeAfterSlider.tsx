'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  label?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  label = 'Cinematic Color Grading & Retouching',
  beforeLabel = 'Original RAW',
  afterLabel = 'Abhishinde Master Film Grade',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      {label && (
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-widest text-gold font-medium">Interactive Comparison</span>
          <h3 className="text-xl md:text-2xl font-serif text-white mt-1">{label}</h3>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative h-[340px] md:h-[500px] w-full overflow-hidden rounded-2xl border border-border select-none shadow-2xl cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER IMAGE (Background / Full) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={afterImage}
            alt="After grade"
            fill
            className="object-cover"
            priority
          />
          <span className="absolute top-4 right-4 bg-black/75 backdrop-blur-md border border-gold/40 text-gold text-xs px-3 py-1 rounded-full font-sans tracking-wide">
            {afterLabel}
          </span>
        </div>

        {/* BEFORE IMAGE (Clipped by slider position) */}
        <div
          className="absolute inset-0 h-full overflow-hidden transition-all duration-75"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="relative w-full h-full min-w-[340px] md:min-w-[896px]">
            <Image
              src={beforeImage}
              alt="Before grade"
              fill
              className="object-cover filter contrast-75 brightness-90 saturate-50"
              priority
            />
          </div>
          <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-border text-white text-xs px-3 py-1 rounded-full font-sans tracking-wide">
            {beforeLabel}
          </span>
        </div>

        {/* DIVIDER LINE & HANDLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gold cursor-ew-resize shadow-[0_0_12px_rgba(197,164,109,0.8)]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gold text-black flex items-center justify-center font-bold text-xs shadow-xl border-2 border-white">
            ↔
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-text mt-3 tracking-wide">
        Drag or swipe slider to reveal our signature high-dynamic-range color profile
      </p>
    </div>
  );
}
