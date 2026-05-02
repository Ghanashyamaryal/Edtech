"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Small, Subtitle } from "@/components/atoms";
import { Button } from "@/components/ui";
import { useAuth, useRole } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  LogOut,
  Menu,
  Settings,
  Shield,
  User,
} from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
  className?: string;
}

function ProfileDropdown() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useRole();
  const router = useRouter();

  const displayName = user?.full_name || user?.email?.split("@")[0] || "Admin";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 h-10"
          aria-label="User menu"
        >
          <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden bg-primary">
            <Avatar.Image
              src={user?.avatar_url || undefined}
              alt={displayName}
              className="w-full h-full object-cover"
            />
            <Avatar.Fallback className="flex items-center justify-center w-full h-full text-xs font-medium text-primary-foreground bg-primary">
              {initials}
            </Avatar.Fallback>
          </Avatar.Root>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-56 p-1 bg-popover border border-border rounded-lg shadow-lg z-50 animate-fade-in"
          align="end"
          sideOffset={8}
        >
          <div className="px-3 py-2 border-b border-border mb-1 flex flex-col min-w-0">
            <Subtitle className="text-sm truncate font-semibold">
              {displayName}
            </Subtitle>
            <Small className="text-xs text-muted-foreground truncate block">
              {user?.email}
            </Small>
          </div>

          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-accent focus:bg-accent"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-accent focus:bg-accent"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px my-1 bg-border" />

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-destructive/10 focus:bg-destructive/10 text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function AdminHeader({ onMenuClick, className }: AdminHeaderProps) {
  const { user } = useAuth();
  const displayName = user?.full_name || user?.email?.split("@")[0] || "Admin";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16 lg:h-20 bg-white",
        "border-b border-border/50 px-4",
        className,
      )}
    >
      <div className="container mx-auto h-full flex items-center justify-between gap-4">
        {/* Left side: Menu button + Welcome message */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Welcome Message */}
          <div className="hidden md:flex flex-col border-border">
            <span className="text-xs font-medium text-muted-foreground leading-none mb-1">
              Welcome,
            </span>
            <span className="text-sm font-bold text-foreground leading-tight">
              {displayName}
            </span>
          </div>
        </div>

        {/* Right side: Profile dropdown */}
        <div className="flex items-center gap-2">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
