'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, Unlock, Download, Key, Calendar, ShieldCheck, Eye } from 'lucide-react';
import { db } from '@/lib/store';
import Lightbox from '@/components/Lightbox';
import { ClientAlbum } from '@/types';

export default function ClientGalleryPage() {
  const [accessKey, setAccessKey] = useState('');
  const [currentAlbum, setCurrentAlbum] = useState<ClientAlbum | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const album = db.getAlbumByAccess(accessKey.trim());
    if (album) {
      setCurrentAlbum(album);
    } else {
      setErrorMsg('Invalid Access PIN or Token. Please verify the code sent to your email/WhatsApp.');
    }
  };

  const handleDownloadAll = () => {
    alert(`Downloading high-resolution ZIP archive for ${currentAlbum?.clientName}...`);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs uppercase tracking-widest mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Client Portal</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-bold uppercase mt-2 mb-4">
            Private Client Gallery
          </h1>
          <p className="text-sm md:text-base text-muted-text font-light leading-relaxed">
            Enter your secret 4-digit PIN or unique gallery token provided by Abhi Shinde to preview, share, and download your full-resolution wedding photographs.
          </p>
        </div>

        {/* PIN LOGIN SECTION (IF NOT UNLOCKED) */}
        {!currentAlbum ? (
          <div className="max-w-md mx-auto bg-card-bg border border-border rounded-3xl p-8 md:p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-secondary-bg border border-gold/40 flex items-center justify-center mx-auto text-gold">
              <Key className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-2xl text-white font-bold">Enter Gallery PIN</h3>
              <p className="text-xs text-muted-text mt-1">
                Demo access: enter PIN <strong className="text-gold">2026</strong> or token <strong className="text-gold">royal-tanvi-aditya-778</strong>
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 2026"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full text-center text-lg tracking-widest bg-secondary-bg border border-border rounded-2xl py-3.5 text-white font-mono uppercase focus:outline-none focus:border-gold"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,164,109,0.3)]"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Private Album</span>
              </button>
            </form>

            <div className="pt-4 border-t border-border text-[11px] text-muted-text">
              Need assistance? WhatsApp studio concierge at <strong className="text-white">+91 98220 12345</strong>
            </div>
          </div>
        ) : (
          /* UNLOCKED ALBUM VIEW */
          <div className="max-w-6xl mx-auto space-y-8">
            {/* ALBUM HEADER CARD */}
            <div className="bg-card-bg border border-gold/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border shrink-0">
                  <Image src={currentAlbum.coverImage} alt={currentAlbum.title} fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-gold font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>VERIFIED CLIENT ACCESS</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-white font-bold mt-1">
                    {currentAlbum.title}
                  </h2>
                  <span className="text-xs text-muted-text">
                    Client: {currentAlbum.clientName} • Expiry: {currentAlbum.expiryDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {currentAlbum.downloadEnabled && (
                  <button
                    onClick={handleDownloadAll}
                    className="flex-1 md:flex-initial bg-gold hover:bg-gold-hover text-black font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(197,164,109,0.3)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All (ZIP)</span>
                  </button>
                )}
                <button
                  onClick={() => setCurrentAlbum(null)}
                  className="bg-secondary-bg hover:bg-border text-white text-xs px-4 py-3 rounded-xl border border-border"
                >
                  Lock
                </button>
              </div>
            </div>

            {/* ALBUM PHOTOS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentAlbum.photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="group bg-card-bg border border-border rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:border-gold/60 transition-all duration-300"
                  onClick={() => {
                    setActivePhotoIdx(idx);
                    setLightboxOpen(true);
                  }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={photo.url}
                      alt={photo.caption || 'Album Photo'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <span className="p-2.5 rounded-full bg-gold text-black">
                        <Eye className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                  {photo.caption && (
                    <div className="p-3 text-xs text-muted-text text-center border-t border-border">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Lightbox
              images={currentAlbum.photos.map((p) => p.url)}
              initialIndex={activePhotoIdx}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
