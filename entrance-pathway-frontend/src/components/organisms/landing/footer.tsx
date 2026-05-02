"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { Subtitle, Paragraph, Small } from "@/components/atoms";

const footerLinks = {
  courses: {
    title: "Courses",
    links: [
      { name: "BSc CSIT", href: "/courses/bsc-csit" },
      { name: "BIT", href: "/courses/bit" },
      { name: "BCA", href: "/courses/bca" },
      { name: "BIM", href: "/courses/bim" },
      { name: "All Courses", href: "/courses" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Study Notes", href: "/notes" },
      { name: "Mock Tests", href: "/mock-tests" },
      { name: "Online Classes", href: "/online-classes" },
      { name: "Blog", href: "/blog" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "FAQs", href: "/faqs" },
      { name: "Student Guide", href: "/guide" },
      { name: "Technical Support", href: "/support" },
    ],
  },
};

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/itproentrance1",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/itproentrance",
  },
];

export function LandingFooter() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Don't render footer on dashboard or admin pages
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#1C1B4B] bottom-0 text-white">
      {/* Main Footer */}
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center mb-8 group">
              <div className="flex items-center justify-center h-16 w-56 overflow-hidden transform transition-all duration-700 p-2 rounded-2xl group-hover:scale-105">
                 <img src="/assets/logo.png" alt="ITpro Entrance Logo" className="w-full h-full object-contain filter drop-shadow-xl brightness-105" />
              </div>
            </Link>
            <Paragraph className="mb-6 max-w-sm">
              Nepal's leading platform for IT entrance exam preparation. Join
              thousands of students on their journey from preparation to
              celebration.
            </Paragraph>

            {/* Contact Info */}
            <div className="space-y-3 mb-4">
              <a
                href="mailto:itproentrance@gmail.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-background transition-colors"
              >
                <Mail className="w-4 h-4" />
                itproentrance@gmail.com
              </a>
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Kathmandu, Nepal</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-brand-primary/20 hover:text-white transition-all"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <Subtitle as="h4" className="font-display text-background mb-4">
                {section.title}
              </Subtitle>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-brand-orange transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Subtitle as="h4" className="font-display text-background mb-1">
                Subscribe to Our Newsletter
              </Subtitle>
              <Small className="text-sm">
                Get the latest updates, study tips, and exam notifications.
              </Small>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 w-full md:w-64 focus:ring-brand-primary"
              />
              <Button type="submit" className="bg-brand-primary hover:bg-brand-primary/90 text-white gap-2 flex-shrink-0">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div>
        <div className="container  mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Small className="text-sm">
              &copy; {currentYear} <Link href="https://itpro-entrance.com/">itpro-entrance</Link>. All rights reserved.
            </Small>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-background text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-background text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-muted-foreground hover:text-background text-sm transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
