import { useState } from 'react';

// const ONBOARDING_KEY = 'trilio_onboarding_completed';

interface OnboardingState {
  currentStep: number;
  isOpen: boolean;
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    isOpen: true,
  });

  // useEffect(() => {
  //   const completed = localStorage.getItem(ONBOARDING_KEY);
  //   if (completed === 'true') {
  //     setState({ currentStep: 1, isOpen: false });
  //   }
  // }, []);

  const nextStep = () => {
    setState(prev => {
      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        // Desktop only has 1 step (edit button), so close after it
        closeOnboarding();
        return prev;
      } else {
        // Mobile has 2 steps
        if (prev.currentStep === 1) {
          return { ...prev, currentStep: 2 };
        } else {
          closeOnboarding();
          return prev;
        }
      }
    });
  };

  const prevStep = () => {
    setState(prev => {
      if (prev.currentStep > 1) {
        return { ...prev, currentStep: prev.currentStep - 1 };
      }
      return prev;
    });
  };

  const closeOnboarding = () => {
    // localStorage.setItem(ONBOARDING_KEY, 'true');
    setState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    currentStep: state.currentStep,
    isOpen: state.isOpen,
    nextStep,
    prevStep,
    closeOnboarding,
  };
}
