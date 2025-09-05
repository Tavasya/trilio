import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OnboardingNav from "@/components/onboarding/OnboardingNav";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";

export default function Onboarding() {
  const navigate = useNavigate();
  const { step } = useParams();

  const steps = useMemo(() => [
    { id: "welcome", title: "Welcome", element: <div>Welcome to Trilio!</div> },
    { id: "profile", title: "Profile", element: <div>Fill out your profile.</div> },
    { id: "preferences", title: "Preferences", element: <div>Set your preferences.</div> },
  ], []);

  const totalSteps = steps.length;
  const currentStepIndex = Math.max(0, Math.min(totalSteps - 1, (Number(step) || 1) - 1));
  const currentStep = currentStepIndex + 1; // 1-based

  const [isValid] = useState(true);

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
      navigate("/dashboard");
      return;
    }
    goToStep(currentStepIndex + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="mx-auto max-w-3xl p-6">
          <h1 className="text-2xl font-semibold">{steps[currentStepIndex].title}</h1>
          <div className="text-muted-foreground mt-2">
            {steps[currentStepIndex].element}
          </div>
        </div>
      </div>

      <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      
      <OnboardingNav
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={!isValid}
      />
    </div>
  );
}

