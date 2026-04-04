import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/atoms/toaster";
import { ProgressBar } from "@/components/atoms/progress-bar";

const SITE_URL = "https://itpro-entrance.com";
const SITE_NAME = "IT Pro Entrance";
const SITE_DESCRIPTION =
  "Nepal's leading IT entrance exam preparation platform. Comprehensive courses, mock tests, live classes, and study materials for BIT, BCA, BSc CSIT, and BIM entrance exams.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IT Pro Entrance - IT Entrance Exam Preparation Nepal",
    template: "%s | IT Pro Entrance",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "IT entrance exam Nepal",
    "BIT entrance preparation",
    "BCA entrance exam",
    "BSc CSIT entrance",
    "BIM entrance preparation",
    "IT entrance mock test",
    "entrance exam preparation Nepal",
    "online classes Nepal",
    "IT entrance courses",
    "entrance exam practice tests",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "IT Pro Entrance - IT Entrance Exam Preparation Nepal",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IT Pro Entrance - Prepare for IT Entrance Exams in Nepal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IT Pro Entrance - IT Entrance Exam Preparation Nepal",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
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
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
