import { cn } from "@/lib/utils";

type OnboardingProgressProps = {
  currentStep: number; // 1-based index
  totalSteps: number;
  className?: string;
};

export default function OnboardingProgress({
  currentStep,
  totalSteps,
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
      aria-label="Onboarding progress"
    >
      <div className="h-1 w-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}


