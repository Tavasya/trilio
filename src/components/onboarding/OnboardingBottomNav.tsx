import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type OnboardingBottomNavProps = {
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
  tooltipText?: string;
};

export default function OnboardingBottomNav({
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
  tooltipText,
}: OnboardingBottomNavProps) {
  const isFirst = currentStep <= 1;
  const isLast = currentStep >= totalSteps;
  const effectiveNextLabel = nextLabel ?? (isLast ? "Finish" : "Next");

  const nextButton = (
    <Button 
      size="lg" 
      onClick={onNext} 
      disabled={isNextDisabled || isLoading}
      className="px-8 py-3 min-w-24 text-base font-medium"
    >
      {effectiveNextLabel}
    </Button>
  );

  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "[padding-bottom:env(safe-area-inset-bottom)]",
        className
      )}
    >
      <div className="px-20 py-6 flex items-center justify-between">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onBack} 
          disabled={isFirst || isLoading}
          className="px-8 py-3 min-w-24 text-base font-medium"
        >
          {backLabel}
        </Button>
        <div className="flex items-center gap-4">
          {showSkip && onSkip && (
            <Button variant="ghost" size="lg" onClick={onSkip} disabled={isLoading} className="text-base font-medium">
              Skip
            </Button>
          )}
          {tooltipText && isNextDisabled ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {nextButton}
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-popover text-popover-foreground border">
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            nextButton
          )}
        </div>
      </div>
    </div>
  );
}


