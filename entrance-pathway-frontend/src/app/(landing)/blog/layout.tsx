import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - IT Entrance Exam Tips & Updates',
  description:
    'Read the latest tips, strategies, and updates for IT entrance exams in Nepal. Expert advice for BIT, BCA, BSc CSIT, and BIM preparation.',
  alternates: { canonical: '/blog' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
