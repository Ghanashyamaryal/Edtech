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
          className="fixed inset-0 top-16 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 bg-card border-r border-border",
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
        <div className="p-4 border-t border-border">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}

export { adminNavigationItems };
