import { Button } from "@/components/ui/button";
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
      <div className="px-6 py-6 flex items-center justify-between">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onBack} 
          disabled={isFirst || isLoading}
          className="px-8 py-3 min-w-24"
        >
          {backLabel}
        </Button>
        <div className="flex items-center gap-4">
          {showSkip && onSkip && (
            <Button variant="ghost" size="lg" onClick={onSkip} disabled={isLoading}>
              Skip
            </Button>
          )}
          <Button 
            size="lg" 
            onClick={onNext} 
            disabled={isNextDisabled || isLoading}
            className="px-8 py-3 min-w-24"
          >
            {effectiveNextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}


