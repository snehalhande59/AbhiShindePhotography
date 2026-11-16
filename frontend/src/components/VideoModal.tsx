'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  videoUrl: string | null;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ videoUrl, title, isOpen, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !videoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl flex items-center justify-between pb-3 border-b border-border/60 mb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold">Cinematic 4K Theater</span>
          <h4 className="text-lg font-serif text-white">{title || 'Wedding Film Preview'}</h4>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white hover:text-gold transition-colors rounded-full bg-secondary-bg border border-border"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl bg-black">
        <video
          src={videoUrl}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
