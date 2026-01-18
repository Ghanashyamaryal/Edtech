"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Subtitle, Paragraph, Small } from "@/components/atoms";
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Calendar,
  GraduationCap,
  BookOpen,
  Laptop,
  Calculator,
  Code,
  Brain,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { motion, AnimatePresence } from "framer-motion";

// Course categories for dropdown
const courseCategories = [
  {
    name: "BSc CSIT",
    href: "/courses/bsc-csit",
    icon: Code,
    description: "Computer Science & IT preparation",
  },
  {
    name: "BIT",
    href: "/courses/bit",
    icon: Laptop,
    description: "Bachelor in Information Technology",
  },
  {
    name: "BCA",
    href: "/courses/bca",
    icon: Brain,
    description: "Bachelor in Computer Application",
  },
  {
    name: "BIM",
    href: "/courses/bim",
    icon: Calculator,
    description: "Business Information Management",
  },
];

// Main navigation items
const navItems = [
  { name: "Home", href: "/" },
  {
    name: "Courses",
    href: "/courses",
    hasDropdown: true,
    dropdownItems: courseCategories,
  },
  { name: "Results", href: "/results" },
  { name: "Notes", href: "/notes" },
  { name: "Online Classes", href: "/online-classes" },
  { name: "Mock Tests", href: "/mock-tests" },
];

interface HeaderProps {
  onMenuClick: () => void;
  className?: string;
}

// Exam countdown hook
function useExamCountdown(examDate: Date) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = examDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [examDate]);

  return timeLeft;
}

// Notification item type
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

// Mock notifications - replace with real data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Live Class Starting",
    message: "Physics class starts in 30 minutes",
    time: "30 min ago",
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "Assignment Submitted",
    message: "Your Math assignment was successfully submitted",
    time: "2 hours ago",
    read: false,
    type: "success",
  },
  {
    id: "3",
    title: "Mock Test Reminder",
    message: "Complete your weekly mock test before Sunday",
    time: "1 day ago",
    read: true,
    type: "warning",
  },
];

function ExamCountdownTimer() {
  // Set exam date - this should come from user settings/API
  const examDate = React.useMemo(() => {
    // Example: Medical entrance exam date
    return new Date("2026-03-15T10:00:00");
  }, []);

  const timeLeft = useExamCountdown(examDate);

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
      <Calendar className="w-4 h-4 text-primary" />
      <div className="flex items-center gap-1 text-sm">
        <span className="font-medium text-primary">Exam in:</span>
        <div className="flex items-center gap-1">
          <TimeUnit value={timeLeft.days} label="d" />
          <span className="text-muted-foreground">:</span>
          <TimeUnit value={timeLeft.hours} label="h" />
          <span className="text-muted-foreground">:</span>
          <TimeUnit value={timeLeft.minutes} label="m" />
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="font-mono font-semibold text-foreground">
      {value.toString().padStart(2, "0")}
      <span className="text-xs text-muted-foreground">{label}</span>
    </span>
  );
}

function NotificationsDropdown() {
  const [notifications] = React.useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-80 p-0 bg-popover border border-border rounded-lg shadow-lg z-50 animate-fade-in"
          align="end"
          sideOffset={8}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenu.Item
                  key={notification.id}
                  className={cn(
                    "flex flex-col gap-1 px-4 py-3 cursor-pointer outline-none",
                    "hover:bg-accent focus:bg-accent border-b border-border last:border-0",
                    !notification.read && "bg-accent/50",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "font-medium text-sm",
                        !notification.read
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <span className="w-2 h-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <Small className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </Small>
                  <span className="text-xs text-muted-foreground/70">
                    {notification.time}
                  </span>
                </DropdownMenu.Item>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <Paragraph className="text-sm">
                  No notifications yet
                </Paragraph>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-border">
            <Link
              href="/dashboard/notifications"
              className="text-sm text-primary hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function ProfileDropdown() {
  const { user, signOut } = useAuth();

  const displayName = user?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    try {
      await signOut();
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
          <div className="px-3 py-2 border-b border-border mb-1">
            <Subtitle as="span" className="text-sm truncate">
              {displayName}
            </Subtitle>
            <Small className="text-xs text-muted-foreground truncate">
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

export function Header({ onMenuClick, className }: HeaderProps) {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(
    null,
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16 lg:h-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-b border-border px-4",
        className,
      )}
    >
      <div className="container mx-auto h-full flex items-center justify-between gap-4">
        {/* Left side: Menu button + Logo */}
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

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-glow-primary">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-xl text-foreground">
                Entrance
              </span>
              <span className="font-display font-bold text-xl text-primary">
                Pathway
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() =>
                item.hasDropdown && setActiveDropdown(item.name)
              }
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {item.name}
                {item.hasDropdown && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      activeDropdown === item.name && "rotate-180",
                    )}
                  />
                )}
              </Link>

              {/* Dropdown Menu */}
              {item.hasDropdown && (
                <AnimatePresence>
                  {activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-card rounded-xl border border-border shadow-strong p-2 z-50"
                    >
                      {item.dropdownItems?.map((dropItem) => {
                        const Icon = dropItem.icon;
                        return (
                          <Link
                            key={dropItem.name}
                            href={dropItem.href}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <Subtitle as="span" className="text-base">
                                {dropItem.name}
                              </Subtitle>
                              <Paragraph className="text-sm">
                                {dropItem.description}
                              </Paragraph>
                            </div>
                          </Link>
                        );
                      })}
                      <div className="border-t border-border mt-2 pt-2">
                        <Link
                          href="/courses"
                          className="flex items-center justify-center gap-2 p-3 rounded-lg text-primary hover:bg-primary/10 transition-colors font-medium"
                        >
                          <BookOpen className="w-4 h-4" />
                          View All Courses
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* Right side: Countdown, notifications, profile */}
        <div className="flex items-center gap-2">
          <ExamCountdownTimer />
          <NotificationsDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
