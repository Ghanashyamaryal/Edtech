'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
  animate?: boolean;
  variant?: 'default' | 'centered';
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
  animate = true,
  variant = 'centered',
  className,
}: FeatureCardProps) {
  const content = (
    <>
      <div
        className={cn(
          'w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4',
          variant === 'centered' && 'mx-auto'
        )}
      >
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-display font-semibold text-xl text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground">{description}</p>
    </>
  );

  const wrapperClassName = cn(
    variant === 'centered' && 'text-center',
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className={wrapperClassName}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={wrapperClassName}>{content}</div>;
}

// Grid wrapper for multiple feature cards
interface FeatureGridProps {
  features: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }>;
  columns?: 2 | 3 | 4;
  animate?: boolean;
  variant?: 'default' | 'centered';
  className?: string;
}

export function FeatureGrid({
  features,
  columns = 3,
  animate = true,
  variant = 'centered',
  className,
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-8', gridCols[columns], className)}>
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          {...feature}
          index={index}
          animate={animate}
          variant={variant}
        />
      ))}
    </div>
  );
}
