import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Classes - Live IT Entrance Preparation',
  description:
    'Join live online classes for IT entrance exam preparation. Interactive sessions with expert instructors covering BIT, BCA, BSc CSIT, and BIM syllabi.',
  alternates: { canonical: '/online-classes' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
