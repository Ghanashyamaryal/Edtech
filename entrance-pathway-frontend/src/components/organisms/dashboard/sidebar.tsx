"use client";

import { Button } from "@/components/ui";
import { useRole } from "@/context/auth-context";
import { useActiveCourse } from "@/context";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  Home,
  MessageSquare,
  PlayCircle,
  Settings,
  Shield,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigationItems: NavItem[] = [
  {
    label: "My Pathway",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Live Classes",
    href: "/dashboard/live-classes",
    icon: Video,
  },
  {
    label: "Recorded Lectures",
    href: "/dashboard/recorded-lectures",
    icon: PlayCircle,
  },
  {
    label: "Mock Tests",
    href: "/dashboard/mock-tests",
    icon: FileText,
  },
  {
    label: "Performance & Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Study Materials",
    href: "/dashboard/study-materials",
    icon: BookOpen,
  },
  {
    label: "Mentor Feedback",
    href: "/dashboard/mentor-feedback",
    icon: MessageSquare,
  },
  {
    label: "Profile Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const { isAdmin } = useRole();
  const { activeCourse, loading: activeCourseLoading } = useActiveCourse();

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
          <span className="font-semibold text-foreground">Dashboard Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Active Course Pill */}
        <div className="px-4 mb-2">
          {activeCourseLoading ? (
            <div className="h-12 rounded-xl bg-muted animate-pulse" />
          ) : activeCourse ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Your course
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {activeCourse.title}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-900">No course yet</p>
                <p className="text-xs text-amber-800">Contact support to enroll</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      // Close mobile sidebar on navigation
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
                    {item.badge && item.badge > 0 && (
                      <span className="flex items-center justify-center min-w-6 h-6 px-2 text-xs font-semibold bg-destructive text-destructive-foreground rounded-full">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Admin Link */}
        {isAdmin && (
          <div className="px-3 pb-2">
            <Link
              href="/admin"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
                <Shield className="w-5 h-5" />
              </div>
              <span>Admin Panel</span>
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20">
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

export { navigationItems };

