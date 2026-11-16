import React from 'react';
import Link from 'next/link';
import { Camera, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-card-bg border border-border rounded-3xl p-8 space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-gold/15 text-gold border border-gold/40 flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl text-white font-bold">404 - Page Not Found</h2>
        <p className="text-xs text-muted-text">
          The requested studio story or portal could not be found.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
