'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-card-bg border border-gold/40 rounded-3xl p-8 space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl text-white font-bold">Something went wrong</h2>
        <p className="text-xs text-muted-text">
          {error.message || 'An unexpected error occurred while loading the studio page.'}
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-secondary-bg hover:bg-zinc-800 border border-border text-white text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
