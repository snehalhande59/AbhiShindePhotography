'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Instagram, Send, CheckCircle2, Clock, AlertCircle, Copy, Check } from 'lucide-react';
import { db } from '@/lib/store';
import InteractiveDatePicker from '@/components/InteractiveDatePicker';

export default function ContactPage() {
  const teamMembers = db.getTeamMembers();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Wedding Package - Both Side (₹1,55,000)');
  const [preferredPhotographerId, setPreferredPhotographerId] = useState('any');
  const [preferredDate, setPreferredDate] = useState('');
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEnquiry, setSubmittedEnquiry] = useState<any | null>(null);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanMobile = phone.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!preferredDate) {
      setErrorMessage('Please select your preferred shoot date using the calendar.');
      return;
    }

    const selectedPhotographer = teamMembers.find((t) => t.id === preferredPhotographerId);

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          mobileNumber: phone.startsWith('+') ? phone : `+91 ${cleanMobile}`,
          whatsappNumber: phone.startsWith('+') ? phone : `+91 ${cleanMobile}`,
          email: email.trim(),
          photographyCategory: service.includes('Wedding') ? 'Wedding Photography' : 'Event Photography',
          selectedService: service,
          selectedPackage: service,
          packagePriceSnapshot: service.includes('1,55,000') ? 155000 : 85000,
          preferredPhotographerId: preferredPhotographerId !== 'any' ? preferredPhotographerId : undefined,
          preferredPhotographerName: selectedPhotographer ? `${selectedPhotographer.name} (${selectedPhotographer.role})` : 'Any Available Photographer',
          preferredShootDate: preferredDate,
          preferredShootTime: 'Full Day',
          shootLocation: location || 'Pune, Maharashtra',
          eventDate: preferredDate,
          eventType: 'Celebration',
          additionalRequirements: message,
          whatsappConsent: true,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSubmittedEnquiry(json.data);
      } else {
        setErrorMessage(json.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error submitting enquiry. Please connect on WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">Get In Touch</span>
          <h1 className="font-serif text-4xl sm:text-6xl text-foreground font-bold uppercase mt-2 mb-4">
            Connect With The Studio
          </h1>
          <p className="text-sm md:text-base text-muted-text font-light leading-relaxed">
            Whether you are planning a royal multi-day wedding, a coastal pre-wedding film, or want custom dates, Abhi Shinde and the studio concierge are ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          {/* CONTACT INFO & DIRECT CHANNELS */}
          <div className="space-y-8">
            <div className="bg-card-bg border border-border rounded-3xl p-8 space-y-6 shadow-xl">
              <h3 className="font-serif text-2xl text-foreground">Studio Address & Concierge</h3>

              <div className="space-y-4 text-sm text-muted-text">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-bg border border-border flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block">Main Studio Gallery:</strong>
                    <span>ABHISHINDE PHOTOGRAPHY Studio, Sinnar / Nashik, Pune & Mumbai, Maharashtra 422103</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-bg border border-border flex items-center justify-center text-gold shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block">Official Contact (Abhi Shinde):</strong>
                    <a href="tel:+917822053169" className="hover:text-gold transition-colors font-mono font-bold text-foreground">
                      +91 78220 53169
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-bg border border-border flex items-center justify-center text-gold shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block">Email Inquiries:</strong>
                    <a href="mailto:abhishinde.photography@gmail.com" className="hover:text-gold transition-colors">
                      abhishinde.photography@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-bg border border-border flex items-center justify-center text-gold shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-foreground block">Studio Hours:</strong>
                    <span>Tuesday – Sunday: 10:00 AM – 08:00 PM (Prior Appointment Only)</span>
                  </div>
                </div>
              </div>

              {/* Direct Actions & Two Instagrams */}
              <div className="pt-4 border-t border-border space-y-3">
                <a
                  href="https://wa.me/917822053169?text=Hello%20Abhi%20Shinde%2C%20I%20would%20like%20to%20enquire%20about%20your%20wedding%20photography."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Directly (+91 78220 53169)</span>
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://www.instagram.com/abhishinde_photography/"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-secondary-bg hover:bg-gold hover:text-black border border-border text-white font-semibold py-3 rounded-xl text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@abhishinde_photography</span>
                  </a>
                  <a
                    href="https://www.instagram.com/abhishinde_06/"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-secondary-bg hover:bg-gold hover:text-black border border-border text-white font-semibold py-3 rounded-xl text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@abhishinde_06</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-3xl overflow-hidden border border-border aspect-[16/10] shadow-xl relative">
              <iframe
                title="Studio Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.784400584285!2d73.89622547519207!3d18.53860478255767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c101d248b9f1%3A0x6cf20a3249052b61!2sKoregaon%20Park%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* CONTACT INQUIRY FORM */}
          <div className="bg-card-bg border border-border rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-gold font-bold">Fast Concierge Response</span>
              <h3 className="font-serif text-2xl md:text-3xl text-white mt-1">Send An Inquiry</h3>
              <p className="text-xs text-muted-text mt-1">
                We respond within 2-4 hours with a custom moodboard, brochure, and date availability.
              </p>
            </div>

            {submittedEnquiry ? (
              <div className="p-8 rounded-2xl bg-green-500/10 border border-green-500/40 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                <h4 className="font-serif text-2xl text-foreground font-bold">Enquiry Registered</h4>
                <div className="inline-block px-3 py-1 rounded bg-black/60 border border-gold/40 text-gold font-mono text-xs">
                  ID: {submittedEnquiry.enquiryId}
                </div>
                <p className="text-xs text-muted-text max-w-sm mx-auto">
                  Thank you, <strong className="text-white">{submittedEnquiry.customerName}</strong>! Abhi Shinde has received your shoot enquiry.
                </p>
                <div className="pt-2 flex flex-col gap-3">
                  <a
                    href={submittedEnquiry.notificationStatus?.adminWhatsAppUrl || submittedEnquiry.whatsappUrl || `https://wa.me/917822053169?text=Hello%20Abhi%20Shinde%2C%20my%20enquiry%20is%20${submittedEnquiry.enquiryId}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-green-600 hover:bg-green-500 text-foreground font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Chat Directly (+91 7822053169)</span>
                  </a>

                  {submittedEnquiry.notificationStatus?.adminMessageText && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(submittedEnquiry.notificationStatus.adminMessageText);
                        setCopiedMsg(true);
                        setTimeout(() => setCopiedMsg(false), 3000);
                      }}
                      className="w-full bg-secondary-bg hover:bg-zinc-800 border border-border text-white text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                      {copiedMsg ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gold" />}
                      <span>{copiedMsg ? 'Copied to Clipboard!' : 'Copy Formatted WhatsApp Message'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSubmittedEnquiry(null);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setPreferredDate('');
                      setMessage('');
                    }}
                    className="text-xs text-gold underline pt-1"
                  >
                    Submit another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvi Deshmukh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-muted-text">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="tanvi@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-muted-text">WhatsApp / Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 7822053169"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text">Interested Service / Package</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                  >
                    <option value="Wedding Package - Both Side (₹1,55,000)">Wedding Package - Both Side (₹1,55,000) [Official Signature]</option>
                    <option value="Wedding Photography (General)">Wedding Photography (General)</option>
                    <option value="Pre-Wedding Photography">Pre-Wedding Photography</option>
                    <option value="Cinematic Videography & Films">Cinematic Videography & Films</option>
                    <option value="Drone & Aerial Coverage">Drone & Aerial Coverage</option>
                    <option value="Fashion & Model Portfolio">Fashion & Model Portfolio</option>
                    <option value="Maternity & Newborn">Maternity & Newborn</option>
                    <option value="Corporate / Event">Corporate / Event</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text">Preferred Photographer</label>
                  <select
                    value={preferredPhotographerId}
                    onChange={(e) => setPreferredPhotographerId(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                  >
                    <option value="any">⭐ Any Available Master Photographer (Studio Curated)</option>
                    {teamMembers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.role}
                      </option>
                    ))}
                  </select>
                </div>

                <InteractiveDatePicker
                  label="Preferred Shoot Date"
                  selectedDate={preferredDate}
                  onSelectDate={setPreferredDate}
                  required
                />

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text">Shoot Location / Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune, Nashik, Mumbai, Fort JadhavGADH..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text">Event Details & Requirements</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your event dates, venue location, estimated guest count..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl p-4 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,164,109,0.3)] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting to Studio...' : 'Send Inquiry To Abhi Shinde'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
