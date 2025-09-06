import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useUser } from "@clerk/react-router";
import { toast } from "sonner";
import {
  setCurrentStep,
  setDescription,
  setPostingFrequency,
  setContentFocus,
  setLinkedInGoals,
  setTargetAudience,
  setSelectedCreators,
  submitOnboarding,
  selectIsCurrentStepValid,
  selectCurrentStepErrors
} from "@/store/slices/onboardingSlice";
import OnboardingBottomNav from "@/components/onboarding/OnboardingBottomNav";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingTopNav from "@/components/onboarding/OnboardingTopNav";
import DescribeYourselfStep from "@/components/onboarding/steps/DescribeYourselfStep";
import PostingFrequencyStep from "@/components/onboarding/steps/PostingFrequencyStep";
import ContentFocusStep from "@/components/onboarding/steps/ContentFocusStep";
import LinkedInGoalsStep from "@/components/onboarding/steps/LinkedInGoalsStep";
import TargetAudienceStep from "@/components/onboarding/steps/TargetAudienceStep";
import FindingCreatorsStep from "@/components/onboarding/steps/FindingCreatorsStep";

const TOTAL_STEPS = 6;

export default function Onboarding() {
  const navigate = useNavigate();
  const { step } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  
  const { formData, submission } = useAppSelector(state => state.onboarding);
  const isValid = useAppSelector(selectIsCurrentStepValid);
  const errors = useAppSelector(selectCurrentStepErrors);

  const currentStepIndex = Math.max(0, Math.min(TOTAL_STEPS - 1, (Number(step) || 1) - 1));
  const currentStep = currentStepIndex + 1;

  // Update Redux when step changes
  useEffect(() => {
    dispatch(setCurrentStep(currentStep));
  }, [currentStep, dispatch]);

  // Memoized callbacks to prevent re-renders
  const handleDescriptionChange = useCallback((values: string[]) => {
    dispatch(setDescription(values));
  }, [dispatch]);

  const handlePostingFrequencyChange = useCallback((value: string) => {
    dispatch(setPostingFrequency(value));
  }, [dispatch]);

  const handleContentFocusChange = useCallback((values: string[]) => {
    dispatch(setContentFocus(values));
  }, [dispatch]);

  const handleLinkedInGoalsChange = useCallback((values: string[]) => {
    dispatch(setLinkedInGoals(values));
  }, [dispatch]);

  const handleTargetAudienceChange = useCallback((values: string[]) => {
    dispatch(setTargetAudience(values));
  }, [dispatch]);

  const handleSelectedCreatorsChange = useCallback((values: string[]) => {
    dispatch(setSelectedCreators(values));
  }, [dispatch]);

  const goToStep = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_STEPS - 1, index));
    navigate(`/onboarding/${clamped + 1}`);
  }, [navigate]);

  const handleBack = useCallback(() => {
    goToStep(currentStepIndex - 1);
  }, [currentStepIndex, goToStep]);

  const handleNext = useCallback(async () => {
    if (!isValid) {
      // Show toast with validation error
      if (errors.length > 0) {
        toast.error(errors[0]);
      }
      return;
    }
    
    if (currentStepIndex >= TOTAL_STEPS - 1) {
      // Submit onboarding data
      try {
        await dispatch(submitOnboarding(formData)).unwrap();
        
        // Mark onboarding as completed for this user
        if (user?.id) {
          localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
        }
        
        navigate("/dashboard");
      } catch (error) {
        // Error is handled in Redux state
        console.error('Failed to submit onboarding:', error);
        toast.error('Failed to submit onboarding. Please try again.');
      }
      return;
    }
    
    goToStep(currentStepIndex + 1);
  }, [isValid, currentStepIndex, dispatch, formData, navigate, goToStep, errors, user?.id]);

  // Step components configuration
  const steps = [
    {
      id: "describe-yourself",
      title: "Describe Yourself",
      description: "This helps us understand your professional identity",
      element: (
        <DescribeYourselfStep 
          onNext={handleDescriptionChange}
          initialValues={formData.description}
        />
      )
    },
    {
      id: "posting-frequency",
      title: "Posting Frequency",
      description: "How often do you usually post?",
      element: (
        <PostingFrequencyStep 
          onNext={handlePostingFrequencyChange}
          initialValue={formData.postingFrequency}
        />
      )
    },
    {
      id: "content-focus",
      title: "Content Focus",
      description: "What do you need help with most?",
      element: (
        <ContentFocusStep 
          onNext={handleContentFocusChange}
          initialValues={formData.contentFocus}
        />
      )
    },
    {
      id: "linkedin-goals",
      title: "LinkedIn Goals",
      description: "What do you want to achieve?",
      element: (
        <LinkedInGoalsStep 
          onNext={handleLinkedInGoalsChange}
          initialValues={formData.linkedinGoals}
        />
      )
    },
    {
      id: "target-audience",
      title: "Target Audience",
      description: "Who are you targeting?",
      element: (
        <TargetAudienceStep 
          onNext={handleTargetAudienceChange}
          initialValues={formData.targetAudience}
        />
      )
    },
    {
      id: "finding-creators",
      title: "Finding Your Path",
      description: "Analyzing successful creators",
      element: (
        <FindingCreatorsStep 
          onNext={handleSelectedCreatorsChange}
          initialValues={formData.selectedCreators}
        />
      )
    }
  ];

  const currentStepData = steps[currentStepIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingTopNav />
      
      <main 
        className="flex-1 overflow-y-auto flex items-center justify-center"
        role="main"
        aria-labelledby="step-heading"
      >
        <div className="mx-auto max-w-3xl p-6 w-full">
          {/* Step content */}
          <div
            id="step-heading"
            aria-label={`Step ${currentStep} of ${TOTAL_STEPS}: ${currentStepData.title}`}
          >
            {currentStepData.element}
          </div>
        </div>
      </main>

      <nav 
        className="sticky bottom-0 bg-background"
        role="navigation"
        aria-label="Onboarding navigation"
      >
        <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        <OnboardingBottomNav
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onBack={handleBack}
          onNext={handleNext}
          isNextDisabled={!isValid}
          isLoading={submission.isLoading}
        />
      </nav>
    </div>
  );
}