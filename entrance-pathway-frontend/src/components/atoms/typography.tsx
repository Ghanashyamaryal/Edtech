import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const typographyVariants = cva(
  'font-inter',
  {
    variants: {
      variant: {
        title: 'text-2xl md:text-3xl font-bold tracking-tight text-foreground',
        subtitle: 'text-lg md:text-xl font-semibold text-foreground',
        paragraph: 'text-base font-normal text-muted-foreground',
        small: 'text-sm font-normal text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'paragraph',
    },
  }
);

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: TypographyElement;
}

const defaultElementMap: Record<NonNullable<TypographyProps['variant']>, TypographyElement> = {
  title: 'h1',
  subtitle: 'h2',
  paragraph: 'p',
  small: 'span',
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'paragraph', as, children, ...props }, ref) => {
    const Component = as || defaultElementMap[variant ?? 'paragraph'];

    return React.createElement(
      Component,
      {
        className: cn(typographyVariants({ variant, className })),
        ref,
        ...props,
      },
      children
    );
  }
);
Typography.displayName = 'Typography';

const Title = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'>>(
  ({ className, as = 'h1', ...props }, ref) => (
    <Typography
      ref={ref as React.Ref<HTMLElement>}
      variant="title"
      as={as}
      className={className}
      {...props}
    />
  )
);
Title.displayName = 'Title';

const Subtitle = React.forwardRef<HTMLElement, Omit<TypographyProps, 'variant'>>(
  ({ className, as = 'h2', ...props }, ref) => (
    <Typography
      ref={ref}
      variant="subtitle"
      as={as}
      className={className}
      {...props}
    />
  )
);
Subtitle.displayName = 'Subtitle';

const Paragraph = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'variant'>>(
  ({ className, as = 'p', ...props }, ref) => (
    <Typography
      ref={ref as React.Ref<HTMLElement>}
      variant="paragraph"
      as={as}
      className={className}
      {...props}
    />
  )
);
Paragraph.displayName = 'Paragraph';

const Small = React.forwardRef<HTMLElement, Omit<TypographyProps, 'variant'>>(
  ({ className, as = 'span', ...props }, ref) => (
    <Typography
      ref={ref}
      variant="small"
      as={as}
      className={className}
      {...props}
    />
  )
);
Small.displayName = 'Small';

export { Typography, Title, Subtitle, Paragraph, Small, typographyVariants };
