-- ==========================================================
-- LENS & LIGHT STUDIO (ABHISHINDE PHOTOGRAPHY)
-- POSTGRESQL DATABASE SCHEMA & SEED SCRIPT
-- ==========================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS portfolio_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    cover_image TEXT,
    features JSONB,
    duration VARCHAR(100),
    starting_price NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(255),
    slug VARCHAR(200) NOT NULL UNIQUE,
    badge VARCHAR(100),
    is_signature BOOLEAN DEFAULT FALSE,
    price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    duration VARCHAR(150),
    coverage TEXT,
    inclusions JSONB,
    deliverables JSONB,
    events_covered JSONB,
    payment_terms JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    client VARCHAR(200),
    date DATE,
    location VARCHAR(255),
    cover_image TEXT,
    gallery_images JSONB,
    video_url TEXT,
    description TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    bio TEXT,
    image TEXT,
    specialization VARCHAR(255),
    instagram VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(150) NOT NULL,
    event VARCHAR(150),
    date VARCHAR(100),
    rating INT DEFAULT 5,
    review TEXT,
    client_image TEXT,
    approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enquiries (
    id SERIAL PRIMARY KEY,
    enquiry_id VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(200) NOT NULL,
    country_code VARCHAR(10) DEFAULT '+91',
    mobile_number VARCHAR(50) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL,
    photography_category VARCHAR(100),
    preferred_photographer_id VARCHAR(50),
    preferred_photographer_name VARCHAR(200),
    selected_service VARCHAR(200),
    selected_package VARCHAR(200),
    package_price_snapshot NUMERIC(10, 2),
    preferred_shoot_date DATE,
    preferred_shoot_time VARCHAR(50),
    event_date DATE,
    shoot_location TEXT,
    shoot_city VARCHAR(100),
    shoot_area VARCHAR(150),
    venue_name VARCHAR(200),
    event_type VARCHAR(100),
    guest_count INT,
    shoot_duration VARCHAR(100),
    special_instructions TEXT,
    additional_requirements TEXT,
    reference_images JSONB,
    reference_video TEXT,
    whatsapp_consent BOOLEAN DEFAULT TRUE,
    notification_status VARCHAR(50) DEFAULT 'Delivered',
    status VARCHAR(50) DEFAULT 'New',
    internal_notes TEXT,
    converted_booking_id VARCHAR(50),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_ref VARCHAR(50) NOT NULL UNIQUE,
    enquiry_id VARCHAR(50),
    enquiry_ref VARCHAR(50),
    client_name VARCHAR(200) NOT NULL,
    client_email VARCHAR(200) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    service_name VARCHAR(200),
    package_name VARCHAR(200),
    package_price_snapshot NUMERIC(10, 2),
    event_date DATE NOT NULL,
    confirmed_shoot_date DATE,
    confirmation_date TIMESTAMP,
    event_time VARCHAR(50),
    event_location TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    advance_amount NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    booking_status VARCHAR(50) DEFAULT 'Pending',
    assigned_photographer VARCHAR(200),
    additional_notes TEXT,
    audit_log JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    client_email VARCHAR(200),
    access_pin VARCHAR(20) NOT NULL,
    access_token VARCHAR(100) NOT NULL UNIQUE,
    expiry_date DATE,
    cover_image TEXT,
    photos JSONB,
    download_enabled BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed Initial Official Abhishinde Photography Package (Both Side 1,55,000 INR)
INSERT INTO packages (
    title, subtitle, slug, badge, is_signature, price, currency, duration, coverage, 
    inclusions, deliverables, events_covered, payment_terms, is_active
) VALUES (
    'WEDDING PACKAGE - BOTH SIDE',
    'Official Abhishinde Photography Signature Collection',
    'wedding-package-both-side',
    'MOST POPULAR SIGNATURE',
    TRUE,
    155000.00,
    'INR',
    'Multi-Day Wedding Celebrations (Both Bride & Groom Side)',
    'Traditional + Candid + Cinematic + Drone Coverage for Both Sides',
    '["Engagement: Traditional & Candid", "Mehandi (Bride): Traditional", "Haldi & Wedding: Traditional, Candid, Videographer, Cinematic, Drone"]'::jsonb,
    '["Raw pictures in 1 week", "Cinematic video edit + teaser", "Couple reels edit", "Traditional video edit", "Social media photo edits", "Wedding 2 Photobook Albums 40 pages", "64 GB Pendrive Final Data", "8x12 LED Screen with Live Camera Feed"]'::jsonb,
    '["ENGAGEMENT", "MEHANDI", "MIRAVNUK", "HALDI", "VAIDIK WEDDING"]'::jsonb,
    '{"bookingAdvancePercent": 30, "beforeShootPercent": 60, "finalDeliveryPercent": 10, "notes": "30% booking advance, 60% before wedding day, 10% on photobook delivery."}'::jsonb,
    TRUE
) ON CONFLICT (slug) DO NOTHING;
