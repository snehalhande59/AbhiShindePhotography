import React from 'react';
import Link from 'next/link';
import { Camera, Instagram, Phone, Mail, MapPin, MessageCircle, Heart, User, Youtube } from 'lucide-react';
import StudioLogo from '@/components/StudioLogo';

export default function Footer() {
  return (
    <footer className="bg-secondary-bg border-t border-border pt-16 pb-8 text-muted-text">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* COL 1: BRAND */}
          <div className="space-y-4">
            <StudioLogo size="md" />
            <p className="text-xs leading-relaxed text-muted-text">
              <strong className="text-gold uppercase block tracking-wider">We Make "CINE STORIES" 🎥🎬</strong>
              Maharashtra’s premier luxury wedding & pre-wedding cinema studio directed by <strong className="text-white">Abhi Shinde</strong>.
              <span className="block mt-1 text-[11px] text-zinc-400">Serving Nashik • Pune • Mumbai & Destination Celebrations worldwide.</span>
            </p>

            {/* Official Instagram & Social Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://www.instagram.com/abhishinde_photography/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-white hover:text-gold bg-card-bg border border-border hover:border-gold/60 px-3.5 py-2 rounded-xl transition-all"
              >
                <Instagram className="w-4 h-4 text-gold shrink-0" />
                <span>FOLLOW @ABHISHINDE_PHOTOGRAPHY</span>
              </a>
              <a
                href="https://www.instagram.com/abhishinde_06/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-muted-text hover:text-white bg-card-bg border border-border px-3.5 py-2 rounded-xl transition-all"
              >
                <User className="w-4 h-4 text-gold shrink-0" />
                <span>FOLLOW ABHI ON INSTAGRAM</span>
              </a>
              <a
                href="https://youtu.be/48yulvK82GA"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-red-400 hover:text-red-300 bg-card-bg border border-border px-3.5 py-2 rounded-xl transition-all"
              >
                <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                <span>WATCH OFFICIAL FILM REEL</span>
              </a>
            </div>
          </div>

          {/* COL 2: QUICK NAVIGATION */}
          <div>
            <h4 className="font-serif text-white text-base uppercase tracking-widest mb-4 border-l-2 border-gold pl-3">
              Studio Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  Our Story & Philosophy
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-gold transition-colors">
                  Cinematic Portfolio
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold transition-colors">
                  Photography Services
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-gold transition-colors">
                  Wedding Packages & Pricing
                </Link>
              </li>
              <li>
                <Link href="/films" className="hover:text-gold transition-colors">
                  Cinematic Films & Reels
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-gold transition-colors">
                  The Production Crew
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 3: CLIENT & LEGAL */}
          <div>
            <h4 className="font-serif text-white text-base uppercase tracking-widest mb-4 border-l-2 border-gold pl-3">
              Client & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/client-gallery" className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  Private Client Gallery
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-gold transition-colors">
                  Book Your Shoot (Live)
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-gold transition-colors">
                  Client Love & Reviews
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-gold transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin-dashboard" className="text-gold/90 hover:text-gold font-medium transition-colors">
                  Studio Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 4: CONTACT & STUDIO */}
          <div>
            <h4 className="font-serif text-white text-base uppercase tracking-widest mb-4 border-l-2 border-gold pl-3">
              Studio Concierge
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>
                  Abhishinde Photography Studio, Koregaon Park, Pune • Nashik • Mumbai, Maharashtra
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <a href="tel:+917822053169" className="hover:text-white transition-colors font-medium">
                  +91 7822053169 (Abhi Shinde)
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-400 shrink-0" />
                <a
                  href="https://wa.me/917822053169?text=Hello%20Abhi%20Shinde%2C%20I%20would%20like%20to%20enquire%20about%20your%20wedding%20photography%20packages."
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-400 transition-colors font-medium"
                >
                  WhatsApp: +91 7822053169
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a href="mailto:abhishinde.photography@gmail.com" className="hover:text-white transition-colors">
                  abhishinde.photography@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-muted-text/80 gap-4">
          <p>© {new Date().getFullYear()} ABHISHINDE PHOTOGRAPHY. All rights reserved. • Nashik • Pune • Mumbai</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-gold fill-gold" /> for eternal visual storytelling.
          </p>
        </div>
      </div>
    </footer>
  );
}
