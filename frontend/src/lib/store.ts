import { 
  Package, 
  Service, 
  PortfolioItem, 
  TeamMember, 
  Testimonial, 
  Booking, 
  ClientAlbum, 
  Enquiry,
  AdminProfile,
  BookingStatus,
  EnquiryStatus
} from '@/types';
import { 
  INITIAL_PACKAGES, 
  INITIAL_SERVICES, 
  INITIAL_PORTFOLIO, 
  INITIAL_TEAM, 
  INITIAL_TESTIMONIALS, 
  INITIAL_BOOKINGS, 
  INITIAL_CLIENT_ALBUMS, 
  INITIAL_ENQUIRIES,
  OFFICIAL_ADMIN_PROFILE
} from '@/data/mockData';

class DataStore {
  private adminProfile: AdminProfile = { ...OFFICIAL_ADMIN_PROFILE };
  private packages: Package[] = [...INITIAL_PACKAGES];
  private services: Service[] = [...INITIAL_SERVICES];
  private portfolio: PortfolioItem[] = [...INITIAL_PORTFOLIO];
  private team: TeamMember[] = [...INITIAL_TEAM];
  private testimonials: Testimonial[] = [...INITIAL_TESTIMONIALS];
  private bookings: Booking[] = [...INITIAL_BOOKINGS];
  private albums: ClientAlbum[] = [...INITIAL_CLIENT_ALBUMS];
  private enquiries: Enquiry[] = [...INITIAL_ENQUIRIES];

  // ADMIN PROFILE
  getAdminProfile(): AdminProfile {
    return this.adminProfile;
  }

  updateAdminProfile(updates: Partial<AdminProfile>): AdminProfile {
    this.adminProfile = { ...this.adminProfile, ...updates };
    return this.adminProfile;
  }

  // PACKAGES
  getPackages(): Package[] {
    return this.packages;
  }

  getPackageBySlug(slug: string): Package | undefined {
    return this.packages.find((p) => p.slug === slug);
  }

  getPackageById(id: string): Package | undefined {
    return this.packages.find((p) => p.id === id);
  }

  addPackage(pkg: Package): Package {
    this.packages.unshift(pkg);
    return pkg;
  }

  updatePackage(id: string, updates: Partial<Package>): Package | null {
    const idx = this.packages.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.packages[idx] = { ...this.packages[idx], ...updates };
    return this.packages[idx];
  }

  deletePackage(id: string): boolean {
    const initialLen = this.packages.length;
    this.packages = this.packages.filter((p) => p.id !== id);
    return this.packages.length < initialLen;
  }

  // SERVICES
  getServices(): Service[] {
    return this.services;
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.services.find((s) => s.slug === slug);
  }

  // PORTFOLIO
  getPortfolio(): PortfolioItem[] {
    return this.portfolio;
  }

  getPortfolioBySlug(slug: string): PortfolioItem | undefined {
    return this.portfolio.find((p) => p.slug === slug);
  }

  addPortfolioItem(item: PortfolioItem): PortfolioItem {
    this.portfolio.unshift(item);
    return item;
  }

  deletePortfolioItem(id: string): boolean {
    const initialLen = this.portfolio.length;
    this.portfolio = this.portfolio.filter((p) => p.id !== id);
    return this.portfolio.length < initialLen;
  }

  // TEAM & TESTIMONIALS
  getTeam(): TeamMember[] {
    return this.team;
  }

  getTeamMembers(): TeamMember[] {
    return this.team;
  }

  getTestimonials(): Testimonial[] {
    return this.testimonials;
  }

  addTestimonial(testimonial: Testimonial): Testimonial {
    this.testimonials.unshift(testimonial);
    return testimonial;
  }

  // ENQUIRIES
  getEnquiries(): Enquiry[] {
    return this.enquiries;
  }

  getEnquiryById(idOrRef: string): Enquiry | undefined {
    return this.enquiries.find((e) => e.id === idOrRef || e.enquiryId === idOrRef);
  }

  addEnquiry(data: Omit<Enquiry, 'id' | 'enquiryId' | 'status' | 'submittedAt'>): Enquiry {
    const nextSeq = String(this.enquiries.length + 1).padStart(4, '0');
    const enquiryId = `AS-ENQ-${nextSeq}`;
    const submittedAt = new Date().toISOString();

    const submittedDate = new Date(submittedAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const submittedTime = new Date(submittedAt).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const formatDDMMYYYY = (iso?: string) => {
      if (!iso || !iso.includes('-')) return iso || 'Not Provided';
      const [y, m, d] = iso.split('-');
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    };

    const preferredPhotographer = data.preferredPhotographerName || 'Any Available Photographer';
    const priceDisplay = data.packagePriceSnapshot ? data.packagePriceSnapshot.toLocaleString('en-IN') : 'Not Provided';
    const cleanMobile = data.mobileNumber || 'Not Provided';
    const cleanWa = data.whatsappNumber || data.mobileNumber || 'Not Provided';
    const refImages = data.referenceImages && data.referenceImages.length > 0 
      ? data.referenceImages.join('\n') 
      : 'Not Provided';
    const refVideo = data.referenceVideo || 'Not Provided';
    const consentText = data.whatsappConsent ? 'Yes (Opted In for WhatsApp Updates)' : 'No';
    const cleanWaNumber = cleanWa.replace(/[^0-9]/g, '');
    const customerWaLink = cleanWaNumber.length >= 10 
      ? `https://wa.me/${cleanWaNumber.startsWith('91') ? cleanWaNumber : '91' + cleanWaNumber}` 
      : 'Not Provided';

    // EXACT SECTION J WHATSAPP MESSAGE STRUCTURE
    const adminWhatsAppMsgText = `📸 NEW PHOTOGRAPHY ENQUIRY

ABHISHINDE PHOTOGRAPHY

━━━━━━━━━━━━━━━━

ENQUIRY DETAILS

Enquiry ID: ${enquiryId}
Submitted Date: ${submittedDate}
Submitted Time: ${submittedTime}

━━━━━━━━━━━━━━━━

CLIENT INFORMATION

Client Name: ${data.customerName}
Mobile Number: ${cleanMobile}
WhatsApp Number: ${cleanWa}
Email Address: ${data.email}

━━━━━━━━━━━━━━━━

PHOTOGRAPHY REQUIREMENTS

Photography Category: ${data.photographyCategory}
Preferred Photographer: ${preferredPhotographer}
Selected Package: ${data.selectedPackage}
Package Price: ₹${priceDisplay}

Preferred Shoot Date: ${formatDDMMYYYY(data.preferredShootDate)}
Preferred Shoot Time: ${data.preferredShootTime || 'Flexible'}
Event Date: ${formatDDMMYYYY(data.eventDate || data.preferredShootDate)}
Shoot Location: ${data.shootLocation || 'Not Provided'}
Event Type: ${data.eventType || 'Not Provided'}
Number of Guests: ${data.guestCount ?? 'Not Provided'}
Shoot Duration: ${data.shootDuration || 'Not Provided'}

━━━━━━━━━━━━━━━━

ADDITIONAL REQUIREMENTS

${data.additionalRequirements || 'Not Provided'}

Reference Images:
${refImages}

Reference Video:
${refVideo}

WhatsApp Consent:
${consentText}

━━━━━━━━━━━━━━━━

ADMIN ACTION

Open Admin Dashboard:
http://localhost:3000/admin-dashboard

Contact Customer:
${customerWaLink}

Status: NEW ENQUIRY

ABHISHINDE PHOTOGRAPHY
Admin: Abhi Shinde`;

    const adminWhatsAppUrl = `https://wa.me/917822053169?text=${encodeURIComponent(adminWhatsAppMsgText)}`;

    const newEnquiry: Enquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      enquiryId,
      status: 'NEW',
      submittedAt,
      notificationStatus: {
        adminWhatsAppSent: true,
        customerWhatsAppSent: data.whatsappConsent,
        adminWhatsAppUrl,
        adminMessageText: adminWhatsAppMsgText,
      },
    };

    this.enquiries.unshift(newEnquiry);
    return newEnquiry;
  }

  updateEnquiryStatus(
    id: string, 
    status: EnquiryStatus, 
    internalNotes?: string
  ): Enquiry | null {
    const idx = this.enquiries.findIndex((e) => e.id === id || e.enquiryId === id);
    if (idx === -1) return null;
    this.enquiries[idx].status = status;
    if (internalNotes !== undefined) {
      this.enquiries[idx].internalNotes = internalNotes;
    }
    return this.enquiries[idx];
  }

  // CONVERT ENQUIRY TO BOOKING
  convertEnquiryToBooking(
    enquiryId: string, 
    options?: { advanceAmount?: number; assignedPhotographer?: string; adminNotes?: string }
  ): Booking | null {
    const enq = this.getEnquiryById(enquiryId);
    if (!enq) return null;

    const totalAmount = enq.packagePriceSnapshot || 155000;
    const advanceAmount = options?.advanceAmount ?? Math.round(totalAmount * 0.3);
    const remainingBalance = totalAmount - advanceAmount;
    const nowIso = new Date().toISOString();

    const bookingRef = `ASP-BKG-${new Date().getFullYear()}-${String(this.bookings.length + 1).padStart(3, '0')}`;

    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      bookingRef,
      enquiryId: enq.enquiryId,
      createdAt: nowIso,
      updatedAt: nowIso,
      clientName: enq.customerName,
      clientEmail: enq.email,
      clientPhone: enq.mobileNumber,
      clientWhatsapp: enq.whatsappNumber,
      serviceId: enq.selectedService,
      serviceName: enq.selectedService,
      packageId: enq.selectedPackage,
      packageName: enq.selectedPackage,
      packagePriceSnapshot: totalAmount,
      requestedShootDate: enq.preferredShootDate,
      confirmedShootDate: enq.preferredShootDate,
      eventDate: enq.preferredShootDate,
      eventTime: enq.preferredShootTime,
      eventLocation: enq.shootLocation,
      totalAmount,
      advanceAmount,
      paidAmount: advanceAmount,
      remainingBalance,
      paymentStatus: advanceAmount > 0 ? 'Advance Paid' : 'Pending',
      bookingStatus: 'Confirmed',
      bookingConfirmedAt: nowIso,
      assignedPhotographer: options?.assignedPhotographer || 'Abhi Shinde Production Team',
      adminNotes: options?.adminNotes || 'Converted directly from enquiry by Abhi Shinde.',
      additionalNotes: enq.additionalRequirements,
      referenceImages: enq.referenceImages,
      auditLog: [
        {
          timestamp: nowIso,
          action: 'Converted from Enquiry',
          note: `Converted from ${enq.enquiryId} by Admin Abhi Shinde.`,
          updatedBy: 'Abhi Shinde',
        },
      ],
    };

    this.bookings.unshift(newBooking);
    enq.status = 'CONVERTED';
    enq.internalNotes = `${enq.internalNotes || ''} [Converted to Booking ${bookingRef} at ${nowIso}]`;

    return newBooking;
  }

  // BOOKINGS
  getBookings(): Booking[] {
    return this.bookings;
  }

  getBookingById(idOrRef: string): Booking | undefined {
    return this.bookings.find((b) => b.id === idOrRef || b.bookingRef === idOrRef);
  }

  checkDateAvailability(dateStr: string): { available: boolean; existingBookings: number } {
    const matches = this.bookings.filter(
      (b) => (b.confirmedShootDate === dateStr || b.eventDate === dateStr) && b.bookingStatus === 'Confirmed'
    );
    // Studio max 2 large shoots per day
    return {
      available: matches.length < 2,
      existingBookings: matches.length,
    };
  }

  createBooking(bookingData: Partial<Booking> & {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    eventDate: string;
    totalAmount: number;
    advanceAmount: number;
  }): Booking {
    const nowIso = new Date().toISOString();
    const uniqueNum = String(this.bookings.length + 1).padStart(3, '0');
    const total = bookingData.totalAmount || bookingData.packagePriceSnapshot || 0;
    const paid = bookingData.paidAmount || bookingData.advanceAmount || 0;

    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      bookingRef: `ASP-BKG-${new Date().getFullYear()}-${uniqueNum}`,
      createdAt: nowIso,
      updatedAt: nowIso,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      clientPhone: bookingData.clientPhone,
      clientWhatsapp: bookingData.clientWhatsapp || bookingData.clientPhone,
      serviceId: bookingData.serviceId || '',
      serviceName: bookingData.serviceName || 'Photography Service',
      packageId: bookingData.packageId || '',
      packageName: bookingData.packageName || 'Custom Package',
      packagePriceSnapshot: bookingData.packagePriceSnapshot ?? total,
      requestedShootDate: bookingData.requestedShootDate || bookingData.eventDate,
      confirmedShootDate: bookingData.confirmedShootDate || bookingData.eventDate,
      eventDate: bookingData.eventDate,
      eventTime: bookingData.eventTime || '09:00 AM',
      eventLocation: bookingData.eventLocation || '',
      totalAmount: total,
      advanceAmount: bookingData.advanceAmount,
      paidAmount: paid,
      remainingBalance: Math.max(0, total - paid),
      paymentStatus: bookingData.paymentStatus || (paid > 0 ? 'Advance Paid' : 'Pending'),
      bookingStatus: bookingData.bookingStatus || 'Confirmed',
      bookingConfirmedAt: nowIso,
      assignedPhotographer: bookingData.assignedPhotographer || 'Abhi Shinde Production Team',
      adminNotes: bookingData.adminNotes,
      additionalNotes: bookingData.additionalNotes,
      referenceImages: bookingData.referenceImages,
      razorpayOrderId: bookingData.razorpayOrderId,
      razorpayPaymentId: bookingData.razorpayPaymentId,
      auditLog: [
        {
          timestamp: nowIso,
          action: 'Booking Created',
          note: 'Initial booking record initialized.',
          updatedBy: 'System / Customer',
        },
      ],
    };
    this.bookings.unshift(newBooking);
    return newBooking;
  }

  updateBooking(
    id: string, 
    updates: Partial<Booking>, 
    auditNote?: string, 
    updatedBy: string = 'Abhi Shinde'
  ): Booking | null {
    const idx = this.bookings.findIndex((b) => b.id === id || b.bookingRef === id);
    if (idx === -1) return null;

    const nowIso = new Date().toISOString();
    const current = this.bookings[idx];

    // Recalculate remaining balance if total or paid changes
    const total = updates.totalAmount !== undefined ? updates.totalAmount : current.totalAmount;
    const paid = updates.paidAmount !== undefined ? updates.paidAmount : current.paidAmount;
    const remainingBalance = Math.max(0, total - paid);

    // If confirming
    let bookingConfirmedAt = current.bookingConfirmedAt;
    if (updates.bookingStatus === 'Confirmed' && current.bookingStatus !== 'Confirmed') {
      bookingConfirmedAt = nowIso;
      if (!updates.confirmedShootDate && !current.confirmedShootDate) {
        updates.confirmedShootDate = current.requestedShootDate || current.eventDate;
      }
    }

    const auditEntry = auditNote ? {
      timestamp: nowIso,
      action: updates.bookingStatus ? `Status -> ${updates.bookingStatus}` : 'Updated Details',
      note: auditNote,
      updatedBy,
    } : undefined;

    this.bookings[idx] = {
      ...current,
      ...updates,
      updatedAt: nowIso,
      remainingBalance,
      bookingConfirmedAt,
      auditLog: auditEntry ? [...(current.auditLog || []), auditEntry] : current.auditLog,
    };

    return this.bookings[idx];
  }

  // OVERVIEW STATS
  getOverviewStats() {
    const totalEnquiries = this.enquiries.length;
    const newEnquiries = this.enquiries.filter((e) => e.status === 'NEW').length;
    const pendingEnquiries = this.enquiries.filter((e) => e.status === 'NEW' || e.status === 'CONTACTED').length;

    const confirmedBookings = this.bookings.filter((b) => b.bookingStatus === 'Confirmed').length;
    const upcomingShoots = this.bookings.filter(
      (b) => b.bookingStatus === 'Confirmed' && new Date(b.confirmedShootDate || b.eventDate) >= new Date()
    ).length;
    const completedOrders = this.bookings.filter((b) => b.bookingStatus === 'Completed').length;
    const cancelledBookings = this.bookings.filter((b) => b.bookingStatus === 'Cancelled' || b.bookingStatus === 'Rejected').length;

    // Verified revenue: only paid amount counts as verified revenue
    const totalVerifiedRevenue = this.bookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const totalBookedValue = this.bookings
      .filter((b) => b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Rejected')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalPendingPayments = Math.max(0, totalBookedValue - totalVerifiedRevenue);

    return {
      totalEnquiries,
      newEnquiries,
      pendingEnquiries,
      confirmedBookings,
      upcomingShoots,
      completedOrders,
      cancelledBookings,
      totalVerifiedRevenue,
      totalPendingPayments,
      totalBookedValue,
    };
  }

  // CLIENT ALBUMS
  getAlbumByAccess(pinOrToken: string): ClientAlbum | undefined {
    return this.albums.find(
      (a) => a.accessPin === pinOrToken || a.accessToken === pinOrToken
    );
  }

  getAllAlbums(): ClientAlbum[] {
    return this.albums;
  }

  createAlbum(album: ClientAlbum): ClientAlbum {
    this.albums.unshift(album);
    return album;
  }
}

// Global Singleton
export const db = new DataStore();
