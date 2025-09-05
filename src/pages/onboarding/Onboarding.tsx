import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OnboardingBottomNav from "@/components/onboarding/OnboardingBottomNav";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import OnboardingTopNav from "@/components/onboarding/OnboardingTopNav";
import DescribeYourselfStep from "@/components/onboarding/steps/DescribeYourselfStep";
import PostingFrequencyStep from "@/components/onboarding/steps/PostingFrequencyStep";
import ContentFocusStep from "@/components/onboarding/steps/ContentFocusStep";
import LinkedInGoalsStep from "@/components/onboarding/steps/LinkedInGoalsStep";
import TargetAudienceStep from "@/components/onboarding/steps/TargetAudienceStep";

export default function Onboarding() {
  const navigate = useNavigate();
  const { step } = useParams();

  // Form state management
  const [formData, setFormData] = useState({
    description: [] as string[],
    postingFrequency: "",
    contentFocus: [] as string[],
    linkedinGoals: [] as string[],
    targetAudience: [] as string[]
  });

  const steps = useMemo(() => [
    { 
      id: "describe-yourself", 
      title: "Describe Yourself", 
      element: (
        <DescribeYourselfStep 
          onNext={(values) => setFormData(prev => ({ ...prev, description: values }))}
          initialValues={formData.description}
        />
      )
    },
    { 
      id: "posting-frequency", 
      title: "Posting Frequency", 
      element: (
        <PostingFrequencyStep 
          onNext={(value) => setFormData(prev => ({ ...prev, postingFrequency: value }))}
          initialValue={formData.postingFrequency}
        />
      )
    },
    { 
      id: "content-focus", 
      title: "Content Focus", 
      element: (
        <ContentFocusStep 
          onNext={(values) => setFormData(prev => ({ ...prev, contentFocus: values }))}
          initialValues={formData.contentFocus}
        />
      )
    },
    { 
      id: "linkedin-goals", 
      title: "LinkedIn Goals", 
      element: (
        <LinkedInGoalsStep 
          onNext={(values) => setFormData(prev => ({ ...prev, linkedinGoals: values }))}
          initialValues={formData.linkedinGoals}
        />
      )
    },
    { 
      id: "target-audience", 
      title: "Target Audience", 
      element: (
        <TargetAudienceStep 
          onNext={(values) => setFormData(prev => ({ ...prev, targetAudience: values }))}
          initialValues={formData.targetAudience}
        />
      )
    },
  ], [formData]);

  const totalSteps = steps.length;
  const currentStepIndex = Math.max(0, Math.min(totalSteps - 1, (Number(step) || 1) - 1));
  const currentStep = currentStepIndex + 1; // 1-based

  // Validation based on current step
  const isValid = useMemo(() => {
    switch (currentStepIndex) {
      case 0: return formData.description.length > 0;
      case 1: return formData.postingFrequency !== "";
      case 2: return formData.contentFocus.length > 0;
      case 3: return formData.linkedinGoals.length > 0;
      case 4: return formData.targetAudience.length > 0;
      default: return false;
    }
  }, [currentStepIndex, formData]);

  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(totalSteps - 1, index));
    navigate(`/onboarding/${clamped + 1}`);
  };

  const handleBack = () => {
    goToStep(currentStepIndex - 1);
  };

  const handleNext = () => {
    if (!isValid) return;
    if (currentStepIndex >= totalSteps - 1) {
      // Onboarding complete - save data and navigate to dashboard
      console.log("Onboarding completed with data:", formData);
      // Here you would typically save to a backend or local storage
      navigate("/dashboard");
      return;
    }
    goToStep(currentStepIndex + 1);
  };


  return (
    <div className="min-h-screen flex flex-col">
      <OnboardingTopNav />
      
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="mx-auto max-w-3xl p-6 w-full">
          {steps[currentStepIndex].element}
        </div>
      </div>

      <div className="sticky bottom-0 bg-background">
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
        <OnboardingBottomNav
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={handleBack}
          onNext={handleNext}
          isNextDisabled={!isValid}
        />
      </div>
    </div>
  );
}

