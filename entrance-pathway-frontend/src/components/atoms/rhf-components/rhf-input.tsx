'use client';

import * as React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
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
  ...props
}: RHFInputProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          {label && <Label htmlFor={name}>{label}</Label>}
          <Input
            {...field}
            {...props}
            id={name}
            className={cn(
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
          />
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
