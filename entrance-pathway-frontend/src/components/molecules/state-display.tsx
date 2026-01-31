'use client';

import { LucideIcon, AlertCircle, Loader2, Inbox } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';

// Base props shared by all state components
interface BaseStateProps {
  className?: string;
}

// Loading State
interface LoadingStateProps extends BaseStateProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({
  text = 'Loading...',
  size = 'md',
  className,
}: LoadingStateProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-sm', padding: 'p-4' },
    md: { icon: 'w-8 h-8', text: 'text-base', padding: 'p-8' },
    lg: { icon: 'w-12 h-12', text: 'text-lg', padding: 'p-12' },
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        sizes[size].padding,
        className
      )}
    >
      <Loader2
        className={cn('animate-spin text-primary mb-4', sizes[size].icon)}
      />
      <p className={cn('text-muted-foreground', sizes[size].text)}>{text}</p>
    </div>
  );
}

// Error State
interface ErrorStateProps extends BaseStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading data.',
  onRetry,
  retryText = 'Try Again',
  className,
}: ErrorStateProps) {
  return (
    <Card className={cn('p-8', className)}>
      <div className="flex flex-col items-center text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="font-display font-semibold text-xl text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4">{message}</p>
        {onRetry && <Button onClick={onRetry}>{retryText}</Button>}
      </div>
    </Card>
  );
}

// Empty State
interface EmptyStateProps extends BaseStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'There is nothing to display at the moment.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('p-8', className)}>
      <div className="flex flex-col items-center text-center">
        <Icon className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-display font-semibold text-xl text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {action && <Button onClick={action.onClick}>{action.label}</Button>}
      </div>
    </Card>
  );
}

// Skeleton for card grids
interface SkeletonGridProps extends BaseStateProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  variant?: 'card' | 'list';
}

export function SkeletonGrid({
  count = 4,
  columns = 2,
  variant = 'card',
  className,
}: SkeletonGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (variant === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-muted animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Combined data state handler
interface DataStateProps<T> {
  data: T[] | undefined;
  loading: boolean;
  error?: Error | null;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingText?: string;
  skeletonCount?: number;
  skeletonColumns?: 1 | 2 | 3 | 4;
  children: (data: T[]) => React.ReactNode;
}

export function DataState<T>({
  data,
  loading,
  error,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  loadingText,
  skeletonCount = 4,
  skeletonColumns = 2,
  children,
}: DataStateProps<T>) {
  if (loading) {
    return (
      <SkeletonGrid count={skeletonCount} columns={skeletonColumns} />
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return <>{children(data)}</>;
}
