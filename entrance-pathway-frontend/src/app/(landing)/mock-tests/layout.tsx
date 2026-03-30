import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mock Tests - Practice IT Entrance Exams',
  description:
    'Take free mock tests for BIT, BCA, BSc CSIT, and BIM entrance exams. Timed practice tests with detailed answers and performance analytics.',
  alternates: { canonical: '/mock-tests' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
