import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import "./globals.css";
import Script from "next/script";

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
  title: "SubTrack - Subscription Tracker",
  description: "Track and manage your subscriptions with elegance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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

