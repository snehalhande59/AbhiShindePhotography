'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  CreditCard, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { Package, Service } from '@/types';

interface BookingWizardProps {
  initialServiceId?: string;
  initialPackageId?: string;
}

export default function BookingWizard({ initialServiceId, initialPackageId }: BookingWizardProps) {
  const services = db.getServices();
  const packages = db.getPackages();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(
    services.find((s) => s.id === initialServiceId) || services[0]
  );
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(
    packages.find((p) => p.id === initialPackageId) || packages[0]
  );
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('09:00 AM');
  const [eventLocation, setEventLocation] = useState('');
  
  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');

  // Status & Availability
  const [dateAvailable, setDateAvailable] = useState<boolean | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);

  // Check Availability
  const handleDateChange = (dateStr: string) => {
    setEventDate(dateStr);
    if (!dateStr) {
      setDateAvailable(null);
      return;
    }
    const check = db.checkDateAvailability(dateStr);
    setDateAvailable(check.available);
    if (check.available) {
      setAvailabilityMessage('Date is open! Our master photography crew is available.');
    } else {
      setAvailabilityMessage('Notice: The crew is already booked for this date. Please select another date or contact Abhi directly.');
    }
  };

  // Advance Calculation
  const totalAmount = selectedPackage ? selectedPackage.price : 0;
  const advancePercent = selectedPackage ? selectedPackage.paymentTerms.bookingAdvancePercent : 30;
  const advanceAmount = Math.round((totalAmount * advancePercent) / 100);

  // Handle Submission & Razorpay Mock
  const handleSubmitBooking = async () => {
    setIsSubmitting(true);

    try {
      // Simulate Razorpay Gateway and store in state
      const bookingPayload = {
        clientName: customerName,
        clientEmail: customerEmail,
        clientPhone: customerPhone,
        serviceId: selectedService?.id || '',
        serviceName: selectedService?.name || '',
        packageId: selectedPackage?.id || '',
        packageName: selectedPackage?.title || '',
        packagePriceSnapshot: totalAmount,
        requestedShootDate: eventDate,
        confirmedShootDate: eventDate,
        eventDate,
        eventTime,
        eventLocation,
        totalAmount,
        advanceAmount,
        paidAmount: advanceAmount,
        paymentStatus: 'Advance Paid' as const,
        razorpayOrderId: `order_${Math.random().toString(36).substring(2, 11)}`,
        razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 11)}`,
        bookingStatus: 'Confirmed' as const,
        assignedPhotographer: 'Abhi Shinde Production Team',
        additionalNotes: `${additionalNotes} | Ref: ${referenceUrl}`,
      };

      const newBooking = db.createBooking(bookingPayload);

      // Persist to API route
      try {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload),
        });
      } catch (e) {
        console.warn('API booking sync note:', e);
      }

      setConfirmedBookingRef(newBooking.bookingRef);
      setPaymentDone(true);
      setCurrentStep(8);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C5A46D', '#ffffff', '#ffd700'],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    'Service',
    'Package',
    'Date & Time',
    'Location',
    'Your Details',
    'References',
    'Review',
    'Payment & Confirm',
  ];

  return (
    <div className="w-full max-w-5xl mx-auto bg-card-bg/90 border border-border rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl">
      {/* STEP PROGRESS BAR */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 overflow-x-auto pb-2 scrollbar-none">
          {stepsList.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            return (
              <div key={step} className="flex items-center gap-2 shrink-0 px-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-gold text-black'
                      : isCurrent
                      ? 'bg-white text-black ring-4 ring-gold/30'
                      : 'bg-secondary-bg text-muted-text border border-border'
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span
                  className={`text-xs uppercase tracking-wider hidden md:inline ${
                    isCurrent ? 'text-gold font-semibold' : 'text-muted-text'
                  }`}
                >
                  {step}
                </span>
                {idx < stepsList.length - 1 && (
                  <span className="w-4 md:w-8 h-[1px] bg-border mx-1" />
                )}
              </div>
            );
          })}
        </div>
        <div className="w-full h-1 bg-secondary-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-300"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: SERVICE */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">Step 1 of 8</span>
            <h3 className="text-2xl font-serif text-white">Select Photography Service</h3>
            <p className="text-sm text-muted-text">Choose the genre for your upcoming shoot or celebration.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => {
              const isSelected = selectedService?.id === svc.id;
              return (
                <div
                  key={svc.id}
                  onClick={() => setSelectedService(svc)}
                  className={`relative p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-gold bg-gold/10 shadow-[0_0_20px_rgba(197,164,109,0.2)]'
                      : 'border-border bg-secondary-bg/60 hover:border-gold/40'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-gold">
                      <CheckCircle2 className="w-5 h-5 fill-gold text-black" />
                    </div>
                  )}
                  <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
                    <Image src={svc.coverImage} alt={svc.name} fill className="object-cover" />
                  </div>
                  <h4 className="font-serif text-lg text-white">{svc.name}</h4>
                  <p className="text-xs text-muted-text line-clamp-2 mt-1">{svc.shortDescription}</p>
                  <div className="mt-3 text-xs text-gold font-semibold">
                    Starting from {formatINR(svc.startingPrice)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedService}
              className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-semibold px-8 py-3 rounded-xl transition-all"
            >
              <span>Continue to Packages</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PACKAGE */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">Step 2 of 8</span>
            <h3 className="text-2xl font-serif text-white">Select Shoot Package</h3>
            <p className="text-sm text-muted-text">
              Select our official Abhishinde signature package or choose a custom configuration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => {
              const isSelected = selectedPackage?.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    pkg.isSignature
                      ? isSelected
                        ? 'border-gold ring-2 ring-gold bg-gold/15'
                        : 'border-gold/60 bg-gradient-to-br from-card-bg to-gold/5'
                      : isSelected
                      ? 'border-gold bg-gold/10'
                      : 'border-border bg-secondary-bg hover:border-gold/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/40">
                        {pkg.badge || 'Package'}
                      </span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 fill-gold text-black" />}
                    </div>

                    <h4 className="font-serif text-xl text-white font-bold">{pkg.title}</h4>
                    {pkg.subtitle && <p className="text-xs text-gold/90 mb-3">{pkg.subtitle}</p>}

                    <div className="text-2xl font-serif text-gold font-bold mb-4">
                      {formatINR(pkg.price)}
                    </div>

                    <div className="text-xs text-muted-text mb-3">
                      <strong>Coverage:</strong> {pkg.coverage}
                    </div>

                    {pkg.eventsCovered && (
                      <div className="mb-4">
                        <span className="text-[11px] uppercase tracking-wider text-muted-text block mb-1">
                          Events Included:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {pkg.eventsCovered.map((evt) => (
                            <span key={evt} className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-border text-white">
                              {evt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/80 text-xs text-gold flex items-center justify-between">
                    <span>Advance Payment (30%): {formatINR(Math.round(pkg.price * 0.3))}</span>
                    <span className="underline">Select This</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 border border-border text-white px-6 py-3 rounded-xl hover:bg-secondary-bg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!selectedPackage}
              className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-semibold px-8 py-3 rounded-xl transition-all"
            >
              <span>Continue to Schedule</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DATE & TIME */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">Step 3 of 8</span>
            <h3 className="text-2xl font-serif text-white">Select Event Date & Time</h3>
            <p className="text-sm text-muted-text">
              Real-time studio calendar verification prevents double booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-text flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <span>Preferred Shoot Date</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-text flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>Crew Call Time</span>
              </label>
              <select
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              >
                <option value="06:00 AM">06:00 AM (Sunrise & Muhurat)</option>
                <option value="09:00 AM">09:00 AM (Morning Ceremonies)</option>
                <option value="01:00 PM">01:00 PM (Afternoon)</option>
                <option value="05:00 PM">05:00 PM (Sunset / Sangeet / Reception)</option>
                <option value="Full Day (Multiple Shifts)">Full Day (Multiple Shifts)</option>
              </select>
            </div>
          </div>

          {dateAvailable !== null && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                dateAvailable
                  ? 'border-green-500/40 bg-green-500/10 text-green-300'
                  : 'border-red-500/40 bg-red-500/10 text-red-300'
              }`}
            >
              {dateAvailable ? (
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="text-sm">{availabilityMessage}</div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 border border-border text-white px-6 py-3 rounded-xl hover:bg-secondary-bg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              disabled={!eventDate || dateAvailable === false}
              className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-semibold px-8 py-3 rounded-xl transition-all disabled:opacity-40"
            >
              <span>Continue to Location</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: LOCATION */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">Step 4 of 8</span>
            <h3 className="text-2xl font-serif text-white">Event & Shoot Venue</h3>
            <p className="text-sm text-muted-text">
              Where will the celebrations or photography take place?
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-text flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Venue Name, City & State</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Fort JadhavGADH, Pune or Destination Resort, Goa"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="p-4 rounded-xl bg-secondary-bg/60 border border-border text-xs text-muted-text space-y-1">
              <span className="text-white font-medium block">Outstation & Travel Notice:</span>
              <p>For shoots outside Pune city limits, client provides crew lodging and travel logistics or fuel reimbursement as per studio policy.</p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 border border-border text-white px-6 py-3 rounded-xl hover:bg-secondary-bg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              disabled={!eventLocation.trim()}
              className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-semibold px-8 py-3 rounded-xl transition-all disabled:opacity-40"
            >
              <span>Continue to Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CUSTOMER DETAILS */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">Step 5 of 8</span>
            <h3 className="text-2xl font-serif text-white">Customer & Couple Information</h3>
            <p className="text-sm text-muted-text">
              We send your booking contract, confirmation, and invoice to these contacts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-text flex items-center gap-2">
                <User className="w-4 h-4 text-gold" />
                <span>Full Name (Bride / Groom / Contact)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Tanvi Deshmukh & Aditya Shinde"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-text flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                placeholder="e.g. tanvi@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-text flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>WhatsApp / Phone Number</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 7822053169 or +91 78220 53169"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-text flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                <span>Special Instructions or Requirements</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Need 8x12 LED screen set up early for Groom arrival"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-2 border border-border text-white px-6 py-3 rounded-xl hover:bg-secondary-bg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              disabled={!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()}
              className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-semibold px-8 py-3 rounded-xl transition-all disabled:opacity-40"
            >
              <span>Continue to References</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: REFERENCE IMAGES */}
      {currentStep === 6 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">Step 6 of 8</span>
            <h3 className="text-2xl font-serif text-white">Inspiration & Moodboard (Optional)</h3>
            <p className="text-sm text-muted-text">
              Share Pinterest, Instagram, or Google Drive moodboard links for your desired visual style.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-muted-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Moodboard or Instagram Reference Link</span>
            </label>
            <input
              type="url"
              placeholder="https://pinterest.com/... or https://instagram.com/..."
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold"
            />
            <p className="text-xs text-muted-text">
              You can also send high-resolution outfit swatches and stage moodboards via WhatsApp directly to our creative director.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(5)}
              className="flex items-center gap-2 border border-border text-white px-6 py-3 rounded-xl hover:bg-secondary-bg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(7)}
              className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-semibold px-8 py-3 rounded-xl transition-all"
            >
              <span>Review Booking Summary</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: REVIEW */}
      {currentStep === 7 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">Step 7 of 8</span>
            <h3 className="text-2xl font-serif text-white">Review Booking Contract</h3>
            <p className="text-sm text-muted-text">
              Please inspect the booking terms and payment structure before proceeding to secure payment.
            </p>
          </div>

          <div className="bg-secondary-bg rounded-2xl p-6 border border-border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border/80 text-sm">
              <div>
                <span className="text-muted-text text-xs uppercase block">Client Name</span>
                <span className="text-white font-medium">{customerName}</span>
              </div>
              <div>
                <span className="text-muted-text text-xs uppercase block">Contact</span>
                <span className="text-white font-medium">{customerPhone} • {customerEmail}</span>
              </div>
              <div>
                <span className="text-muted-text text-xs uppercase block">Selected Package</span>
                <span className="text-gold font-serif font-bold text-base">{selectedPackage?.title}</span>
              </div>
              <div>
                <span className="text-muted-text text-xs uppercase block">Shoot Date & Call Time</span>
                <span className="text-white font-medium">{eventDate} ({eventTime})</span>
              </div>
              <div>
                <span className="text-muted-text text-xs uppercase block">Venue Location</span>
                <span className="text-white font-medium">{eventLocation}</span>
              </div>
              <div>
                <span className="text-muted-text text-xs uppercase block">Instagram Handle</span>
                <span className="text-gold font-medium">@Abhishinde_photography</span>
              </div>
            </div>

            {/* Payment Schedule breakdown */}
            <div className="bg-card-bg p-4 rounded-xl border border-gold/30 space-y-2">
              <span className="text-xs uppercase tracking-wider text-gold font-bold block">
                Official Payment Schedule Terms
              </span>
              <div className="flex justify-between text-sm py-1 border-b border-border/60">
                <span className="text-muted-text">Total Package Investment:</span>
                <span className="text-white font-serif font-bold text-base">{formatINR(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-border/60 text-gold">
                <span>30% Advance (Due Now to Block Date):</span>
                <span className="font-bold">{formatINR(advanceAmount)}</span>
              </div>
              <div className="flex justify-between text-xs py-1 text-muted-text">
                <span>60% Before Wedding Day:</span>
                <span>{formatINR(Math.round(totalAmount * 0.6))}</span>
              </div>
              <div className="flex justify-between text-xs py-1 text-muted-text">
                <span>Rest 10% Upon Final Deliverables:</span>
                <span>{formatINR(totalAmount - advanceAmount - Math.round(totalAmount * 0.6))}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(6)}
              className="flex items-center gap-2 border border-border text-white px-6 py-3 rounded-xl hover:bg-secondary-bg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSubmitBooking}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-black font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(197,164,109,0.4)]"
            >
              <CreditCard className="w-5 h-5" />
              <span>{isSubmitting ? 'Processing...' : `Pay Advance ${formatINR(advanceAmount)} via Razorpay`}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: CONFIRMATION & RECEIPT */}
      {currentStep === 8 && paymentDone && (
        <div className="text-center py-8 space-y-6">
          <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto text-gold animate-bounce">
            <CheckCircle2 className="w-10 h-10 fill-gold text-black" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-bold">Booking Confirmed</span>
            <h3 className="text-3xl font-serif text-white font-bold mt-1">We Capture Your Forever.</h3>
            <p className="text-sm text-muted-text max-w-lg mx-auto mt-2">
              Thank you, <strong className="text-white">{customerName}</strong>! Your shoot date has been officially locked with Abhi Shinde Photography.
            </p>
          </div>

          {/* RECEIPT CARD */}
          <div className="max-w-md mx-auto bg-secondary-bg border border-gold/40 rounded-2xl p-6 text-left space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-xs text-muted-text uppercase">Booking Reference</span>
              <span className="font-mono text-sm text-gold font-bold">{confirmedBookingRef}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-text">Package</span>
              <span className="text-white font-medium">{selectedPackage?.title}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-text">Shoot Date</span>
              <span className="text-white font-medium">{eventDate} ({eventTime})</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-text">Advance Paid</span>
              <span className="text-green-400 font-bold">{formatINR(advanceAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-text">Payment Gateway</span>
              <span className="text-white font-medium">Razorpay Verified</span>
            </div>
            <div className="pt-2 text-xs text-muted-text italic border-t border-border">
              A digital receipt and shoot planning schedule have been dispatched to {customerEmail} & WhatsApp {customerPhone}.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a
              href={`https://wa.me/917822053169?text=Hello%20Abhi%20Shinde%2C%20I%20have%20booked%20reference%20${confirmedBookingRef}%20for%20${eventDate}.`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <span>Connect on WhatsApp</span>
            </a>
            <button
              onClick={() => window.print()}
              className="border border-border hover:border-gold text-white font-medium px-6 py-3 rounded-xl text-sm"
            >
              Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
