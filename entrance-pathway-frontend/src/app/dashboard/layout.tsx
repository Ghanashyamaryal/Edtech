'use client';

import { DashboardLayout } from '@/components/organisms/dashboard';
import { ActiveCourseProvider } from '@/context';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ActiveCourseProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ActiveCourseProvider>
  );
}
