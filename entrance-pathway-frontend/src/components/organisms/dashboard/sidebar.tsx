"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Video,
  PlayCircle,
  FileText,
  BarChart3,
  BookOpen,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";

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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 lg:top-20 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 lg:top-20 left-0 z-40 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] w-72 bg-card border-r border-border",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:sticky",
          isOpen
            ? "translate-x-0 shadow-strong"
            : "-translate-x-full lg:shadow-none",
          className,
        )}
      >
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

        {/* Footer */}
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

export { navigationItems };
