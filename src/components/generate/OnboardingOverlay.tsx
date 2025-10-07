import { useEffect, useState, useRef } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface OnboardingOverlayProps {
  currentStep: number;
  isOpen: boolean;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

interface StepConfig {
  target: string;
  title: string;
  description: string;
  color: string;
  tooltipPosition: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: Record<number, StepConfig> = {
  1: {
    target: '[data-onboarding="edit-button"]',
    title: 'Toggle Edit Mode',
    description: 'Click this pen icon to enable edit mode. When active, AI will directly modify your post content based on your instructions.',
    color: 'green',
    tooltipPosition: 'right',
  },
  2: {
    target: '[data-onboarding="preview-button"]',
    title: 'Preview Your Post',
    description: 'Click this button to see how your LinkedIn post will look before publishing.',
    color: 'blue',
    tooltipPosition: 'bottom',
  },
};

export default function OnboardingOverlay({
  currentStep,
  isOpen,
  onNext,
  onPrev,
  onClose,
}: OnboardingOverlayProps) {
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const stepConfig = STEPS[currentStep];
  const isDesktop = window.innerWidth >= 1024;
  const totalSteps = isDesktop ? 1 : 2;

  useEffect(() => {
    if (!isOpen || !stepConfig) return;

    const findVisibleElement = (): { element: Element; rect: DOMRect } | null => {
      const elements = document.querySelectorAll(stepConfig.target);
      for (const el of Array.from(elements)) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return { element: el, rect };
        }
      }
      return null;
    };

    const updatePosition = () => {
      const result = findVisibleElement();
      if (!result) return;

      const { rect } = result;
      setElementRect(rect);

      // Calculate tooltip position
      const tooltipWidth = 320;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 280;
      const isMobile = window.innerWidth < 1024;

      let top = 0;
      let left = 0;

      if (isMobile) {
        // Center on mobile
        top = (window.innerHeight - tooltipHeight) / 2;
        left = (window.innerWidth - tooltipWidth) / 2;
      } else {
        // Desktop: Use calculated positioning based on element
        const padding = 20;

        switch (stepConfig.tooltipPosition) {
          case 'top':
            top = rect.top - tooltipHeight - padding;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case 'bottom':
            top = rect.bottom + padding;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.left - tooltipWidth - padding;
            break;
          case 'right':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.right + padding;
            break;
        }

        // Clamp to viewport (desktop only)
        const viewportPadding = 16;

        if (top + tooltipHeight > window.innerHeight - viewportPadding) {
          top = window.innerHeight - tooltipHeight - viewportPadding;
        }
        if (top < viewportPadding) {
          top = viewportPadding;
        }

        if (left + tooltipWidth > window.innerWidth - viewportPadding) {
          left = window.innerWidth - tooltipWidth - viewportPadding;
        }
        if (left < viewportPadding) {
          left = viewportPadding;
        }
      }

      setTooltipPosition({ top, left });
    };

    // COMMENTED OUT: Original auto-positioning logic (kept for future reference)
    // const updatePosition = () => {
    //   const result = findVisibleElement();
    //   if (!result) return;
    //
    //   const { rect } = result;
    //   setElementRect(rect);
    //
    //   // Calculate tooltip position
    //   const padding = 20;
    //   const tooltipWidth = 320;
    //   const tooltipHeight = tooltipRef.current?.offsetHeight || 280;
    //
    //   let top = 0;
    //   let left = 0;
    //
    //   switch (stepConfig.tooltipPosition) {
    //     case 'top':
    //       top = rect.top - tooltipHeight - padding;
    //       left = rect.left + rect.width / 2 - tooltipWidth / 2;
    //       break;
    //     case 'bottom':
    //       top = rect.bottom + padding;
    //       left = rect.left + rect.width / 2 - tooltipWidth / 2;
    //       break;
    //     case 'left':
    //       top = rect.top + rect.height / 2 - tooltipHeight / 2;
    //       left = rect.left - tooltipWidth - padding;
    //       break;
    //     case 'right':
    //       top = rect.top + rect.height / 2 - tooltipHeight / 2;
    //       left = rect.right + padding;
    //       break;
    //   }
    //
    //   // Clamp to viewport
    //   const viewportPadding = 16;
    //
    //   if (top + tooltipHeight > window.innerHeight - viewportPadding) {
    //     top = window.innerHeight - tooltipHeight - viewportPadding;
    //   }
    //   if (top < viewportPadding) {
    //     top = viewportPadding;
    //   }
    //
    //   if (left + tooltipWidth > window.innerWidth - viewportPadding) {
    //     left = window.innerWidth - tooltipWidth - viewportPadding;
    //   }
    //   if (left < viewportPadding) {
    //     left = viewportPadding;
    //   }
    //
    //   setTooltipPosition({ top, left });
    // };

    // Poll for element with retries
    let retries = 0;
    const maxRetries = 50;
    const intervalId = setInterval(() => {
      const result = findVisibleElement();
      if (result) {
        updatePosition();
        clearInterval(intervalId);
      } else {
        retries++;
        if (retries >= maxRetries) {
          clearInterval(intervalId);
        }
      }
    }, 100);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, currentStep, stepConfig]);

  if (!isOpen || !stepConfig || !elementRect || !tooltipPosition) {
    return null;
  }

  // Calculate clip path for cutout around the element
  const padding = 8;

  const clipPath = `polygon(
    evenodd,
    0% 0%,
    0% 100%,
    100% 100%,
    100% 0%,
    0% 0%,
    0% ${elementRect.top - padding}px,
    ${elementRect.left - padding}px ${elementRect.top - padding}px,
    ${elementRect.left - padding}px ${elementRect.bottom + padding}px,
    ${elementRect.right + padding}px ${elementRect.bottom + padding}px,
    ${elementRect.right + padding}px ${elementRect.top - padding}px,
    ${elementRect.left - padding}px ${elementRect.top - padding}px,
    0% ${elementRect.top - padding}px,
    0% 0%
  )`;

  const colorClasses = {
    green: {
      border: 'border-green-500',
      bg: 'bg-green-500',
      shadow: 'shadow-green-500/50',
    },
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-500',
      shadow: 'shadow-blue-500/50',
    },
  };

  const colors = colorClasses[stepConfig.color as keyof typeof colorClasses];

  return (
    <>
      {/* Backdrop with clip-path cutout */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] transition-opacity duration-300 pointer-events-none"
        style={{ clipPath }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] bg-white rounded-xl shadow-2xl p-6 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: '320px',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center text-white font-semibold text-sm`}>
            {currentStep}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {stepConfig.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          {stepConfig.description}
        </p>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onPrev}
            variant="outline"
            size="sm"
            className={`${currentStep === 1 ? 'invisible' : ''}`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx + 1 === currentStep ? colors.bg : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={onNext}
            size="sm"
            className={colors.bg}
          >
            {currentStep === totalSteps ? 'Got it!' : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
