"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Subtitle, Paragraph, Small } from "@/components/atoms";
import { useAuth } from "@/context/auth-context";
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Laptop,
  Calculator,
  Code,
  Brain,
  Bell,
  Calendar,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";

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

// Main navigation items for landing pages
const landingNavItems = [
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

// Exam countdown hook
function useExamCountdown(examDate: Date) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
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
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [examDate]);

  return timeLeft;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="font-mono font-semibold text-foreground">
      {value.toString().padStart(2, "0")}
      <span className="text-xs text-muted-foreground">{label}</span>
    </span>
  );
}

function ExamCountdownTimer() {
  const examDate = React.useMemo(() => new Date("2026-03-15T10:00:00"), []);
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

function NotificationsDropdown() {
  const notifications = [
    {
      id: "1",
      title: "Live Class Starting",
      message: "Physics class starts in 30 minutes",
      read: false,
    },
    {
      id: "2",
      title: "Assignment Submitted",
      message: "Your Math assignment was successfully submitted",
      read: false,
    },
  ];
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
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-80 p-0 bg-popover border border-border rounded-lg shadow-lg z-[60] animate-fade-in"
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
            {notifications.map((notification) => (
              <DropdownMenu.Item
                key={notification.id}
                className={cn(
                  "flex flex-col gap-1 px-4 py-3 cursor-pointer outline-none",
                  "hover:bg-accent focus:bg-accent border-b border-border last:border-0",
                  !notification.read && "bg-accent/50",
                )}
              >
                <Subtitle as="span" className="text-sm">
                  {notification.title}
                </Subtitle>
                <Small className="text-xs">
                  {notification.message}
                </Small>
              </DropdownMenu.Item>
            ))}
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
          className="w-56 p-1 bg-popover border border-border rounded-lg shadow-lg z-[60] animate-fade-in"
          align="end"
          sideOffset={8}
        >
          <div className="px-3 py-2 border-b border-border mb-1">
            <Subtitle as="p" className="text-sm truncate">
              {displayName}
            </Subtitle>
            <Small className="text-xs truncate block">
              {user?.email}
            </Small>
          </div>

          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-accent focus:bg-accent"
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
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

export function LandingHeader() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(
    null,
  );

  // Check if we're on dashboard pages
  const isDashboard = pathname.startsWith("/dashboard");

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Don't render header on dashboard - dashboard has its own layout
  if (isDashboard) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-medium border-b border-border"
          : "bg-transparent",
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
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

          {/* Desktop Navigation - Landing pages */}
          <div className="hidden lg:flex items-center gap-1">
            {landingNavItems.map((item) => (
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
                        className="absolute top-full left-0 mt-2 w-72 bg-card rounded-xl border border-border shadow-strong p-2"
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
                                <Subtitle as="p" className="text-base">
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

          {/* Right side - Auth state dependent */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated ? (
              <>
                <ExamCountdownTimer />
                <NotificationsDropdown />
                <ProfileDropdown />
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 bg-background z-40 lg:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="container mx-auto px-4 py-6"
            >
              <div className="space-y-2">
                {landingNavItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {item.hasDropdown ? (
                      <div className="space-y-2">
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between w-full px-4 py-3 rounded-lg text-lg font-medium",
                            pathname === item.href
                              ? "text-primary bg-primary/10"
                              : "text-foreground hover:bg-muted",
                          )}
                        >
                          {item.name}
                        </Link>
                        <div className="ml-4 space-y-1 border-l-2 border-border pl-4">
                          {item.dropdownItems?.map((dropItem) => {
                            const Icon = dropItem.icon;
                            return (
                              <Link
                                key={dropItem.name}
                                href={dropItem.href}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                              >
                                <Icon className="w-4 h-4" />
                                {dropItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 rounded-lg text-lg font-medium",
                          pathname === item.href
                            ? "text-primary bg-primary/10"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Mobile Auth/Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 space-y-3"
              >
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="block">
                      <Button variant="default" className="w-full" size="lg">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block">
                      <Button variant="outline" className="w-full" size="lg">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="block">
                      <Button className="w-full" size="lg">
                        Get Started Free
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
