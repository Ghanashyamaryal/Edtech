"use client";

import { cn } from "@/lib/utils";

export interface StepperStep {
  label: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          return (
            <div key={step.label} className="flex flex-col items-stretch px-2">
              <div
                className={cn(
                  "h-1 rounded-full transition-colors",
                  isActive ? "bg-primary" : "bg-gray-200"
                )}
              />
              <span
                className={cn(
                  "mt-3 text-sm font-semibold transition-colors",
                  isActive ? "text-primary" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
