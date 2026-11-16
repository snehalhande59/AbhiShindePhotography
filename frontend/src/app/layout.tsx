import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ABHISHINDE PHOTOGRAPHY – We Make "Cine Stories" 🎥🎬 | Wedding & Pre-Wedding Cinema',
  description: 'We make "CINE STORIES" 🎥🎬. Luxury wedding and pre-wedding photography studio directed by Abhi Shinde. Serving Nashik, Pune, Mumbai and global destinations. Direct WhatsApp: +91 7822053169.',
  keywords: [
    'Abhishinde Photography',
    'Abhi Shinde',
    'Wedding Photography Pune',
    'Wedding Photography Nashik',
    'Wedding Photography Mumbai',
    'Cine Stories',
    'Both Side Wedding Package 155000',
    'Pre-Wedding Destination Shoot',
  ],
  authors: [{ name: 'Abhi Shinde', url: 'https://instagram.com/abhishinde_06' }],
  openGraph: {
    title: 'ABHISHINDE PHOTOGRAPHY – We Make "Cine Stories"',
    description: 'Luxury wedding & pre-wedding photography and cinema by Abhi Shinde.',
    url: 'https://abhishindephotography.com',
    siteName: 'ABHISHINDE PHOTOGRAPHY',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'ABHISHINDE PHOTOGRAPHY',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABHISHINDE PHOTOGRAPHY – We Make "Cine Stories"',
    description: 'Luxury wedding & pre-wedding cinema by Abhi Shinde (+91 7822053169).',
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Structured Data for Google Rich Results (Schema.org) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'PhotographyBusiness',
              name: 'ABHISHINDE PHOTOGRAPHY – We Make Cine Stories',
              image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
              telephone: '+917822053169',
              email: 'abhishinde.photography@gmail.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Sinnar / Nashik, Pune & Mumbai',
                addressLocality: 'Sinnar, Nashik',
                addressRegion: 'Maharashtra',
                postalCode: '422103',
                addressCountry: 'IN',
              },
              priceRange: '₹25,000 - ₹2,25,000',
              url: 'https://abhishindephotography.com',
              sameAs: [
                'https://www.instagram.com/abhishinde_photography',
                'https://www.instagram.com/abhishinde_06',
              ],
            }),
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased selection:bg-gold selection:text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
