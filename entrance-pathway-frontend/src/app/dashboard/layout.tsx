'use client';

import { DashboardLayout } from '@/components/organisms/dashboard';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
