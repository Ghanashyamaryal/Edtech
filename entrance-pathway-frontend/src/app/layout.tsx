import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/atoms/toaster";
import { ProgressBar } from "@/components/atoms/progress-bar";
import { LandingFooter, LandingHeader } from "@/components/organisms/landing";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Entrance Pathway - IT Entrance Exam Preparation",
  description:
    "Prepare for IT entrance exams in Nepal with comprehensive courses, practice tests, and live classes.",
  keywords: [
    "entrance exam",
    "IT",
    "Nepal",
    "preparation",
    "courses",
    "practice tests",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <LandingHeader />
            <main className="flex-1 flex flex-col pt-8 lg:pt-8">
              {children}
            </main>
            <LandingFooter />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
