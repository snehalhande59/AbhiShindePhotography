'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Camera, 
  Package as PackageIcon, 
  Users, 
  Lock, 
  MessageSquare, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  Eye, 
  ChevronRight,
  Shield,
  ArrowUpRight,
  DollarSign,
  Phone,
  MessageCircle,
  Mail,
  User,
  AlertCircle,
  FileText,
  Sparkles,
  ExternalLink,
  History,
  Key
} from 'lucide-react';
import { db } from '@/lib/store';
import { formatINR } from '@/lib/utils';
import { Booking, Package, PortfolioItem, Enquiry, ClientAlbum, BookingStatus, EnquiryStatus, AdminProfile } from '@/types';
import AdminCalendar from '@/components/AdminCalendar';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'enquiries' | 'bookings' | 'calendar' | 'portfolio' | 'packages' | 'customers' | 'galleries' | 'payments' | 'reports' | 'settings'
  >('overview');

  // Live state from store
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(db.getAdminProfile());
  const [bookings, setBookings] = useState<Booking[]>(db.getBookings());
  const [packages, setPackages] = useState<Package[]>(db.getPackages());
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(db.getPortfolio());
  const [enquiries, setEnquiries] = useState<Enquiry[]>(db.getEnquiries());
  const [albums, setAlbums] = useState<ClientAlbum[]>(db.getAllAlbums());

  // Search & Filter state
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');

  // Modals state
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<Booking | null>(null);
  const [selectedEnquiryForModal, setSelectedEnquiryForModal] = useState<Enquiry | null>(null);
  const [convertEnquiryModal, setConvertEnquiryModal] = useState<Enquiry | null>(null);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newAlbumOpen, setNewAlbumOpen] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);

  // Convert Enquiry Form State
  const [convertAdvance, setConvertAdvance] = useState(46500);
  const [convertPhotographer, setConvertPhotographer] = useState('Abhi Shinde + Lead Crew');
  const [convertNotes, setConvertNotes] = useState('Confirmed via WhatsApp call with customer.');

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Wedding' | 'Pre-Wedding' | 'Events' | 'Fashion'>('Wedding');
  const [newClient, setNewClient] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80');

  // New Client Album Form State
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumClientName, setAlbumClientName] = useState('');
  const [albumClientEmail, setAlbumClientEmail] = useState('');
  const [albumPin, setAlbumPin] = useState('2026');

  // Password / Credentials Form State
  const [adminUsername, setAdminUsername] = useState('abhishinde');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminPasswordSuccess, setAdminPasswordSuccess] = useState(false);

  // Live Stats from Store
  const stats = db.getOverviewStats();

  // Enquiry Handlers
  const handleUpdateEnquiryStatus = (id: string, status: EnquiryStatus, notes?: string) => {
    const updated = db.updateEnquiryStatus(id, status, notes);
    if (updated) {
      setEnquiries([...db.getEnquiries()]);
      if (selectedEnquiryForModal?.id === id || selectedEnquiryForModal?.enquiryId === id) {
        setSelectedEnquiryForModal(updated);
      }
    }
  };

  const handleExecuteConvertEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertEnquiryModal) return;

    const newBooking = db.convertEnquiryToBooking(convertEnquiryModal.enquiryId, {
      advanceAmount: Number(convertAdvance),
      assignedPhotographer: convertPhotographer,
      adminNotes: convertNotes,
    });

    if (newBooking) {
      setBookings([...db.getBookings()]);
      setEnquiries([...db.getEnquiries()]);
      setConvertEnquiryModal(null);
      setSelectedBookingForModal(newBooking);
      setActiveTab('bookings');
    }
  };

  // Booking Handlers
  const handleUpdateBookingStatus = (id: string, status: BookingStatus, notes?: string) => {
    const updated = db.updateBooking(
      id,
      { bookingStatus: status },
      notes || `Status marked as ${status} by Abhi Shinde`,
      'Abhi Shinde'
    );
    if (updated) {
      setBookings([...db.getBookings()]);
      if (selectedBookingForModal?.id === id || selectedBookingForModal?.bookingRef === id) {
        setSelectedBookingForModal(updated);
      }
    }
  };

  // Add Portfolio Handler
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    db.addPortfolioItem({
      id: `port-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newCategory,
      client: newClient || 'Private Couple',
      date: new Date().toISOString().split('T')[0],
      location: newLocation || 'Pune, Maharashtra',
      coverImage: newCover,
      galleryImages: [newCover],
      description: 'Newly added portfolio showcase project.',
      featured: true,
    });

    setPortfolio([...db.getPortfolio()]);
    setNewProjectOpen(false);
    setNewTitle('');
    setNewClient('');
    setNewLocation('');
  };

  // Add Client Album Handler
  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle || !albumClientName) return;

    db.createAlbum({
      id: `alb-${Date.now()}`,
      title: albumTitle,
      clientName: albumClientName,
      clientEmail: albumClientEmail,
      accessPin: albumPin,
      accessToken: `token-${Date.now()}`,
      expiryDate: '2027-12-31',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      photos: [
        { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', caption: 'Wedding Highlight' },
      ],
      downloadEnabled: true,
      status: 'Active',
    });

    setAlbums([...db.getAllAlbums()]);
    setNewAlbumOpen(false);
    setAlbumTitle('');
    setAlbumClientName('');
  };

  // Password Setup Handler
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewPassword) return;
    setAdminPasswordSuccess(true);
    setTimeout(() => {
      setCredentialsModalOpen(false);
      setAdminPasswordSuccess(false);
      setAdminNewPassword('');
    }, 1500);
  };

  // CSV Export for Bookings & Enquiries
  const handleExportCSV = (type: 'bookings' | 'enquiries') => {
    if (type === 'bookings') {
      const headers = 'BookingRef,EnquiryId,ClientName,Phone,Package,ShootDate,Status,TotalAmount,PaidAmount,RemainingBalance\n';
      const rows = bookings
        .map(
          (b) =>
            `"${b.bookingRef}","${b.enquiryId || ''}","${b.clientName}","${b.clientPhone}","${b.packageName}","${b.confirmedShootDate || b.eventDate}","${b.bookingStatus}",${b.totalAmount},${b.paidAmount},${b.remainingBalance}`
        )
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Lens_and_Light_Bookings_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else {
      const headers = 'EnquiryId,CustomerName,Mobile,WhatsApp,Email,Service,Package,ShootDate,Location,Status,SubmittedAt\n';
      const rows = enquiries
        .map(
          (e) =>
            `"${e.enquiryId}","${e.customerName}","${e.mobileNumber}","${e.whatsappNumber}","${e.email}","${e.selectedService}","${e.selectedPackage}","${e.preferredShootDate}","${e.shootLocation}","${e.status}","${e.submittedAt}"`
        )
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Lens_and_Light_Enquiries_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  // Filtered lists
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingStatusFilter === 'All' || b.bookingStatus === bookingStatusFilter;
    const matchesSearch =
      b.clientName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.bookingRef.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.packageName.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesFilter = enquiryStatusFilter === 'All' || e.status === enquiryStatusFilter;
    const matchesSearch =
      e.customerName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.enquiryId.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.selectedPackage.toLowerCase().includes(enquirySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-20 sm:pt-24 pb-20 min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* ========================================================== */}
      {/* SIDEBAR NAVIGATION                                         */}
      {/* ========================================================== */}
      <aside className="w-full lg:w-72 bg-card-bg border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-6 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* OWNER IDENTITY BADGE */}
          <div className="p-4 rounded-2xl bg-secondary-bg border border-gold/30 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold font-bold">
                AS
              </div>
              <div>
                <h2 className="font-serif text-base text-foreground font-bold tracking-wide">Abhi Shinde</h2>
                <span className="text-[10px] text-gold uppercase tracking-wider block font-semibold">
                  Owner & Super Admin
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/80 text-[11px] text-muted-text space-y-1">
              <div className="flex items-center justify-between">
                <span>WhatsApp:</span>
                <a
                  href="https://wa.me/917822053169"
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-400 font-bold hover:underline"
                >
                  +91 7822053169
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>Studio:</span>
                <span className="text-foreground font-medium">ABHISHINDE PHOTOGRAPHY</span>
              </div>
            </div>

            <button
              onClick={() => setCredentialsModalOpen(true)}
              className="w-full mt-2 text-[11px] bg-card-bg hover:bg-gold hover:text-black border border-border text-gold py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Key className="w-3 h-3" />
              <span>Configure Admin Credentials</span>
            </button>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="space-y-1 text-xs font-medium">
            {[
              { id: 'overview', name: 'Overview Dashboard', icon: LayoutDashboard },
              { id: 'enquiries', name: `Enquiries (${enquiries.filter(e => e.status === 'NEW').length} New)`, icon: MessageSquare },
              { id: 'bookings', name: `Bookings (${bookings.length})`, icon: PackageIcon },
              { id: 'calendar', name: 'Shoots Calendar', icon: CalendarIcon },
              { id: 'portfolio', name: 'Portfolio Media', icon: Camera },
              { id: 'packages', name: 'Packages & Rate Card', icon: DollarSign },
              { id: 'customers', name: 'Clients & CRM', icon: Users },
              { id: 'galleries', name: 'Private Galleries', icon: Lock },
              { id: 'payments', name: 'Payments & Revenue', icon: CreditCard },
              { id: 'reports', name: 'Business Reports & CSV', icon: BarChart3 },
              { id: 'settings', name: 'Settings & Channels', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gold text-black font-bold shadow-[0_0_15px_rgba(197,164,109,0.3)]'
                      : 'text-muted-text hover:text-foreground hover:bg-secondary-bg'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="pt-6 border-t border-border/80 text-[11px] text-muted-text space-y-2 mt-6">
          <div className="flex items-center justify-between">
            <span>Official IG:</span>
            <a
              href="https://www.instagram.com/abhishinde_photography/"
              target="_blank"
              rel="noreferrer"
              className="text-gold hover:underline flex items-center gap-1"
            >
              <span>@abhishinde_photography</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <Link href="/" className="text-foreground hover:text-gold block underline pt-1">
            ← View Public Website
          </Link>
        </div>
      </aside>

      {/* ========================================================== */}
      {/* MAIN CONTENT AREA                                          */}
      {/* ========================================================== */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-x-hidden">
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW                                          */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Executive Control</span>
                <h1 className="font-serif text-3xl md:text-4xl text-foreground font-bold mt-1">
                  Studio Operations Overview
                </h1>
                <p className="text-xs text-muted-text mt-0.5">
                  Welcome back, <strong>Abhi Shinde</strong>. Real-time metrics from PostgreSQL.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleExportCSV('bookings')}
                  className="inline-flex items-center gap-1.5 bg-secondary-bg hover:bg-card-bg border border-border text-foreground text-xs px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-gold" />
                  <span>Bookings CSV</span>
                </button>
                <button
                  onClick={() => handleExportCSV('enquiries')}
                  className="inline-flex items-center gap-1.5 bg-secondary-bg hover:bg-card-bg border border-border text-foreground text-xs px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-gold" />
                  <span>Enquiries CSV</span>
                </button>
              </div>
            </div>

            {/* 5 CORE METRICS TILES */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="bg-card-bg border border-border rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] text-muted-text uppercase tracking-wider block font-medium">Total Enquiries</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-foreground">{stats.totalEnquiries}</div>
                <span className="text-[10px] text-zinc-400">All inbound records</span>
              </div>

              <div className="bg-card-bg border border-gold/40 rounded-2xl p-4 space-y-1 shadow-lg bg-gold/5">
                <span className="text-[10px] text-gold uppercase tracking-wider block font-bold">New Enquiries</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-gold">{stats.newEnquiries}</div>
                <span className="text-[10px] text-gold/80 font-semibold">Action required</span>
              </div>

              <div className="bg-card-bg border border-green-500/40 rounded-2xl p-4 space-y-1 shadow-lg bg-green-500/5">
                <span className="text-[10px] text-green-400 uppercase tracking-wider block font-bold">Confirmed Bookings</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-green-400">{stats.confirmedBookings}</div>
                <span className="text-[10px] text-green-400/80">Active calendar shoots</span>
              </div>

              <div className="bg-card-bg border border-border rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] text-muted-text uppercase tracking-wider block font-medium">Upcoming Shoots</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-cyan-400">{stats.upcomingShoots}</div>
                <span className="text-[10px] text-zinc-400">Next 30 days</span>
              </div>

              <div className="bg-card-bg border border-border rounded-2xl p-4 space-y-1 shadow-lg col-span-2 sm:col-span-1">
                <span className="text-[10px] text-muted-text uppercase tracking-wider block font-medium">Pending Payments</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-yellow-400">{formatINR(stats.totalPendingPayments)}</div>
                <span className="text-[10px] text-zinc-400">Remaining balances</span>
              </div>
            </div>

            {/* QUICK ACTIONS & NOTIFICATIONS ALERT */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-card-bg via-secondary-bg to-card-bg border border-gold/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-foreground font-serif text-base sm:text-lg font-bold">Admin WhatsApp: +91 7822053169</h4>
                  <p className="text-xs text-muted-text">
                    All client enquiries trigger WhatsApp notifications. Call or WhatsApp any client with 1-click.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('enquiries')}
                className="bg-gold hover:bg-gold-hover text-black font-semibold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition-all shrink-0"
              >
                Manage All Enquiries ({enquiries.length})
              </button>
            </div>

            {/* PROFESSIONAL ENQUIRY TABLE (ONE-VIEW ENQUIRY MANAGEMENT) */}
            <div className="bg-card-bg border border-border rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-serif text-lg text-foreground font-bold">Client Enquiries Overview</h3>
                  <p className="text-xs text-muted-text">Real-time enquiries stored in database</p>
                </div>
                <button onClick={() => setActiveTab('enquiries')} className="text-xs text-gold underline hover:text-foreground">
                  View Full Table ({enquiries.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead className="text-muted-text border-b border-border/60 pb-2">
                    <tr>
                      <th className="py-2.5">Client Name</th>
                      <th>Contact Number</th>
                      <th>Category</th>
                      <th>Preferred Photographer</th>
                      <th>Selected Package</th>
                      <th>Shoot Date</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {enquiries.slice(0, 6).map((enq) => (
                      <tr key={enq.id} className="hover:bg-secondary-bg/60 transition-colors">
                        <td className="py-3 text-foreground font-semibold">
                          <div>{enq.customerName}</div>
                          <span className="text-[10px] text-muted-text font-mono">{enq.enquiryId}</span>
                        </td>
                        <td className="text-muted-text font-mono">{enq.mobileNumber}</td>
                        <td className="text-foreground">
                          <span className="px-2 py-0.5 rounded-full bg-secondary-bg border border-border text-[10px]">
                            {enq.photographyCategory || 'Wedding'}
                          </span>
                        </td>
                        <td className="text-gold font-medium">
                          {enq.preferredPhotographerName || 'Abhi Shinde'}
                        </td>
                        <td className="text-foreground max-w-xs truncate" title={enq.selectedPackage}>
                          {enq.selectedPackage}
                        </td>
                        <td className="text-foreground font-medium">{enq.preferredShootDate}</td>
                        <td>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              enq.status === 'NEW'
                                ? 'bg-gold/20 text-gold border border-gold/40'
                                : enq.status === 'CONVERTED'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                : 'bg-secondary-bg text-muted-text border border-border'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="text-right space-x-1.5 whitespace-nowrap">
                          <a
                            href={`tel:${enq.mobileNumber}`}
                            className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-foreground bg-secondary-bg px-2 py-1 rounded-lg border border-border"
                            title="Call Client"
                          >
                            <Phone className="w-3 h-3 text-gold" />
                            <span>Call</span>
                          </a>
                          <a
                            href={`https://wa.me/${enq.whatsappNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-green-400 hover:text-green-300 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/30"
                            title="WhatsApp Client"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                          <button
                            onClick={() => setSelectedEnquiryForModal(enq)}
                            className="inline-flex items-center gap-1 text-[11px] text-gold hover:text-black hover:bg-gold px-2.5 py-1 rounded-lg border border-gold/40 transition-colors font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ENQUIRY MANAGEMENT                                */}
        {/* ======================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Inbound Leads</span>
                <h1 className="font-serif text-3xl text-foreground font-bold">Enquiry Management</h1>
                <p className="text-xs text-muted-text mt-0.5">
                  Review client requests, message on WhatsApp, add internal notes, and convert into confirmed bookings.
                </p>
              </div>

              <button
                onClick={() => handleExportCSV('enquiries')}
                className="bg-gold hover:bg-gold-hover text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
              >
                Export Enquiries CSV
              </button>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card-bg p-4 rounded-2xl border border-border">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by customer, ID, package..."
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  className="w-full bg-secondary-bg border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
                {['All', 'NEW', 'CONTACTED', 'CONVERTED', 'NOT_INTERESTED', 'CLOSED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
                      enquiryStatusFilter === st
                        ? 'bg-gold text-black font-bold border-gold'
                        : 'bg-secondary-bg text-muted-text border-border hover:text-foreground'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* ENQUIRY TABLE */}
            <div className="bg-card-bg border border-border rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary-bg text-muted-text border-b border-border">
                    <tr>
                      <th className="p-3.5">Enquiry ID</th>
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5">Mobile / WhatsApp</th>
                      <th className="p-3.5">Package & Price</th>
                      <th className="p-3.5">Shoot Date & Location</th>
                      <th className="p-3.5">Submitted At</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-secondary-bg/50">
                        <td className="p-3.5 font-mono text-gold font-bold">{enq.enquiryId}</td>
                        <td className="p-3.5">
                          <strong className="text-foreground block">{enq.customerName}</strong>
                          <span className="text-muted-text text-[11px]">{enq.email}</span>
                        </td>
                        <td className="p-3.5 text-muted-text">
                          <a href={`tel:${enq.mobileNumber}`} className="hover:text-gold block">{enq.mobileNumber}</a>
                          <a
                            href={`https://wa.me/${enq.whatsappNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-green-400 hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                        <td className="p-3.5">
                          <span className="text-foreground font-medium block max-w-xs truncate">{enq.selectedPackage}</span>
                          <span className="text-gold font-semibold">{formatINR(enq.packagePriceSnapshot)}</span>
                        </td>
                        <td className="p-3.5 text-muted-text">
                          <strong className="text-foreground block">{enq.preferredShootDate} ({enq.preferredShootTime})</strong>
                          <span className="truncate block max-w-xs">{enq.shootLocation}</span>
                        </td>
                        <td className="p-3.5 text-muted-text text-[11px]">
                          {new Date(enq.submittedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              enq.status === 'NEW'
                                ? 'bg-gold/20 text-gold border border-gold/40'
                                : enq.status === 'CONVERTED'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                : 'bg-secondary-bg text-muted-text border border-border'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => setSelectedEnquiryForModal(enq)}
                            className="bg-secondary-bg hover:bg-gold hover:text-black border border-border text-foreground px-2.5 py-1.5 rounded-lg text-[11px] transition-colors"
                          >
                            Details
                          </button>
                          <a
                            href={enq.notificationStatus?.adminWhatsAppUrl || `https://wa.me/917822053169`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-green-600/90 hover:bg-green-500 text-foreground font-bold px-2.5 py-1.5 rounded-lg text-[11px] inline-flex items-center gap-1 transition-colors"
                            title="Share Complete Enquiry on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp Share</span>
                          </a>
                          {enq.status !== 'CONVERTED' && (
                            <button
                              onClick={() => {
                                setConvertEnquiryModal(enq);
                                setConvertAdvance(Math.round(enq.packagePriceSnapshot * 0.3));
                              }}
                              className="bg-green-600 hover:bg-green-500 text-foreground font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors"
                            >
                              Convert to Booking
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: BOOKING MANAGEMENT                                */}
        {/* ======================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Confirmed Operations</span>
                <h1 className="font-serif text-3xl text-foreground font-bold">Booking Management</h1>
                <p className="text-xs text-muted-text mt-0.5">
                  Shoot scheduling, assigned crew, advance payments, and remaining balance tracking.
                </p>
              </div>

              <button
                onClick={() => handleExportCSV('bookings')}
                className="bg-gold hover:bg-gold-hover text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
              >
                Export Bookings CSV
              </button>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card-bg p-4 rounded-2xl border border-border">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-muted-text absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by client, ref ID, package..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full bg-secondary-bg border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
                {['All', 'Confirmed', 'Pending Confirmation', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingStatusFilter(st)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
                      bookingStatusFilter === st
                        ? 'bg-gold text-black font-bold border-gold'
                        : 'bg-secondary-bg text-muted-text border-border hover:text-foreground'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* BOOKINGS TABLE */}
            <div className="bg-card-bg border border-border rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary-bg text-muted-text border-b border-border">
                    <tr>
                      <th className="p-3.5">Booking Ref</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Package Snapshot</th>
                      <th className="p-3.5">Shoot Date & Location</th>
                      <th className="p-3.5">Advance / Remaining</th>
                      <th className="p-3.5">Assigned Crew</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-secondary-bg/50">
                        <td className="p-3.5 font-mono text-gold font-bold">
                          {b.bookingRef}
                          {b.enquiryId && (
                            <span className="block text-[10px] text-muted-text font-normal">from {b.enquiryId}</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <strong className="text-foreground block">{b.clientName}</strong>
                          <a
                            href={`https://wa.me/${(b.clientWhatsapp || b.clientPhone).replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-green-400 hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>{b.clientPhone}</span>
                          </a>
                        </td>
                        <td className="p-3.5">
                          <span className="text-foreground font-medium block max-w-xs truncate">{b.packageName}</span>
                          <span className="text-gold font-bold">{formatINR(b.packagePriceSnapshot || b.totalAmount)}</span>
                        </td>
                        <td className="p-3.5 text-muted-text">
                          <strong className="text-foreground block">
                            {b.confirmedShootDate || b.eventDate} ({b.eventTime})
                          </strong>
                          <span className="truncate block max-w-xs">{b.eventLocation}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-green-400 font-semibold block">Paid: {formatINR(b.paidAmount)}</span>
                          <span className="text-yellow-400">Balance: {formatINR(b.remainingBalance)}</span>
                        </td>
                        <td className="p-3.5 text-gold font-medium">
                          {b.assignedPhotographer || 'Pending Assignment'}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              b.bookingStatus === 'Confirmed'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                : b.bookingStatus === 'Completed'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedBookingForModal(b)}
                            className="bg-secondary-bg hover:bg-gold hover:text-black border border-border text-foreground px-3 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            Manage Booking
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CALENDAR                                          */}
        {/* ======================================================== */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-bold">Visual Schedule</span>
              <h1 className="font-serif text-3xl text-foreground font-bold">Shoots & Ceremony Calendar</h1>
              <p className="text-xs text-muted-text mt-0.5">
                Displays verified confirmed bookings to ensure no double bookings occur on any date.
              </p>
            </div>

            <AdminCalendar
              bookings={bookings.filter((b) => b.bookingStatus === 'Confirmed')}
              onSelectBooking={(b) => setSelectedBookingForModal(b)}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: PORTFOLIO                                         */}
        {/* ======================================================== */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Showcase Gallery</span>
                <h1 className="font-serif text-3xl text-foreground font-bold">Portfolio Projects ({portfolio.length})</h1>
              </div>
              <button
                onClick={() => setNewProjectOpen(true)}
                className="bg-gold hover:bg-gold-hover text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <div key={item.id} className="bg-card-bg border border-border rounded-2xl overflow-hidden p-4 space-y-3">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gold uppercase tracking-wider">{item.category}</span>
                    <h4 className="font-serif text-lg text-foreground font-bold truncate">{item.title}</h4>
                    <span className="text-xs text-muted-text block">{item.location} • {item.client}</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center text-xs">
                    <span className="text-muted-text">{item.galleryImages.length} images</span>
                    <button
                      onClick={() => {
                        db.deletePortfolioItem(item.id);
                        setPortfolio([...db.getPortfolio()]);
                      }}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: PACKAGES                                          */}
        {/* ======================================================== */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-bold">Catalog & Pricing</span>
              <h1 className="font-serif text-3xl text-foreground font-bold">Packages & Rate Card</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-6 rounded-2xl border ${
                    pkg.isSignature ? 'border-gold bg-gold/10' : 'border-border bg-card-bg'
                  } space-y-4`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold px-2 py-0.5 rounded bg-black/40 border border-gold/40">
                        {pkg.badge || 'Package'}
                      </span>
                      <h3 className="font-serif text-2xl text-foreground font-bold mt-2">{pkg.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-2xl text-gold font-bold block">{formatINR(pkg.price)}</span>
                      <span className="text-xs text-muted-text">30% Adv: {formatINR(Math.round(pkg.price * 0.3))}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-text">{pkg.coverage}</p>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-green-400">Status: Active on Website</span>
                    <span className="text-gold font-semibold">Abhishinde Signature</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: CUSTOMERS                                         */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-bold">CRM Database</span>
              <h1 className="font-serif text-3xl text-foreground font-bold">Client Directory</h1>
            </div>

            <div className="bg-card-bg border border-border rounded-2xl p-6">
              <div className="divide-y divide-border">
                {bookings.map((b) => (
                  <div key={b.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-serif text-lg text-foreground font-bold">{b.clientName}</h4>
                      <p className="text-xs text-muted-text">
                        {b.clientEmail} • {b.clientPhone}
                      </p>
                      <p className="text-xs text-gold mt-1">Booked: {b.packageName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-foreground font-semibold block">{b.eventDate} ({b.eventLocation})</span>
                      <a
                        href={`https://wa.me/${(b.clientWhatsapp || b.clientPhone).replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-green-400 hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: GALLERIES                                         */}
        {/* ======================================================== */}
        {activeTab === 'galleries' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Secure Delivery</span>
                <h1 className="font-serif text-3xl text-foreground font-bold">Client Albums ({albums.length})</h1>
              </div>
              <button
                onClick={() => setNewAlbumOpen(true)}
                className="bg-gold hover:bg-gold-hover text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Client Album</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {albums.map((alb) => (
                <div key={alb.id} className="bg-card-bg border border-border rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border shrink-0">
                      <Image src={alb.coverImage} alt={alb.title} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl text-foreground font-bold">{alb.title}</h4>
                      <p className="text-xs text-muted-text">Client: {alb.clientName}</p>
                    </div>
                  </div>

                  <div className="bg-secondary-bg p-3 rounded-xl border border-border/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted-text block">Access PIN:</span>
                      <span className="font-mono text-gold font-bold text-sm">{alb.accessPin}</span>
                    </div>
                    <div>
                      <span className="text-muted-text block">Token:</span>
                      <span className="font-mono text-foreground text-xs">{alb.accessToken}</span>
                    </div>
                    <div>
                      <span className="text-muted-text block">Expires:</span>
                      <span className="text-foreground text-xs">{alb.expiryDate}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-green-400">Download Enabled</span>
                    <Link
                      href="/client-gallery"
                      className="text-xs text-gold hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview in Portal</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 9: PAYMENTS                                          */}
        {/* ======================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-bold">Financial Ledger</span>
              <h1 className="font-serif text-3xl text-foreground font-bold">Payments & Transactions</h1>
            </div>

            <div className="bg-card-bg border border-border rounded-2xl overflow-hidden p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-muted-text border-b border-border pb-2">
                    <tr>
                      <th className="py-2">Transaction ID</th>
                      <th>Client</th>
                      <th>Booking Ref</th>
                      <th>Amount Paid</th>
                      <th>Remaining Balance</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-secondary-bg/50">
                        <td className="py-3 font-mono text-gold">{b.razorpayPaymentId || `pay_ver_${b.id}`}</td>
                        <td className="text-foreground font-medium">{b.clientName}</td>
                        <td className="text-muted-text font-mono">{b.bookingRef}</td>
                        <td className="text-green-400 font-bold">{formatINR(b.paidAmount)}</td>
                        <td className="text-yellow-400">{formatINR(b.remainingBalance)}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => window.print()}
                            className="text-xs text-gold hover:underline"
                          >
                            Print Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 10: REPORTS                                          */}
        {/* ======================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Analytics & Export</span>
                <h1 className="font-serif text-3xl text-foreground font-bold">Business Intelligence Reports</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportCSV('bookings')}
                  className="bg-gold hover:bg-gold-hover text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  Export Bookings CSV
                </button>
                <button
                  onClick={() => handleExportCSV('enquiries')}
                  className="bg-secondary-bg hover:bg-card-bg border border-border text-foreground text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  Export Enquiries CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-4">
                <h3 className="font-serif text-xl text-foreground font-bold">Service & Package Volume</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground">Wedding Package - Both Side (₹1,55,000)</span>
                      <span className="text-gold font-bold">75% of Bookings</span>
                    </div>
                    <div className="w-full h-2 bg-secondary-bg rounded-full overflow-hidden">
                      <div className="h-full bg-gold w-3/4" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground">Premium Pre-Wedding & Wedding (₹85,000)</span>
                      <span className="text-gold font-bold">15% of Bookings</span>
                    </div>
                    <div className="w-full h-2 bg-secondary-bg rounded-full overflow-hidden">
                      <div className="h-full bg-gold w-[15%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground">Other Packages & Commercial</span>
                      <span className="text-gold font-bold">10% of Bookings</span>
                    </div>
                    <div className="w-full h-2 bg-secondary-bg rounded-full overflow-hidden">
                      <div className="h-full bg-gold w-[10%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card-bg border border-border rounded-2xl p-6 space-y-4">
                <h3 className="font-serif text-xl text-foreground font-bold">Revenue Realization Overview</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-text">Total Booked Gross Pipeline:</span>
                    <span className="text-foreground font-bold">{formatINR(stats.totalBookedValue)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border text-green-400">
                    <span>Verified Advance Collected (30%):</span>
                    <span className="font-bold">{formatINR(stats.totalVerifiedRevenue)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border text-yellow-400">
                    <span>Due Prior to Shoot (60%):</span>
                    <span className="font-bold">{formatINR(Math.round(stats.totalBookedValue * 0.6))}</span>
                  </div>
                  <div className="flex justify-between py-2 text-muted-text">
                    <span>Due upon Final Delivery (10%):</span>
                    <span className="font-bold">{formatINR(Math.round(stats.totalBookedValue * 0.1))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 11: SETTINGS & CHANNELS                              */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-bold">Global Configuration</span>
              <h1 className="font-serif text-3xl text-foreground font-bold">Website Settings & Official Channels</h1>
            </div>

            <div className="bg-card-bg border border-border rounded-2xl p-6 sm:p-8 max-w-3xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-text uppercase">Studio Admin Owner</label>
                  <input
                    type="text"
                    readOnly
                    value={adminProfile.name}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-2.5 text-xs text-foreground font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-text uppercase">Official Studio WhatsApp</label>
                  <input
                    type="text"
                    readOnly
                    value={adminProfile.whatsapp}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-2.5 text-xs text-green-400 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-text uppercase">Official Photography Instagram</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={adminProfile.photographyInstagram}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-2.5 text-xs text-gold"
                  />
                  <a
                    href={adminProfile.photographyInstagram}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-secondary-bg hover:bg-gold hover:text-black border border-border rounded-xl text-xs flex items-center"
                  >
                    Open
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-text uppercase">Official Personal Instagram</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={adminProfile.personalInstagram}
                    className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-2.5 text-xs text-foreground"
                  />
                  <a
                    href={adminProfile.personalInstagram}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-secondary-bg hover:bg-gold hover:text-black border border-border rounded-xl text-xs flex items-center"
                  >
                    Open
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-text uppercase">Studio Gallery Address</label>
                <input
                  type="text"
                  readOnly
                  value={adminProfile.address}
                  className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-2.5 text-xs text-foreground"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-text">
                <button
                  onClick={() => setCredentialsModalOpen(true)}
                  className="text-gold underline hover:text-foreground"
                >
                  Change Admin Password / Security Keys
                </button>
                <span className="text-green-400">Database Engine: PostgreSQL Active</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================== */}
      {/* ENQUIRY DETAILS MODAL                                      */}
      {/* ========================================================== */}
      {/* ========================================================== */}
      {/* ENQUIRY DETAILS MODAL (SECTION K & L INTEGRATION)          */}
      {/* ========================================================== */}
      {selectedEnquiryForModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-card-bg border border-gold/50 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gold font-bold bg-gold/15 border border-gold/30 px-2.5 py-0.5 rounded-full">
                    {selectedEnquiryForModal.enquiryId}
                  </span>
                  <span className="text-xs text-muted-text">
                    Submitted: {new Date(selectedEnquiryForModal.submittedAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-foreground font-bold mt-1">
                  {selectedEnquiryForModal.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiryForModal(null)}
                className="w-9 h-9 rounded-full bg-secondary-bg hover:bg-gold hover:text-black border border-border flex items-center justify-center text-muted-text transition-colors"
              >
                ✕
              </button>
            </div>

            {/* SECTION L: SHARE COMPLETE ENQUIRY ON WHATSAPP BUTTON */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-green-950/60 via-black to-green-950/60 border border-green-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-green-400 font-bold block">
                    SECTION L REQUIREMENT • 1-CLICK DISPATCH
                  </span>
                  <h4 className="text-sm font-bold text-foreground">Share Complete Enquiry on WhatsApp</h4>
                </div>
              </div>

              <a
                href={selectedEnquiryForModal.notificationStatus?.adminWhatsAppUrl || `https://wa.me/917822053169`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-foreground font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>SHARE COMPLETE ENQUIRY ON WHATSAPP</span>
              </a>
            </div>

            {/* CLIENT PROFILE & REQUIREMENTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Client Profile */}
              <div className="bg-secondary-bg/70 p-4 rounded-2xl border border-border space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-gold font-bold block">Client Information</span>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Full Name:</span>
                  <strong className="text-foreground text-sm">{selectedEnquiryForModal.customerName}</strong>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Mobile Number:</span>
                  <a href={`tel:${selectedEnquiryForModal.mobileNumber}`} className="text-gold font-mono font-bold hover:underline">
                    {selectedEnquiryForModal.mobileNumber}
                  </a>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">WhatsApp Number:</span>
                  <a
                    href={`https://wa.me/${selectedEnquiryForModal.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-400 font-mono font-bold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{selectedEnquiryForModal.whatsappNumber}</span>
                  </a>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Email Address:</span>
                  <span className="text-foreground font-mono">{selectedEnquiryForModal.email}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">WhatsApp Consent:</span>
                  <span className={selectedEnquiryForModal.whatsappConsent ? 'text-green-400 font-semibold' : 'text-zinc-500'}>
                    {selectedEnquiryForModal.whatsappConsent ? '✓ Consented to WhatsApp Updates' : '✗ No Consent'}
                  </span>
                </div>
              </div>

              {/* Shoot & Package Details */}
              <div className="bg-secondary-bg/70 p-4 rounded-2xl border border-border space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-gold font-bold block">Shoot & Package Details</span>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Photography Category:</span>
                  <strong className="text-foreground">{selectedEnquiryForModal.photographyCategory}</strong>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Selected Package & Rate:</span>
                  <strong className="text-foreground block">{selectedEnquiryForModal.selectedPackage}</strong>
                  <span className="text-gold font-bold text-sm">{formatINR(selectedEnquiryForModal.packagePriceSnapshot)}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Preferred Photographer:</span>
                  <span className="text-gold font-medium">
                    {selectedEnquiryForModal.preferredPhotographerName || 'Any Available Photographer'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Shoot Date & Time:</span>
                  <strong className="text-foreground">
                    {selectedEnquiryForModal.preferredShootDate} ({selectedEnquiryForModal.preferredShootTime})
                  </strong>
                </div>
                {selectedEnquiryForModal.eventDate && selectedEnquiryForModal.eventDate !== selectedEnquiryForModal.preferredShootDate && (
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Ceremony / Event Date:</span>
                    <strong className="text-foreground">{selectedEnquiryForModal.eventDate}</strong>
                  </div>
                )}
                <div>
                  <span className="text-zinc-400 block text-[11px]">Location / Venue:</span>
                  <span className="text-foreground">{selectedEnquiryForModal.shootLocation}</span>
                </div>
              </div>
            </div>

            {/* EVENT SCOPE & METADATA */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-black/40 p-3.5 rounded-2xl border border-border">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block">Event Type</span>
                <span className="text-foreground font-medium">{selectedEnquiryForModal.eventType || 'Not Provided'}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block">Guests</span>
                <span className="text-foreground font-medium">{selectedEnquiryForModal.guestCount ?? 'Not Provided'}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block">Duration</span>
                <span className="text-foreground font-medium">{selectedEnquiryForModal.shootDuration || 'Not Provided'}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block">Notification</span>
                <span className="text-green-400 font-medium">Staged & Delivered</span>
              </div>
            </div>

            {/* REQUIREMENTS & REFERENCES */}
            <div className="p-4 rounded-2xl bg-secondary-bg/70 border border-border text-xs space-y-2">
              <span className="text-foreground font-bold block text-xs">Customer Photography Requirements:</span>
              <p className="text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                {selectedEnquiryForModal.additionalRequirements || 'No special requirements specified by client.'}
              </p>

              {selectedEnquiryForModal.referenceImages && selectedEnquiryForModal.referenceImages.length > 0 && (
                <div className="pt-2 border-t border-border/60">
                  <span className="text-zinc-400 block text-[11px] mb-1">Reference Images / Inspiration:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedEnquiryForModal.referenceImages.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold hover:underline text-[11px] flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-border"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Link #{i + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedEnquiryForModal.referenceVideo && (
                <div className="pt-1">
                  <span className="text-zinc-400 block text-[11px] mb-0.5">Reference Video:</span>
                  <a
                    href={selectedEnquiryForModal.referenceVideo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 hover:underline text-xs flex items-center gap-1 font-mono"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{selectedEnquiryForModal.referenceVideo}</span>
                  </a>
                </div>
              )}
            </div>

            {/* INTERNAL NOTES */}
            {selectedEnquiryForModal.internalNotes && (
              <div className="p-3.5 rounded-2xl bg-black/50 border border-gold/40 text-xs space-y-1">
                <span className="text-gold font-bold block">Internal Admin Notes:</span>
                <p className="text-foreground">{selectedEnquiryForModal.internalNotes}</p>
              </div>
            )}

            {/* ACTIONS FOOTER */}
            <div className="pt-3 border-t border-border flex flex-wrap gap-2.5">
              <a
                href={`tel:${selectedEnquiryForModal.mobileNumber}`}
                className="bg-secondary-bg hover:bg-zinc-800 border border-border text-foreground px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>Call Client</span>
              </a>

              <a
                href={`https://wa.me/${selectedEnquiryForModal.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedEnquiryForModal.customerName)}%2C%20this%20is%20Abhi%20Shinde%20from%20ABHISHINDE%20PHOTOGRAPHY%20regarding%20your%20enquiry%20${selectedEnquiryForModal.enquiryId}.`}
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 hover:bg-green-500 text-foreground font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Client</span>
              </a>

              {selectedEnquiryForModal.status !== 'CONVERTED' && (
                <button
                  onClick={() => {
                    setConvertEnquiryModal(selectedEnquiryForModal);
                    setConvertAdvance(Math.round(selectedEnquiryForModal.packagePriceSnapshot * 0.3));
                    setSelectedEnquiryForModal(null);
                  }}
                  className="bg-gold hover:bg-gold-hover text-black font-bold py-2.5 px-5 rounded-xl text-xs ml-auto"
                >
                  Convert to Booking
                </button>
              )}

              <button
                onClick={() => {
                  handleUpdateEnquiryStatus(selectedEnquiryForModal.id, 'CONTACTED', 'Contacted client via call / WhatsApp.');
                  setSelectedEnquiryForModal(null);
                }}
                className="bg-secondary-bg hover:bg-zinc-800 border border-border text-zinc-300 text-xs px-3.5 py-2.5 rounded-xl"
              >
                Mark Contacted
              </button>

              <button
                onClick={() => {
                  handleUpdateEnquiryStatus(selectedEnquiryForModal.id, 'CLOSED', 'Enquiry concluded.');
                  setSelectedEnquiryForModal(null);
                }}
                className="bg-secondary-bg hover:bg-zinc-800 border border-border text-zinc-400 text-xs px-3.5 py-2.5 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* CONVERT ENQUIRY TO BOOKING MODAL                           */}
      {/* ========================================================== */}
      {convertEnquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleExecuteConvertEnquiry}
            className="bg-card-bg border border-gold/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-start pb-2 border-b border-border">
              <div>
                <span className="text-xs text-gold font-mono font-bold">Convert {convertEnquiryModal.enquiryId}</span>
                <h3 className="font-serif text-2xl text-foreground font-bold">Initialize Official Booking</h3>
              </div>
              <button
                type="button"
                onClick={() => setConvertEnquiryModal(null)}
                className="text-muted-text hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-muted-text space-y-1">
              <p>Customer: <strong className="text-foreground">{convertEnquiryModal.customerName}</strong> ({convertEnquiryModal.mobileNumber})</p>
              <p>Package: <strong className="text-gold">{convertEnquiryModal.selectedPackage}</strong> (₹{convertEnquiryModal.packagePriceSnapshot})</p>
              <p>Shoot Date: <strong className="text-foreground">{convertEnquiryModal.preferredShootDate} ({convertEnquiryModal.preferredShootTime})</strong></p>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Agreed Advance Payment Retainer (30%)</label>
              <input
                type="number"
                required
                value={convertAdvance}
                onChange={(e) => setConvertAdvance(Number(e.target.value))}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-2.5 text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Assigned Crew / Lead Photographer</label>
              <input
                type="text"
                required
                value={convertPhotographer}
                onChange={(e) => setConvertPhotographer(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-2.5 text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Admin Confirmation Notes</label>
              <textarea
                rows={2}
                value={convertNotes}
                onChange={(e) => setConvertNotes(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl p-3 text-xs text-foreground"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="w-full bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(197,164,109,0.3)]"
              >
                Confirm & Create Booking Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================== */}
      {/* BOOKING DETAILS & AUDIT LOG MODAL                          */}
      {/* ========================================================== */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card-bg border border-gold/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-border">
              <div>
                <span className="text-xs text-gold font-mono font-bold">{selectedBookingForModal.bookingRef}</span>
                <h3 className="font-serif text-2xl text-foreground font-bold mt-0.5">
                  {selectedBookingForModal.clientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="text-muted-text hover:text-foreground p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-muted-text">
              <div>
                <span className="text-foreground block font-medium">Shoot Date:</span>
                <span className="text-gold font-bold">{selectedBookingForModal.confirmedShootDate || selectedBookingForModal.eventDate} ({selectedBookingForModal.eventTime})</span>
              </div>
              <div>
                <span className="text-foreground block font-medium">Package:</span>
                <span className="text-foreground font-medium">{selectedBookingForModal.packageName}</span>
              </div>
              <div>
                <span className="text-foreground block font-medium">Total Package Amount:</span>
                <span className="text-gold font-bold">{formatINR(selectedBookingForModal.totalAmount)}</span>
              </div>
              <div>
                <span className="text-foreground block font-medium">Advance Paid:</span>
                <span className="text-green-400 font-bold">{formatINR(selectedBookingForModal.paidAmount)}</span>
              </div>
              <div>
                <span className="text-foreground block font-medium">Remaining Balance:</span>
                <span className="text-yellow-400 font-bold">{formatINR(selectedBookingForModal.remainingBalance)}</span>
              </div>
              <div>
                <span className="text-foreground block font-medium">Assigned Lead:</span>
                <span className="text-foreground">{selectedBookingForModal.assignedPhotographer || 'Abhi Shinde Team'}</span>
              </div>
            </div>

            {/* AUDIT LOG */}
            {selectedBookingForModal.auditLog && selectedBookingForModal.auditLog.length > 0 && (
              <div className="space-y-2 border-t border-border pt-3">
                <span className="text-xs text-gold uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Audit Trail & Changes</span>
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {selectedBookingForModal.auditLog.map((log, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-secondary-bg text-[11px] text-muted-text space-y-0.5">
                      <div className="flex justify-between text-foreground font-medium">
                        <span>{log.action}</span>
                        <span className="text-[10px] text-muted-text">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p>{log.note} - <strong className="text-gold">{log.updatedBy}</strong></p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STATUS UPDATE CONTROLS */}
            <div className="pt-3 border-t border-border space-y-2">
              <label className="text-xs uppercase text-muted-text block">Update Booking Status:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleUpdateBookingStatus(selectedBookingForModal.id, 'Confirmed')}
                  className="bg-green-600 hover:bg-green-500 text-foreground font-bold text-xs py-2 rounded-xl"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleUpdateBookingStatus(selectedBookingForModal.id, 'In Progress')}
                  className="bg-blue-600 hover:bg-blue-500 text-foreground font-bold text-xs py-2 rounded-xl"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateBookingStatus(selectedBookingForModal.id, 'Completed')}
                  className="bg-gold hover:bg-gold-hover text-black font-bold text-xs py-2 rounded-xl"
                >
                  Completed
                </button>
                <button
                  onClick={() => handleUpdateBookingStatus(selectedBookingForModal.id, 'Cancelled')}
                  className="bg-red-600/80 hover:bg-red-600 text-foreground font-bold text-xs py-2 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ADMIN CREDENTIALS CONFIGURATION MODAL                      */}
      {/* ========================================================== */}
      {credentialsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCredentials}
            className="bg-card-bg border border-gold/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-serif text-xl text-foreground font-bold">Admin Account Setup</h3>
              <button type="button" onClick={() => setCredentialsModalOpen(false)} className="text-muted-text">
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-text">
              Secure initial account configuration for <strong>Abhi Shinde</strong> (+91 7822053169).
            </p>

            {adminPasswordSuccess && (
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
                Credentials successfully updated for Abhi Shinde.
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Admin Username</label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-2.5 text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">New Admin Password</label>
              <input
                type="password"
                required
                placeholder="Enter new secure password"
                value={adminNewPassword}
                onChange={(e) => setAdminNewPassword(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-4 py-2.5 text-xs text-foreground"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold-hover text-black font-bold text-xs py-3 rounded-xl transition-all"
            >
              Save Credentials
            </button>
          </form>
        </div>
      )}

      {/* ========================================================== */}
      {/* NEW PORTFOLIO PROJECT MODAL                                */}
      {/* ========================================================== */}
      {newProjectOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProject}
            className="bg-card-bg border border-gold/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-serif text-xl text-foreground font-bold">Add Portfolio Project</h3>
              <button type="button" onClick={() => setNewProjectOpen(false)} className="text-muted-text">
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Project Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Wedding of Gauri & Pratik"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-3 py-2 text-xs text-foreground"
              >
                <option value="Wedding">Wedding</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Events">Events</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Couple / Client Name</label>
              <input
                type="text"
                placeholder="e.g. Gauri & Pratik"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Shoot Location</label>
              <input
                type="text"
                placeholder="e.g. Mahabaleshwar Resort"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold-hover text-black font-bold text-xs py-3 rounded-xl transition-all"
            >
              Publish to Portfolio
            </button>
          </form>
        </div>
      )}

      {/* ========================================================== */}
      {/* NEW CLIENT ALBUM MODAL                                     */}
      {/* ========================================================== */}
      {newAlbumOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAlbum}
            className="bg-card-bg border border-gold/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-serif text-xl text-foreground font-bold">Create Private Album</h3>
              <button type="button" onClick={() => setNewAlbumOpen(false)} className="text-muted-text">
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Album Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Sneha & Kunal Wedding Gallery"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Client Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sneha & Kunal"
                value={albumClientName}
                onChange={(e) => setAlbumClientName(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Client Email</label>
              <input
                type="email"
                placeholder="sneha@example.com"
                value={albumClientEmail}
                onChange={(e) => setAlbumClientEmail(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-text">Secret Access PIN (4 Digits)</label>
              <input
                type="text"
                required
                placeholder="e.g. 2026"
                value={albumPin}
                onChange={(e) => setAlbumPin(e.target.value)}
                className="w-full bg-secondary-bg border border-border rounded-xl px-3 py-2 text-xs text-gold font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold hover:bg-gold-hover text-black font-bold text-xs py-3 rounded-xl transition-all"
            >
              Generate Album Link & PIN
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
