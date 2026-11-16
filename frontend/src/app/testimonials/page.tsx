'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MessageSquare, Heart, Send, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/store';

export default function TestimonialsPage() {
  const testimonials = db.getTestimonials().filter((t) => t.approved);

  const [clientName, setClientName] = useState('');
  const [event, setEvent] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !review) return;

    db.addTestimonial({
      id: `test-${Date.now()}`,
      clientName,
      event,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      rating,
      review,
      approved: true, // auto approve for instant client delight
    });

    setSubmitted(true);
    setClientName('');
    setEvent('');
    setReview('');
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs uppercase tracking-widest mb-3">
            <Heart className="w-3.5 h-3.5 fill-gold" />
            <span>Cherished Memories</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-bold uppercase mt-2 mb-4">
            Words From Our Couples
          </h1>
          <p className="text-sm md:text-base text-muted-text font-light leading-relaxed">
            Read heartfelt experiences from families who trusted Abhi Shinde Photography to document their most meaningful life celebrations.
          </p>
        </div>

        {/* TESTIMONIALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-card-bg border border-border rounded-3xl p-8 flex flex-col justify-between shadow-xl relative hover:border-gold/50 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-1 text-gold mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-muted-text italic leading-relaxed mb-6 font-light">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-3">
                {t.clientImage ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold/40 shrink-0">
                    <Image src={t.clientImage} alt={t.clientName} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-secondary-bg border border-gold/40 flex items-center justify-center font-serif text-gold font-bold shrink-0">
                    {t.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-serif text-base text-white font-bold">{t.clientName}</h4>
                  <span className="text-xs text-gold/80 block">{t.event} • {t.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUBMIT YOUR EXPERIENCE FORM */}
        <div className="max-w-2xl mx-auto bg-secondary-bg border border-border rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-gold font-bold">Have We Photographed You?</span>
            <h3 className="font-serif text-2xl md:text-3xl text-white mt-1">Leave A Review For Abhi & Team</h3>
            <p className="text-xs text-muted-text mt-1">Your feedback helps future couples choose with confidence.</p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/40 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
              <h4 className="font-serif text-xl text-white font-bold">Thank You So Much!</h4>
              <p className="text-xs text-muted-text">
                Your testimonial has been submitted and added to our wall of love.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-gold underline pt-2"
              >
                Submit another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvi & Aditya"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-card-bg border border-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text">Event / Shoot</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wedding Both Side / Haldi"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="w-full bg-card-bg border border-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-text">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className="p-1 text-gold"
                    >
                      <Star className={`w-5 h-5 ${s <= rating ? 'fill-gold' : 'text-border'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-text">Your Review / Story</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your experience working with Abhi Shinde Photography..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full bg-card-bg border border-border rounded-xl p-4 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Publish Testimonial</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
