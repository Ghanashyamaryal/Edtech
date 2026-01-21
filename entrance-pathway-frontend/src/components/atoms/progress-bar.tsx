'use client';

import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  className?: string;
  color?: string;
  height?: number;
}

function ProgressBar({
  className,
  color = 'bg-blue-500',
  height = 3,
}: ProgressBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Start progress when clicking on links
  const handleLinkClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');

    if (anchor) {
      const href = anchor.getAttribute('href');
      // Only trigger for internal navigation links
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
        if (href !== currentPath && href !== pathname) {
          setIsNavigating(true);
          setIsVisible(true);
          setProgress(20);
        }
      }
    }
  }, [pathname, searchParams]);

  // Listen for link clicks
  useEffect(() => {
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [handleLinkClick]);

  // Progress animation while navigating
  useEffect(() => {
    if (!isNavigating) return;

    const timer1 = setTimeout(() => setProgress(40), 100);
    const timer2 = setTimeout(() => setProgress(60), 300);
    const timer3 = setTimeout(() => setProgress(80), 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isNavigating]);

  // Complete progress when route changes
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsNavigating(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  if (!isVisible) return null;

  return (
    <div
      className={cn('fixed top-0 left-0 right-0 z-[9999]', className)}
      style={{ height: `${height}px` }}
    >
      <div
        className={cn('h-full transition-all ease-out', color)}
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '200ms' : '400ms'
        }}
      />
    </div>
  );
}

export { ProgressBar };
