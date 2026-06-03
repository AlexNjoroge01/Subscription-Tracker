import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import "./globals.css";
import Script from "next/script";
import { OrganizationJsonLd, WebApplicationJsonLd, HomepageFAQJsonLd } from "@/components/json-ld";
import { initNotificationPolling } from "@/lib/notifications/init";

// Initialize notification polling on server startup
initNotificationPolling();

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SubTrack - Smart Subscription Tracker & Budget Manager",
    template: "%s | SubTrack",
  },
  description: "Track all your subscriptions in one place. Get renewal reminders, analyze spending patterns, and save money. Monitor Netflix, Spotify, and 100+ services effortlessly.",
  keywords: [
    "subscription tracker",
    "subscription manager",
    "budget tracker",
    "expense tracker",
    "renewal reminders",
    "Netflix tracker",
    "Spotify tracker",
    "subscription management",
    "monthly expenses",
    "recurring payments",
    "subscription calendar",
    "budget planning",
    "personal finance",
  ],
  authors: [{ name: "SubTrack Team" }],
  creator: "SubTrack",
  publisher: "SubTrack",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://subtrack.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SubTrack",
    title: "SubTrack - Smart Subscription Tracker & Budget Manager",
    description: "Track all your subscriptions in one place. Get renewal reminders, analyze spending patterns, and save money.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SubTrack - Subscription Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SubTrack - Smart Subscription Tracker",
    description: "Track all your subscriptions in one place. Get renewal reminders, analyze spending patterns, and save money.",
    images: ["/og-image.png"],
    creator: "@subtrack",
  },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="/" />
        <OrganizationJsonLd />
        <WebApplicationJsonLd />
        <HomepageFAQJsonLd />
      </head>
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased font-sans`}
      >
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
      <script async defer src="https://cloud.umami.is/script.js" data-website-id="a76cdf5b-efa9-408c-9ff7-19738539ceeb"></script>
    </html>
  );
}

