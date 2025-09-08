import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store";
import { useUser, useAuth } from "@clerk/react-router";
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
  completeOnboarding,
  selectIsCurrentStepValid,
  selectCurrentStepErrors
} from "../../features/onboarding/onboardingSlice";
import OnboardingBottomNav from "@/components/onboarding/OnboardingBottomNav";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingTopNav from "@/components/onboarding/OnboardingTopNav";
import DescribeYourselfStep from "@/components/onboarding/steps/DescribeYourselfStep";
import PostingFrequencyStep from "@/components/onboarding/steps/PostingFrequencyStep";
import ConnectLinkedInStep from "@/components/onboarding/steps/ConnectLinkedInStep";
import ContentFocusStep from "@/components/onboarding/steps/ContentFocusStep";
import LinkedInGoalsStep from "@/components/onboarding/steps/LinkedInGoalsStep";
import TargetAudienceStep from "@/components/onboarding/steps/TargetAudienceStep";
import FindingCreatorsStep from "@/components/onboarding/steps/FindingCreatorsStep";

const BASE_TOTAL_STEPS = 7;

export default function Onboarding() {
  const navigate = useNavigate();
  const { step } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const { formData, submission, linkedinConnected } = useAppSelector(state => state.onboarding);
  const isValid = useAppSelector(selectIsCurrentStepValid);
  const errors = useAppSelector(selectCurrentStepErrors);

  // Dynamic step calculation based on LinkedIn connection status
  const totalSteps = linkedinConnected ? BASE_TOTAL_STEPS - 1 : BASE_TOTAL_STEPS;
  const urlStep = Number(step) || 1;
  
  const currentStep = urlStep;

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

  const goToStep = useCallback((urlStepNumber: number) => {
    const clamped = Math.max(1, Math.min(totalSteps, urlStepNumber));
    navigate(`/onboarding/${clamped}`);
  }, [navigate, totalSteps]);

  const handleBack = useCallback(() => {
    goToStep(urlStep - 1);
  }, [urlStep, goToStep]);

  const handleNext = useCallback(async () => {
    if (!isValid) {
      // Show toast with validation error
      if (errors.length > 0) {
        toast.error(errors[0]);
      }
      return;
    }
    
    if (urlStep >= totalSteps) {
      // Complete onboarding - mark as done in database
      try {
        // First submit the form data (optional - for storing preferences)
        await dispatch(submitOnboarding(formData)).unwrap();
        
        // Then mark onboarding as complete in database
        const token = await getToken();
        if (token) {
          await dispatch(completeOnboarding(token)).unwrap();
        }
        
        navigate("/dashboard");
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        toast.error('Failed to complete onboarding. Please try again.');
      }
      return;
    }
    
    // Move to next step
    const nextStep = urlStep + 1;
    goToStep(nextStep);
  }, [isValid, urlStep, totalSteps, dispatch, formData, navigate, goToStep, errors, getToken]);

  // Step components configuration - dynamically exclude LinkedIn step if already connected
  const steps = useMemo(() => {
    const allSteps = [
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
        id: "connect-linkedin",
        title: "Connect LinkedIn",
        description: "Connect your LinkedIn account",
        element: <ConnectLinkedInStep />
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

    // Filter out LinkedIn step if already connected
    return linkedinConnected 
      ? allSteps.filter(step => step.id !== "connect-linkedin")
      : allSteps;
  }, [
    linkedinConnected,
    handleDescriptionChange,
    handlePostingFrequencyChange,
    handleContentFocusChange,
    handleLinkedInGoalsChange,
    handleTargetAudienceChange,
    handleSelectedCreatorsChange,
    formData
  ]);

  // Map URL step to step data - accounting for LinkedIn skip
  const getStepDataIndex = useCallback((urlStepNumber: number): number => {
    if (!linkedinConnected) {
      return urlStepNumber - 1; // Normal 0-based indexing
    }
    
    // LinkedIn connected: the steps array has LinkedIn step filtered out
    // URL step maps directly to filtered array index
    return urlStepNumber - 1;
  }, [linkedinConnected]);

  const stepDataIndex = getStepDataIndex(urlStep);
  const currentStepData = steps[stepDataIndex];

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
            aria-label={`Step ${currentStep} of ${totalSteps}: ${currentStepData.title}`}
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
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
        <OnboardingBottomNav
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={handleBack}
          onNext={handleNext}
          isNextDisabled={!isValid}
          isLoading={submission.isLoading}
        />
      </nav>
    </div>
  );
}