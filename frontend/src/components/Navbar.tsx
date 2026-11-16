'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Menu, X, Shield, CalendarCheck, MessageCircle } from 'lucide-react';
import EnquiryModal from '@/components/EnquiryModal';
import StudioLogo from '@/components/StudioLogo';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Packages', href: '/packages' },
  { name: 'Contact', href: '/contact' },
];

const ALL_MOBILE_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Packages', href: '/packages' },
  { name: 'Films', href: '/films' },
  { name: 'Client Gallery', href: '/client-gallery' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border py-2.5 shadow-sm'
            : 'bg-background/80 backdrop-blur-sm border-b border-border/60 py-3.5 sm:py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* LOGO */}
          <StudioLogo size="md" />

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs uppercase tracking-widest transition-all ${
                    isActive
                      ? 'text-gold font-bold border-b-2 border-gold pb-0.5'
                      : 'text-muted-text hover:text-foreground font-medium'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-800 px-3 py-2 rounded-full border border-green-300 transition-all bg-green-50/80 hover:bg-green-100 font-medium"
              title="Send Direct Enquiry to Abhi Shinde"
            >
              <MessageCircle className="w-3.5 h-3.5 text-green-600" />
              <span>Enquire</span>
            </button>
            <Link
              href="/admin-dashboard"
              className="flex items-center gap-1.5 text-xs text-muted-text hover:text-foreground px-3 py-2 rounded-full border border-border hover:border-gold/40 transition-all font-medium"
              title="Owner Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-gold" />
              <span>Admin</span>
            </Link>
            <Link
              href="/booking"
              className="flex items-center gap-2 bg-[#181818] hover:bg-gold text-white font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-full transition-all shadow-sm"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-gold" />
              <span>Book Shoot</span>
            </Link>
          </div>

          {/* MOBILE MENU TRIGGER */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="bg-green-600 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full uppercase flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Enquiry</span>
            </button>
            <Link
              href="/booking"
              className="bg-gold text-black text-[10px] font-semibold px-2.5 py-1.5 rounded-full uppercase"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white hover:text-gold"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[60px] bg-background/98 backdrop-blur-xl border-t border-border p-6 flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-3.5">
              {ALL_MOBILE_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-serif tracking-wider transition-colors ${
                      isActive ? 'text-gold pl-2 border-l-2 border-gold' : 'text-white/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-6 border-t border-border flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setEnquiryModalOpen(true);
                }}
                className="w-full text-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl uppercase tracking-wider text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Submit Business Enquiry</span>
              </button>
              <Link
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-gold text-black font-bold py-3 rounded-xl uppercase tracking-wider text-xs"
              >
                Book Your Shoot Online
              </Link>
              <Link
                href="/admin-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-card-bg border border-border text-gold font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Abhi Shinde Admin Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </>
  );
}
