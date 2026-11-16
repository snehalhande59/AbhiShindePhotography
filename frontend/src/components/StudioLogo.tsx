'use client';

import React from 'react';
import Link from 'next/link';

interface StudioLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export default function StudioLogo({
  size = 'md',
  showTagline = true,
  className = '',
}: StudioLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[10px] tracking-[0.28em]',
    lg: 'text-xs tracking-[0.32em]',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* AUTHENTIC CAMERA & APERTURE LENS EMBLEM */}
      <div
        className={`${iconSizes[size]} relative rounded-2xl bg-[#181818] border border-gold/60 flex items-center justify-center p-1.5 shadow-md group-hover:border-gold transition-all duration-300 shrink-0`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-gold group-hover:rotate-12 transition-transform duration-500 ease-out"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Camera Body Outline */}
          <rect
            x="12"
            y="28"
            width="76"
            height="56"
            rx="12"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          {/* Viewfinder Top Bump */}
          <path
            d="M36 28 L41 18 H59 L64 28"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Shutter Button & Flash Dot */}
          <circle cx="28" cy="20" r="3.5" fill="currentColor" />
          <circle cx="75" cy="38" r="3" fill="#9E7D47" />
          
          {/* Central Aperture Iris / Lens Ring */}
          <circle
            cx="50"
            cy="56"
            r="20"
            stroke="currentColor"
            strokeWidth="4.5"
          />
          <circle
            cx="50"
            cy="56"
            r="12"
            stroke="#9E7D47"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          {/* Core Lens Glass Highlight */}
          <circle cx="47" cy="53" r="4.5" fill="#FFFFFF" fillOpacity="0.85" />
          <path
            d="M50 38 L55 50 M62 48 L54 58 M58 66 L48 60 M42 66 L46 54 M38 56 L47 48"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* TYPOGRAPHY */}
      <div className="flex flex-col justify-center select-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif font-bold uppercase tracking-wider text-foreground group-hover:text-gold transition-colors leading-none ${titleSizes[size]}`}
          >
            ABHISHINDE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shrink-0 hidden sm:inline-block" />
        </div>
        <span
          className={`font-sans font-semibold uppercase text-gold leading-none mt-1 ${subtitleSizes[size]}`}
        >
          PHOTOGRAPHY
        </span>
        {showTagline && size !== 'sm' && (
          <span className="text-[8px] tracking-[0.2em] text-muted-text uppercase font-medium mt-0.5 hidden md:block">
            Cine Stories • Nashik • Pune • Mumbai
          </span>
        )}
      </div>
    </Link>
  );
}
