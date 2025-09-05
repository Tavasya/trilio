import { Button } from "@/components/ui/button";
import OnboardingProgress from "./OnboardingProgress";
import { cn } from "@/lib/utils";

type OnboardingNavProps = {
  currentStep: number; // 1-based index
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  backLabel?: string;
  nextLabel?: string;
  showSkip?: boolean;
  onSkip?: () => void;
  className?: string;
};

export default function OnboardingNav({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled,
  isLoading,
  backLabel = "Back",
  nextLabel,
  showSkip,
  onSkip,
  className,
}: OnboardingNavProps) {
  const isFirst = currentStep <= 1;
  const isLast = currentStep >= totalSteps;
  const effectiveNextLabel = nextLabel ?? (isLast ? "Finish" : "Next");

  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "[padding-bottom:env(safe-area-inset-bottom)]",
        className
      )}
    >
      <div className="mx-auto max-w-3xl p-4 flex flex-col gap-3">
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} showNumbers />

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" onClick={onBack} disabled={isFirst || isLoading}>
            {backLabel}
          </Button>
          <div className="flex items-center gap-2">
            {showSkip && onSkip && (
              <Button variant="ghost" onClick={onSkip} disabled={isLoading}>
                Skip
              </Button>
            )}
            <Button onClick={onNext} disabled={isNextDisabled || isLoading}>
              {effectiveNextLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


