"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRequireRole } from "@/context";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { hasAccess, isLoading } = useRequireRole(["admin"], "/dashboard");

  const handleMenuClick = React.useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const handleSidebarClose = React.useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Close sidebar on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no access, the useRequireRole hook will redirect
  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen top-0 bg-muted/30 flex flex-col">
      {/* Header */}
      <AdminHeader onMenuClick={handleMenuClick} />

      {/* Content area with sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

        {/* Main content area */}
        <main
          className={cn("flex-1  w-full lg:w-[calc(100%-288px)]", className)}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
