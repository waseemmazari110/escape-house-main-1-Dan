import type { Metadata } from "next";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppChat from "@/components/WhatsAppChat";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import CustomAutumnProvider from "@/lib/autumn-provider";

// Generic metadata for root layout - specific pages override this
export const metadata: Metadata = {
  title: {
    default: "Group Escape Houses | Luxury Group Accommodation UK",
    template: "%s | Group Escape Houses"
  },
  description: "Luxury large group accommodation across the UK with hot tubs, pools, and stylish interiors.",
  metadataBase: new URL("https://groupescapehouses.co.uk"),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Icons are automatically generated from icon.tsx and apple-icon.tsx
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code-here", // Replace with actual code from Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://slelguoygbfzlpylpxfs.supabase.co" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://slelguoygbfzlpylpxfs.supabase.co" />
        
        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Group Escape Houses",
              "url": "https://groupescapehouses.co.uk",
              "logo": "https://groupescapehouses.co.uk/logo.png",
              "description": "Luxury large group accommodation across the UK with hot tubs, pools, and stylish interiors. Perfect for hen parties, birthdays, and weekend getaways.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "11a North St, Brighton and Hove",
                "addressLocality": "Brighton",
                "postalCode": "BN41 1DH",
                "addressCountry": "GB"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+44-xxx-xxx-xxxx",
                "contactType": "customer service",
                "email": "hello@groupescapehouses.co.uk",
                "areaServed": "GB",
                "availableLanguage": "en"
              },
              "sameAs": [
                "https://www.instagram.com/groupescapehouses/",
                "https://www.tiktok.com/@groupescapehouses",
                "https://www.pinterest.com/groupescapehouses"
              ]
            })
          }}
        />
        
        {/* Website Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Group Escape Houses",
              "url": "https://groupescapehouses.co.uk",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://groupescapehouses.co.uk/properties?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <CustomAutumnProvider>
          {children}
        </CustomAutumnProvider>
        <WhatsAppChat />
        <CookieConsent />
        <Toaster />
      
        <VisualEditsMessenger />
      </body>
    </html>
  );
}