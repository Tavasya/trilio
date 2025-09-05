import React from "react";
import { cn } from "@/lib/utils";

type OnboardingProgressProps = {
  currentStep: number; // 1-based index
  totalSteps: number;
  label?: string;
  showNumbers?: boolean;
  className?: string;
};

export default function OnboardingProgress({
  currentStep,
  totalSteps,
  label,
  showNumbers = false,
  className,
}: OnboardingProgressProps) {
  const clampedCurrent = Math.min(Math.max(currentStep, 1), totalSteps);
  const percent = totalSteps > 0 ? Math.round((clampedCurrent / totalSteps) * 100) : 0;

  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={label ?? "Onboarding progress"}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          {label ?? "Progress"}
        </span>
        {showNumbers && (
          <span className="text-sm tabular-nums text-muted-foreground">
            {clampedCurrent}/{totalSteps}
          </span>
        )}
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}


