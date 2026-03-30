import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Results - Student Success Stories',
  description:
    'See how IT Pro Entrance students perform in IT entrance exams across Nepal. Results and success stories from BIT, BCA, BSc CSIT, and BIM exams.',
  alternates: { canonical: '/results' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
