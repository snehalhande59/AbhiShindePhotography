'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full p-8 border border-zinc-800 rounded-3xl bg-zinc-950 space-y-4">
          <h2 className="text-xl font-bold text-amber-400">Application Error</h2>
          <p className="text-xs text-zinc-400">{error.message || 'An error occurred.'}</p>
          <button
            onClick={() => reset()}
            className="bg-amber-400 text-black font-bold text-xs px-5 py-2.5 rounded-full"
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
