'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Search, Filter } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  title: string;
  highlightedText?: string;
  description: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showFilter?: boolean;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  children?: ReactNode;
  className?: string;
}

export function HeroSection({
  badge,
  title,
  highlightedText,
  description,
  showSearch = false,
  searchPlaceholder = 'Search...',
  showFilter = false,
  onSearch,
  onFilter,
  children,
  className,
}: HeroSectionProps) {
  return (
    <section className={cn('relative py-16 overflow-hidden', className)}>
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          {badge && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {badge.icon && <badge.icon className="w-4 h-4" />}
              {badge.text}
            </span>
          )}

          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
            {highlightedText && (
              <>
                {' '}
                <span className="text-gradient-primary">{highlightedText}</span>
              </>
            )}
          </h1>

          <p className="text-muted-foreground text-lg mb-8">{description}</p>

          {showSearch && (
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  className="pl-12 h-12"
                  onChange={(e) => onSearch?.(e.target.value)}
                />
              </div>
              {showFilter && (
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={onFilter}
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              )}
            </div>
          )}

          {children}
        </motion.div>
      </div>
    </section>
  );
}
