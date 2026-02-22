import { LandingHeader, LandingFooter } from "@/components/organisms/landing";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 flex flex-col">{children}</main>
      <LandingFooter />
    </div>
  );
}
