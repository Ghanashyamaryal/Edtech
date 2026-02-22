import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/atoms/toaster";
import { ProgressBar } from "@/components/atoms/progress-bar";

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
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
