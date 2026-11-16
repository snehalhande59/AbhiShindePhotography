'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  X, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Users, 
  Camera, 
  FileText,
  AlertCircle,
  Video,
  Upload,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Info
} from 'lucide-react';
import { db } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import InteractiveDatePicker from '@/components/InteractiveDatePicker';
import StudioLogo from '@/components/StudioLogo';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  defaultService?: string;
  defaultPackage?: string;
}

const CATEGORIES = [
  'Wedding Photography',
  'Pre-Wedding Photography',
  'Engagement Photography',
  'Birthday Photography',
  'Event Photography',
  'Fashion Photography',
  'Model Portfolio',
  'Maternity Photography',
  'Newborn Photography',
  'Portrait Photography',
  'Product Photography',
  'Corporate Photography',
  'Cinematic Videography',
  'Drone Photography',
  'Other',
];

const COUNTRY_CODES = [
  { code: '+91', country: 'India (IN)' },
  { code: '+1', country: 'USA/Canada (US/CA)' },
  { code: '+44', country: 'United Kingdom (UK)' },
  { code: '+971', country: 'United Arab Emirates (UAE)' },
  { code: '+61', country: 'Australia (AU)' },
  { code: '+65', country: 'Singapore (SG)' },
];

const SHOOT_TIMES = [
  'Morning',
  'Afternoon',
  'Evening',
  'Full Day',
  'Flexible',
];

const SHOOT_DURATIONS = [
  'Half Day (4-5 Hours)',
  'Full Day (8-10 Hours)',
  '2 Days (Multi-Function)',
  '3+ Days (Royal Wedding)',
  'Custom Duration',
];

export default function EnquiryModal({
  isOpen,
  onClose,
  defaultCategory = 'Wedding Photography',
  defaultService = 'Wedding Photography',
  defaultPackage = 'WEDDING PACKAGE - BOTH SIDE (₹1,55,000)',
}: EnquiryModalProps) {
  const teamMembers = db.getTeamMembers();
  const packages = db.getPackages();

  // Form State: Personal Information
  const [customerName, setCustomerName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [email, setEmail] = useState('');

  // Form State: Photography Requirements
  const [photographyCategory, setPhotographyCategory] = useState<string>(defaultCategory);
  
  // Photographer Selection
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string>('any');
  
  // Package Selection
  const [selectedPackageTitle, setSelectedPackageTitle] = useState<string>(defaultPackage);
  
  // Calendar & Date State
  const [preferredShootDate, setPreferredShootDate] = useState('');
  const [preferredShootTime, setPreferredShootTime] = useState('Full Day');
  const [differentEventDate, setDifferentEventDate] = useState(false);
  const [eventDate, setEventDate] = useState('');

  // Location Information
  const [shootCity, setShootCity] = useState('Pune');
  const [shootArea, setShootArea] = useState('');
  const [venueName, setVenueName] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  // Category-specific Information
  const [eventType, setEventType] = useState('Wedding Celebration');
  const [guestCount, setGuestCount] = useState('');
  const [shootDuration, setShootDuration] = useState('Full Day (8-10 Hours)');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Requirements & References
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState('');
  const [referenceVideo, setReferenceVideo] = useState('');
  const [whatsappConsent, setWhatsappConsent] = useState(true);

  // Submission & UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEnquiry, setSubmittedEnquiry] = useState<any | null>(null);
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Sync props when opening
  useEffect(() => {
    if (isOpen) {
      if (defaultCategory) setPhotographyCategory(defaultCategory);
      if (defaultPackage) setSelectedPackageTitle(defaultPackage);
      setSubmittedEnquiry(null);
      setErrorMessage('');
      setCopiedMsg(false);
    }
  }, [isOpen, defaultCategory, defaultPackage]);

  if (!isOpen) return null;

  // Selected Photographer Lookup
  const selectedPhotographer = teamMembers.find((t) => t.id === selectedPhotographerId);

  // Selected Package Lookup & Price Snapshot
  const matchedPackage = packages.find(
    (p) => p.title.toLowerCase() === selectedPackageTitle.toLowerCase() || p.id === selectedPackageTitle
  );
  const currentPackagePrice = matchedPackage 
    ? matchedPackage.price 
    : (selectedPackageTitle.includes('1,55,000') ? 155000 : 85000);

  const handleMobileChange = (val: string) => {
    setMobileNumber(val);
    if (sameAsMobile) {
      setWhatsappNumber(val);
    }
  };

  const handleAddReferenceImage = () => {
    if (newImageInput.trim()) {
      setReferenceImages([...referenceImages, newImageInput.trim()]);
      setNewImageInput('');
    }
  };

  const handleRemoveReferenceImage = (idx: number) => {
    setReferenceImages(referenceImages.filter((_, i) => i !== idx));
  };

  // Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanMobile = mobileNumber.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    const cleanWa = (sameAsMobile ? cleanMobile : whatsappNumber.replace(/[^0-9]/g, ''));
    if (cleanWa.length < 10) {
      setErrorMessage('Please enter a valid WhatsApp number.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!preferredShootDate) {
      setErrorMessage('Please choose your preferred shoot date using the calendar.');
      return;
    }
    if (!shootCity.trim()) {
      setErrorMessage('Please select or specify your shoot city.');
      return;
    }

    // Construct full address string
    const combinedLocation = [
      venueName ? `Venue: ${venueName}` : '',
      shootArea ? `Area: ${shootArea}` : '',
      shootCity ? `City: ${shootCity}` : '',
      fullAddress ? `Address: ${fullAddress}` : '',
    ].filter(Boolean).join(', ') || shootCity;

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        countryCode,
        mobileNumber: `${countryCode} ${cleanMobile}`,
        whatsappNumber: `${countryCode} ${cleanWa}`,
        email: email.trim(),
        photographyCategory,
        selectedService: photographyCategory,
        preferredPhotographerId: selectedPhotographerId !== 'any' ? selectedPhotographerId : undefined,
        preferredPhotographerName: selectedPhotographer ? `${selectedPhotographer.name} (${selectedPhotographer.role})` : 'Any Available Photographer',
        preferredPhotographerPhoto: selectedPhotographer?.image,
        selectedPackage: matchedPackage ? matchedPackage.title : selectedPackageTitle,
        packagePriceSnapshot: currentPackagePrice,
        preferredShootDate,
        preferredShootTime,
        eventDate: differentEventDate && eventDate ? eventDate : preferredShootDate,
        shootLocation: combinedLocation,
        shootCity,
        shootArea,
        venueName,
        eventType,
        guestCount: guestCount ? Number(guestCount) : undefined,
        shootDuration,
        specialInstructions,
        additionalRequirements,
        referenceImages,
        referenceVideo,
        whatsappConsent,
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success && json.data) {
        setSubmittedEnquiry(json.data);
      } else {
        setErrorMessage(json.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Network error submitting enquiry. Please connect directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-card-bg via-secondary-bg to-card-bg border border-gold/50 rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto my-auto text-foreground">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-secondary-bg hover:bg-gold hover:text-black border border-border flex items-center justify-center text-muted-text transition-all z-10"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="border-b border-border pb-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <StudioLogo size="sm" showTagline={false} />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-[11px] uppercase tracking-widest font-semibold self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Studio Booking Concierge</span>
            </div>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-foreground font-bold uppercase mt-3">
            Client Photography Enquiry
          </h2>
          <p className="text-xs sm:text-sm text-muted-text mt-1 max-w-2xl font-light">
            Fill in your celebration details below. Every enquiry receives direct personal attention from <strong className="text-foreground">Abhi Shinde</strong> with date confirmation, custom moodboards, and rate cards.
          </p>
        </div>

        {/* ========================================================== */}
        {/* SECTION I: CONFIRMATION SUCCESS SCREEN (POST-SUBMIT)       */}
        {/* ========================================================== */}
        {submittedEnquiry ? (
          <div className="space-y-6 py-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto text-gold shadow-[0_0_30px_rgba(197,164,109,0.4)] animate-bounce">
              <CheckCircle2 className="w-10 h-10 fill-gold text-black" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold font-bold">
                ENQUIRY REGISTERED SUCCESSFULLY
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-foreground font-bold">
                THANK YOU FOR CHOOSING ABHISHINDE PHOTOGRAPHY
              </h3>
              <p className="text-sm text-muted-text max-w-md mx-auto">
                Your enquiry has been successfully saved to our studio database.
              </p>
            </div>

            {/* ENQUIRY RECEIPT CARD */}
            <div className="max-w-lg mx-auto bg-black/60 border border-gold/40 rounded-2xl p-6 text-left space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-xs text-muted-text uppercase tracking-wider">Enquiry Reference ID</span>
                <span className="font-mono text-base text-gold font-bold tracking-wider">
                  {submittedEnquiry.enquiryId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-text">Client Name</span>
                <span className="text-foreground font-medium">{submittedEnquiry.customerName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-text">Photography Category</span>
                <span className="text-foreground font-medium">{submittedEnquiry.photographyCategory}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-text">Preferred Photographer</span>
                <span className="text-gold font-medium">{submittedEnquiry.preferredPhotographerName || 'Any Available Photographer'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-text">Selected Package</span>
                <span className="text-foreground font-medium">{submittedEnquiry.selectedPackage}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-text">Package Price Snapshot</span>
                <span className="text-gold font-bold">{formatINR(submittedEnquiry.packagePriceSnapshot)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-text">Requested Shoot Date</span>
                <span className="text-foreground font-medium">{submittedEnquiry.preferredShootDate} ({submittedEnquiry.preferredShootTime})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-text">Shoot Location</span>
                <span className="text-foreground font-medium">{submittedEnquiry.shootLocation}</span>
              </div>
              <div className="pt-2 text-[11px] text-zinc-400 border-t border-border italic">
                Enquiry Received: Your enquiry has been received and saved. Booking will be officially confirmed after studio review and approval by Abhi Shinde (+91 7822053169).
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="max-w-lg mx-auto flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={submittedEnquiry.notificationStatus?.adminWhatsAppUrl || `https://wa.me/917822053169`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Chat Directly</span>
              </a>

              {submittedEnquiry.notificationStatus?.adminMessageText && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(submittedEnquiry.notificationStatus.adminMessageText)}
                  className="bg-card-bg hover:bg-zinc-800 border border-border text-foreground text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {copiedMsg ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gold" />}
                  <span>{copiedMsg ? 'Message Copied!' : 'Copy WhatsApp Message'}</span>
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-muted-text hover:text-foreground underline"
              >
                Done and return to website
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================== */
          /* FORM BODY                                                  */
          /* ========================================================== */
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* A. PERSONAL INFORMATION                              */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-border pb-2">
                <User className="w-4 h-4" />
                <span>A. Personal & Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvi Deshmukh / Aditya Shinde"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tanvi.deshmukh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Phone & Country Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-secondary-bg border border-border rounded-xl px-2.5 py-3 text-xs text-gold font-bold focus:outline-none focus:border-gold"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-zinc-900 text-foreground">
                          {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 7822053169"
                      value={mobileNumber}
                      onChange={(e) => handleMobileChange(e.target.value)}
                      className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                      WhatsApp Number <span className="text-red-400">*</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-gold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sameAsMobile}
                        onChange={(e) => {
                          setSameAsMobile(e.target.checked);
                          if (e.target.checked) setWhatsappNumber(mobileNumber);
                        }}
                        className="rounded border-border accent-gold"
                      />
                      <span>Same as Mobile</span>
                    </label>
                  </div>
                  <input
                    type="tel"
                    required
                    disabled={sameAsMobile}
                    placeholder="e.g. 7822053169"
                    value={sameAsMobile ? mobileNumber : whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold disabled:opacity-70"
                  />
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* B. PHOTOGRAPHY CATEGORY & REQUIREMENTS               */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-border pb-2">
                <Camera className="w-4 h-4" />
                <span>B. Photography Category</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                  Select Shoot Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={photographyCategory}
                  onChange={(e) => setPhotographyCategory(e.target.value)}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-900 text-foreground">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* C. PREFERRED PHOTOGRAPHER SELECTION                  */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-border pb-2">
                <User className="w-4 h-4" />
                <span>C. Preferred Photographer Selection</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                  Preferred Photographer
                </label>
                <select
                  value={selectedPhotographerId}
                  onChange={(e) => setSelectedPhotographerId(e.target.value)}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                >
                  <option value="any" className="bg-zinc-900 text-foreground">
                    ⭐ Any Available Master Photographer (Studio Curated)
                  </option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id} className="bg-zinc-900 text-foreground">
                      {member.name} — {member.role} ({member.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Photographer Card Preview */}
              {selectedPhotographer && (
                <div className="p-4 rounded-2xl bg-black/50 border border-gold/40 flex items-center gap-4 animate-in fade-in">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gold shrink-0">
                    <Image
                      src={selectedPhotographer.id === 'tm-1' ? '/images/abhi-shinde-portrait.jpg' : selectedPhotographer.image}
                      alt={selectedPhotographer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-serif font-bold text-foreground">{selectedPhotographer.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] font-semibold">
                        Available for Shoots
                      </span>
                    </div>
                    <p className="text-xs text-gold mt-0.5">{selectedPhotographer.role}</p>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{selectedPhotographer.specialization}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* D. PACKAGE SELECTION                                 */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-border pb-2">
                <Sparkles className="w-4 h-4" />
                <span>D. Package Selection & Investment</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                  Curated Packages <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedPackageTitle}
                  onChange={(e) => setSelectedPackageTitle(e.target.value)}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.title} className="bg-zinc-900 text-foreground">
                      {pkg.title} — {formatINR(pkg.price)} ({pkg.coverage || pkg.duration})
                    </option>
                  ))}
                  <option value="Custom Bespoke Package" className="bg-zinc-900 text-foreground">
                    Custom Bespoke Package (Price on Discussion)
                  </option>
                </select>
              </div>

              {/* Package Details & Price Snapshot Banner */}
              {matchedPackage && (
                <div className="p-4 rounded-2xl bg-black/50 border border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold font-bold block">
                      {matchedPackage.badge || 'SELECTED PACKAGE'}
                    </span>
                    <h4 className="font-serif text-lg text-foreground font-bold">{matchedPackage.title}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{matchedPackage.subtitle || matchedPackage.coverage}</p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] text-muted-text uppercase block">Actual Rate</span>
                    <div className="font-serif text-2xl text-gold font-bold">{formatINR(matchedPackage.price)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* E. EXACT INTERACTIVE CALENDAR DATE PICKER            */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-border pb-2">
                <CalendarIcon className="w-4 h-4" />
                <span>E. Shoot Date & Event Schedule</span>
              </h3>

              {/* Main Shoot Date with Interactive Calendar Component */}
              <InteractiveDatePicker
                label="Preferred Shoot Date"
                selectedDate={preferredShootDate}
                onSelectDate={setPreferredShootDate}
                required
                helperText="Click to open the interactive calendar. Green dots indicate dates with open crew availability."
              />

              {/* Shoot Time Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span>Preferred Shoot Time</span>
                  </label>
                  <select
                    value={preferredShootTime}
                    onChange={(e) => setPreferredShootTime(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                  >
                    {SHOOT_TIMES.map((time) => (
                      <option key={time} value={time} className="bg-zinc-900 text-foreground">
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span>Estimated Shoot Duration</span>
                  </label>
                  <select
                    value={shootDuration}
                    onChange={(e) => setShootDuration(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                  >
                    {SHOOT_DURATIONS.map((dur) => (
                      <option key={dur} value={dur} className="bg-zinc-900 text-foreground">
                        {dur}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggle for Different Event Date */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={differentEventDate}
                    onChange={(e) => setDifferentEventDate(e.target.checked)}
                    className="rounded border-border accent-gold"
                  />
                  <span>Event Date is different from Requested Shoot Date (e.g. Pre-wedding before wedding day)</span>
                </label>

                {differentEventDate && (
                  <div className="mt-3">
                    <InteractiveDatePicker
                      label="Event / Ceremony Date"
                      selectedDate={eventDate}
                      onSelectDate={setEventDate}
                      helperText="Specify the actual wedding ceremony or grand reception date."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* F. SHOOT LOCATION & EVENT INFORMATION                */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-border pb-2">
                <MapPin className="w-4 h-4" />
                <span>F. Shoot Location & Event Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                    City <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={shootCity}
                    onChange={(e) => setShootCity(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                  >
                    <option value="Pune">Pune, Maharashtra</option>
                    <option value="Nashik">Nashik, Maharashtra</option>
                    <option value="Mumbai">Mumbai, Maharashtra</option>
                    <option value="Alibaug">Alibaug / Coastal</option>
                    <option value="Goa">Goa</option>
                    <option value="Kolhapur">Kolhapur</option>
                    <option value="Other">Other Destination</option>
                  </select>
                </div>

                {/* Area / Locality */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Koregaon Park, Gangapur Rd..."
                    value={shootArea}
                    onChange={(e) => setShootArea(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Venue Name */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                    Venue / Resort Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fort JadhavGADH / Hotel Radisson"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                  Full Venue Address / Landmarks
                </label>
                <input
                  type="text"
                  placeholder="Detailed address with gate number, hall name, or google maps landmark..."
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                />
              </div>

              {/* Additional Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                    Event Type / Ceremonies
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Engagement + Haldi + Wedding Pheras"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                    Estimated Number of Guests
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* G. ADDITIONAL REQUIREMENTS & REFERENCES              */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-border pb-2">
                <FileText className="w-4 h-4" />
                <span>G. Additional Requirements & Inspiration</span>
              </h3>

              {/* Requirements Textarea */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-text font-medium">
                  Tell Us About Your Photography Requirements
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your event, photography style, special moments, preferred shots and any additional requirements..."
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  className="w-full bg-secondary-bg border border-border rounded-xl p-4 text-xs text-foreground focus:outline-none focus:border-gold"
                />
              </div>

              {/* Upload Reference Images / Inspiration Links */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-text font-medium flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-gold" />
                  <span>Upload Reference Images / Inspiration Photo URLs (Cloudinary / Pinterest / Instagram)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image or Pinterest moodboard link (https://...)"
                    value={newImageInput}
                    onChange={(e) => setNewImageInput(e.target.value)}
                    className="flex-1 bg-secondary-bg border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={handleAddReferenceImage}
                    className="px-4 py-2.5 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-hover transition-colors shrink-0"
                  >
                    Add Link
                  </button>
                </div>

                {referenceImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {referenceImages.map((img, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-gold/40 text-[11px] text-zinc-300"
                      >
                        <span className="truncate max-w-[200px]">{img}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveReferenceImage(i)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Reference Video Link */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-muted-text font-medium flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-gold" />
                  <span>Optional Reference Video Link (YouTube / Vimeo / Reel)</span>
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://youtu.be/48yulvK82GA"
                  value={referenceVideo}
                  onChange={(e) => setReferenceVideo(e.target.value)}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* H. WHATSAPP CONSENT                                  */}
            {/* ---------------------------------------------------- */}
            <div className="p-4 rounded-2xl bg-secondary-bg/80 border border-border flex items-start gap-3">
              <input
                type="checkbox"
                id="whatsapp-consent"
                checked={whatsappConsent}
                onChange={(e) => setWhatsappConsent(e.target.checked)}
                className="mt-1 rounded border-border accent-gold w-4 h-4 cursor-pointer"
              />
              <label htmlFor="whatsapp-consent" className="text-xs text-zinc-300 leading-relaxed cursor-pointer">
                <strong>I agree to receive enquiry updates and booking-related communication through WhatsApp.</strong>
                <span className="block text-[11px] text-zinc-400 mt-0.5">
                  Abhi Shinde will review date availability and share customized packages directly to your WhatsApp.
                </span>
              </label>
            </div>

            {/* ---------------------------------------------------- */}
            {/* I. SUBMIT BUTTON                                     */}
            {/* ---------------------------------------------------- */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#181818] hover:bg-gold text-white font-bold uppercase tracking-widest text-xs py-4 px-8 rounded-full transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying & Submitting to Studio Database...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT PHOTOGRAPHY ENQUIRY</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-zinc-400 mt-3">
                Direct Submission to Official Abhishinde Photography Concierge (+91 7822053169)
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
