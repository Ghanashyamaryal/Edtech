"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  HelpCircle,
  Layers,
  ClipboardList,
  FileText,
  Video,
  PlayCircle,
  X,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNavigationItems: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    label: "Subjects & Topics",
    href: "/admin/subjects",
    icon: Layers,
  },
  {
    label: "Question Bank",
    href: "/admin/question-bank",
    icon: HelpCircle,
  },
  {
    label: "Exams",
    href: "/admin/exams",
    icon: ClipboardList,
  },
  {
    label: "Live Classes",
    href: "/admin/live-classes",
    icon: Video,
  },
  {
    label: "Recorded Lectures",
    href: "/admin/recorded-lectures",
    icon: PlayCircle,
  },
  {
    label: "Notes & Materials",
    href: "/admin/notes",
    icon: FileText,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function AdminSidebar({ isOpen, onClose, className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-72 bg-card border-r border-border",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:sticky",
          isOpen
            ? "translate-x-0 shadow-strong"
            : "-translate-x-full lg:shadow-none",
          className,
        )}
      >
        {/* Logo Section (Desktop) */}
        <div className="hidden lg:flex items-center h-10 lg:h-20 px-6 border-b border-border mb-2">
          <Link href="/" className="flex items-center group">
            <div className="flex items-center justify-center h-14 w-44 overflow-hidden transform transition-all duration-500 group-hover:scale-105">
              <img src="/assets/logo.png" alt="ITpro Entrance Logo" className="w-full h-full object-contain object-left drop-shadow-md" />
            </div>
          </Link>
        </div>

        {/* Mobile close button */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-border lg:hidden">
          <span className="font-semibold text-foreground">Admin Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {adminNavigationItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium",
                      "transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - Back to Dashboard */}
        <div className="px-3 pb-2">
          <Link
            href="/dashboard"
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Support Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-secondary-foreground">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Need Help?
              </p>
              <p className="text-xs text-muted-foreground">
                Contact our support team
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export { adminNavigationItems };
