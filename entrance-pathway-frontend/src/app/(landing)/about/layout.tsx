import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about IT Pro Entrance - Nepal\'s leading platform for IT entrance exam preparation. Our mission, team, and commitment to student success.',
  alternates: { canonical: '/about' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
