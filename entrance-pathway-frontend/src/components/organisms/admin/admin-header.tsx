"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui";

interface AdminHeaderProps {
  onMenuClick: () => void;
  className?: string;
}

export function AdminHeader({ onMenuClick, className }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 bg-card border-b border-border",
        "flex items-center justify-between px-4 md:px-6",
        className,
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Logo / Title */}
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-lg text-foreground hidden sm:block">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-foreground">{user?.full_name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
        </div>
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name || "User"}
            className="w-9 h-9 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              {user?.full_name?.charAt(0) || "A"}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
