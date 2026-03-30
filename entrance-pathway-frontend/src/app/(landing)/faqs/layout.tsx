import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQs - Frequently Asked Questions',
  description:
    'Find answers to common questions about IT entrance exam preparation, courses, pricing, and how IT Pro Entrance can help you succeed.',
  alternates: { canonical: '/faqs' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
