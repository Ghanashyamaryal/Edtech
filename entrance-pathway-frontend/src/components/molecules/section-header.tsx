'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Title, Paragraph } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  title: string;
  highlightedText?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  animate?: boolean;
}

export function SectionHeader({
  badge,
  title,
  highlightedText,
  description,
  align = 'center',
  className,
  animate = true,
}: SectionHeaderProps) {
  const content = (
    <>
      {badge && (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          {badge.icon && <badge.icon className="w-4 h-4" />}
          {badge.text}
        </span>
      )}
      <Title as="h2" className="mb-4">
        {title}
        {highlightedText && (
          <>
            {' '}
            <span className="text-gradient-primary">{highlightedText}</span>
          </>
        )}
      </Title>
      {description && (
        <Paragraph
          className={cn(
            'text-muted-foreground',
            align === 'center' && 'max-w-2xl mx-auto'
          )}
        >
          {description}
        </Paragraph>
      )}
    </>
  );

  const wrapperClassName = cn(
    'mb-12',
    align === 'center' && 'text-center',
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={wrapperClassName}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={wrapperClassName}>{content}</div>;
}
