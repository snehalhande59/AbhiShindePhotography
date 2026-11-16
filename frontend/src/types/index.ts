export type ServiceCategory = 
  | 'Wedding'
  | 'Pre-Wedding'
  | 'Engagement'
  | 'Birthday'
  | 'Events'
  | 'Fashion'
  | 'Model Portfolio'
  | 'Maternity'
  | 'Newborn'
  | 'Portrait'
  | 'Product'
  | 'Corporate';

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  features: string[];
  duration: string;
  startingPrice: number;
  isActive: boolean;
  featured: boolean;
}

export interface PackageInclusion {
  title: string;
  items: string[];
}

export interface PackageDeliverable {
  title: string;
  items?: string[];
  details?: string[];
}

export interface PaymentTerms {
  bookingAdvancePercent: number; // e.g. 30%
  beforeShootPercent: number;    // e.g. 60%
  finalDeliveryPercent: number;  // e.g. 10%
  notes?: string;
}

export interface Package {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  badge?: string;
  isPopular?: boolean;
  isSignature?: boolean;
  price: number;
  currency: string;
  duration: string;
  coverage: string;
  inclusions: string[] | PackageInclusion[];
  deliverables: string[] | PackageDeliverable[];
  eventsCovered?: string[];
  paymentTerms: PaymentTerms;
  category: string;
  isActive: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  category: ServiceCategory;
  client: string;
  date: string;
  location: string;
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string;
  description: string;
  featured: boolean;
  beforeAfter?: {
    beforeImage: string;
    afterImage: string;
    label: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  specialization: string;
  instagram?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  event: string;
  date: string;
  rating: number;
  review: string;
  clientImage?: string;
  shootImage?: string;
  approved: boolean;
}

export type BookingStatus = 
  | 'Pending Confirmation'
  | 'Confirmed'
  | 'Rescheduled'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected';

export interface BookingAuditEntry {
  timestamp: string;
  action: string;
  note: string;
  updatedBy: string;
}

export interface Booking {
  id: string;
  bookingRef: string;
  enquiryId?: string;
  createdAt: string;
  updatedAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientWhatsapp?: string;
  serviceId: string;
  serviceName: string;
  packageId: string;
  packageName: string;
  packagePriceSnapshot: number;
  requestedShootDate: string;
  confirmedShootDate?: string;
  eventDate: string; // Synced with confirmedShootDate or requestedShootDate
  eventTime: string;
  eventLocation: string;
  totalAmount: number;
  advanceAmount: number;
  paidAmount: number;
  remainingBalance: number;
  paymentStatus: 'Pending' | 'Advance Paid' | 'Fully Paid' | 'Refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  bookingStatus: BookingStatus;
  bookingConfirmedAt?: string;
  assignedPhotographer?: string;
  adminNotes?: string;
  additionalNotes?: string;
  referenceImages?: string[];
  auditLog?: BookingAuditEntry[];
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'NOT_INTERESTED' | 'CONVERTED' | 'CLOSED';

export interface Enquiry {
  id: string;
  enquiryId: string;
  customerName: string;
  countryCode?: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  photographyCategory: ServiceCategory | string;
  selectedService: string;
  preferredPhotographerId?: string;
  preferredPhotographerName?: string;
  preferredPhotographerPhoto?: string;
  selectedPackage: string;
  packagePriceSnapshot: number;
  preferredShootDate: string; // ISO YYYY-MM-DD
  preferredShootTime: string;
  eventDate?: string; // ISO YYYY-MM-DD
  shootLocation: string;
  shootCity?: string;
  shootArea?: string;
  venueName?: string;
  eventType?: string;
  guestCount?: number | string;
  shootDuration?: string;
  specialInstructions?: string;
  additionalRequirements: string;
  referenceImages?: string[];
  referenceVideo?: string;
  whatsappConsent: boolean;
  status: EnquiryStatus;
  submittedAt: string;
  internalNotes?: string;
  notificationStatus?: {
    adminWhatsAppSent: boolean;
    customerWhatsAppSent: boolean;
    failureReason?: string;
    adminWhatsAppUrl?: string;
    adminMessageText?: string;
  };
}

export interface ClientAlbum {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  accessPin: string;
  accessToken: string;
  expiryDate: string;
  coverImage: string;
  photos: {
    id: string;
    url: string;
    caption?: string;
  }[];
  downloadEnabled: boolean;
  status: 'Active' | 'Expired' | 'Locked';
}

export interface AdminProfile {
  name: string;
  studioName: string;
  phone: string;
  whatsapp: string;
  personalInstagram: string;
  photographyInstagram: string;
  email: string;
  address: string;
  role: string;
  isConfigured: boolean;
}
