'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { Subtitle, Paragraph, Small } from '@/components/atoms';

const footerLinks = {
  courses: {
    title: 'Courses',
    links: [
      { name: 'BSc CSIT', href: '/courses/bsc-csit' },
      { name: 'BIT', href: '/courses/bit' },
      { name: 'BCA', href: '/courses/bca' },
      { name: 'BIM', href: '/courses/bim' },
      { name: 'All Courses', href: '/courses' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { name: 'Study Notes', href: '/notes' },
      { name: 'Mock Tests', href: '/mock-tests' },
      { name: 'Online Classes', href: '/online-classes' },
      { name: 'Results', href: '/results' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Student Guide', href: '/guide' },
      { name: 'Technical Support', href: '/support' },
    ],
  },
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/entrancepathway' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/entrancepathway' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@entrancepathway' },
];

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-background">
                  Entrance
                </span>
                <span className="font-display font-bold text-xl text-primary">
                  Pathway
                </span>
              </div>
            </Link>
            <Paragraph className="mb-6 max-w-sm">
              Nepal's leading platform for IT entrance exam preparation. Join thousands
              of students on their journey from preparation to celebration.
            </Paragraph>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="mailto:info@entrancepathway.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-background transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@entrancepathway.com
              </a>
              <a
                href="tel:+9779800000000"
                className="flex items-center gap-3 text-muted-foreground hover:text-background transition-colors"
              >
                <Phone className="w-4 h-4" />
                +977 980-0000-000
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
                    className="p-2 rounded-lg bg-muted/10 hover:bg-primary hover:text-primary-foreground transition-colors"
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
                      className="text-muted-foreground hover:text-background transition-colors text-sm"
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
        <div className="mt-12 pt-8 border-t border-muted/20">
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
                className="bg-muted/10 border-muted/20 text-background placeholder:text-muted-foreground w-full md:w-64"
              />
              <Button type="submit" className="gap-2 flex-shrink-0">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-muted/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Small className="text-sm">
              &copy; {currentYear} Entrance Pathway. All rights reserved.
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
