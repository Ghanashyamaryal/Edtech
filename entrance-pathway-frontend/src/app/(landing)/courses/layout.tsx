import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses - BIT, BCA, BSc CSIT, BIM Entrance Preparation',
  description:
    'Browse comprehensive IT entrance exam preparation courses for BIT, BCA, BSc CSIT, and BIM. Video lectures, practice questions, and study materials.',
  alternates: { canonical: '/courses' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
