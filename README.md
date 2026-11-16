# LENS & LIGHT STUDIO – Premium Photography Business Platform
### Featuring Official Collections by Abhishinde Photography (@Abhishinde_photography)

"WE CAPTURE YOUR FOREVER."

A complete, production-ready, luxury photography business platform built with Next.js 14 App Router, TypeScript, Tailwind CSS, Three.js 3D Interactive Master Lens, Strapi CMS backend architecture, PostgreSQL database schema, custom dark-themed admin dashboard, multi-step booking management, private client galleries, and Razorpay payment integration.

---

## 🌟 Key Features & Specifications

### 1. Customer Website (14 Fully Functional Pages)
1. **Home (`/`)**:
   - Full-screen dark cinematic hero with animated logo, tagline, and CTA
   - Interactive 3D Camera / Shutter Lens in Three.js with mouse tracking & levitation
   - Curated portfolio masonry with category filters, hover animations & lightbox
   - Before & After interactive slider for color grading demonstration
   - About studio spotlight with founder Abhi Shinde
   - Spotlight section for the official flyer **WEDDING PACKAGE - BOTH SIDE (₹1,55,000)**
   - 4K cinematic film preview modal
   - Couple love letters & testimonials
   - Dynamic Instagram social gallery (`@Abhishinde_photography`)
   - High-impact closing CTA & luxury footer

2. **About Us (`/about`)**:
   - Founder Abhi Shinde's artistic vision and decade-long mastery
   - 3 Studio pillars: Editorial Authenticity, Uncompromising Reliability, Empathetic Storytelling
   - Full 8-member production crew overview

3. **Portfolio (`/portfolio`)**:
   - Dynamic category filtering (Wedding, Pre-Wedding, Engagement, Events, Fashion, Maternity, Corporate)
   - Real-time search by location, couple, and venue
   - Full-screen lightbox with multi-photo carousel & keyboard shortcuts

4. **Portfolio Details (`/portfolio/[slug]`)**:
   - Complete project overview, shoot date, venue, high-res gallery
   - 4K cinema film video player
   - Related stories and direct booking CTA

5. **Services (`/services`)**:
   - 10 comprehensive services: Wedding, Pre-Wedding, Cinematic Films, Aerial Drone, Fashion, Maternity & Newborn, Corporate, Private Events, etc.
   - Transparent starting prices and feature checklists

6. **Packages (`/packages`)**:
   - **Featured Signature Collection**: **WEDDING PACKAGE - BOTH SIDE (₹1,55,000)**
     - Engagement (Traditional & Candid)
     - Mehandi Bride (Traditional)
     - Haldi & Wedding (Traditional, Videographer, Candid, Cinematic, Drone)
     - Deliverables: 1-week raw photos turnaround, Cinematic video edit + teaser, Couple reels, 8x12 LED Screen with live feed, 2x 40-page Photobook albums, 64 GB Pendrive delivery
     - Events: Engagement, Mehandi, Miravnuk, Haldi, Vaidik Wedding
     - Payment Schedule: 30% on booking date (₹46,500), 60% before wedding day (₹93,000), 10% upon complete delivery (₹15,500)
   - Additional packages: Basic (₹45,000), Premium (₹85,000), Luxury Royal (₹2,25,000)

7. **Films (`/films`)**:
   - 4K cinema player modal for full-screen theater viewing
   - Highlight trailers and reels

8. **Our Team (`/team`)**:
   - Profiles of Abhi Shinde (Founder/Director), Priya Deshmukh (Candid), Rohan Kulkarni (Cinema/Drone), Aniket Patil (Traditional/Lighting), Sneha Joshi (Album Curator)

9. **Testimonials (`/testimonials`)**:
   - Couple reviews with star ratings and photos
   - Interactive submission form to leave reviews

10. **Booking (`/booking`)**:
    - Complete 8-step multi-stage booking system:
      - Step 1: Select Photography Service
      - Step 2: Select Shoot Package
      - Step 3: Select Date & Time (with real-time calendar availability check)
      - Step 4: Shoot Venue & Location
      - Step 5: Customer Details (Bride/Groom names, WhatsApp, Email, Notes)
      - Step 6: Visual Inspiration / Reference links
      - Step 7: Review Contract & Payment Schedule
      - Step 8: Razorpay Advance Payment checkout & instant confirmation receipt with confetti celebration!

11. **Contact Us (`/contact`)**:
    - Inquiry form with instant database storage
    - Direct WhatsApp concierge link (`+91 98220 12345`)
    - Studio address and dark-themed Google Maps embed

12. **Private Client Gallery (`/client-gallery`)**:
    - PIN / Token protected client access (Demo PIN: `2026` or Token: `royal-tanvi-aditya-778`)
    - High-resolution photo preview, lightbox, and ZIP download

13. **Privacy Policy (`/privacy-policy`)**:
    - Professional terms on image privacy, client data, and secure payment processing

14. **Terms and Conditions (`/terms-and-conditions`)**:
    - Official studio rules: 30%-60%-10% payment schedule, 7-day raw delivery, outstation travel terms

---

### 2. Custom Admin Dashboard (`/admin-dashboard`)
Accessible at `/admin-dashboard` with 11 operational modules:
1. **Overview Dashboard**: Key revenue tiles, total pipeline value, confirmed bookings, pending balances, recent booking logs
2. **Booking Manager**: Full table view, search, status filters (Confirmed, Pending, In Progress, Completed, Cancelled), photographer assignment, status updater
3. **Shoots Calendar**: Daily, weekly, and monthly visual calendar views
4. **Portfolio Media**: Add new projects, upload cover images, delete items
5. **Packages & Rate Card**: Manage active packages, view pricing and inclusions
6. **Clients & CRM**: Directory of client contacts, booking history, direct WhatsApp messaging
7. **Private Galleries**: Create new client albums, generate secret 4-digit PINs and shareable tokens
8. **Leads & Enquiries**: View website contact submissions with service category and follow-up notes
9. **Payments & Receipts**: Financial ledger with Razorpay transaction IDs and printable receipts
10. **Financial Reports**: Service volume distribution, revenue realization breakdown, and 1-click CSV export
11. **Website Settings**: Brand settings, studio coordinates, Instagram handle `@Abhishinde_photography`

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Three.js (3D Canvas), Lucide Icons, Canvas Confetti
- **Backend & Database**: Strapi CMS schemas, PostgreSQL database schema (`backend/database/schema.sql`), REST API routes
- **Payments**: Razorpay order generation & server-side signature verification
- **Notifications**: Automated email & WhatsApp dispatch logger

---

## 🚀 How to Run

### Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
To access the custom admin dashboard, visit [http://localhost:3000/admin-dashboard](http://localhost:3000/admin-dashboard).

### Production Build
```bash
cd frontend
npm run build
npm start
```

### Backend (Strapi + PostgreSQL)
```bash
cd backend
npm run develop
```
Configure your `.env` file from `backend/.env.example`.
To seed PostgreSQL, run `backend/database/schema.sql` on your database.

---
*Note: As explicitly requested, this project is kept strictly local and is not pushed to git.*
