'use client';

import * as React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from '../input';
import { Label } from '../label';
import { cn } from '@/lib/utils';

export interface RHFInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<InputProps, 'name'> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  helperText?: string;
  // Adds an eye toggle on password inputs. Defaults to true when type === "password".
  showPasswordToggle?: boolean;
}

function RHFInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  helperText,
  className,
  type,
  showPasswordToggle,
  ...props
}: RHFInputProps<TFieldValues, TName>) {
  const isPassword = type === 'password';
  const enableToggle = showPasswordToggle ?? isPassword;
  const [visible, setVisible] = React.useState(false);
  const effectiveType = enableToggle && visible ? 'text' : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          {label && <Label htmlFor={name}>{label}</Label>}
          <div className="relative">
            <Input
              {...field}
              {...props}
              id={name}
              type={effectiveType}
              className={cn(
                enableToggle && 'pr-10',
                error && 'border-destructive focus-visible:ring-destructive',
                className
              )}
            />
            {enableToggle && (
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                tabIndex={-1}
                aria-label={visible ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-muted-foreground">{helperText}</p>
          )}
        </div>
      )}
    />
  );
}

export { RHFInput };
