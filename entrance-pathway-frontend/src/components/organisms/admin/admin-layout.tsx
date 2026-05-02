"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar - fixed on the left */}
      <AdminSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Right side: Header + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={handleMenuClick} />

        <main
          className={cn(
            "flex-1 p-4 md:p-6 lg:p-8",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
