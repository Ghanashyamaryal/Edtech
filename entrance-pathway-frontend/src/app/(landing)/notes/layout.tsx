import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Notes - IT Entrance Exam Materials',
  description:
    'Download free study notes and materials for IT entrance exams in Nepal. Comprehensive notes for BIT, BCA, BSc CSIT, and BIM preparation.',
  alternates: { canonical: '/notes' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
