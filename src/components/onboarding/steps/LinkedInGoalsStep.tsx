import { useState } from "react";
import { Button } from "@/components/ui/button";

const goals = [
  "Build Professional Network",
  "Establish Thought Leadership", 
  "Advance My Career",
  "Grow My Business",
  "Build Personal Brand",
  "Learn and Share Knowledge",
  "Find Talent",
  "Generate Sales"
];

type LinkedInGoalsStepProps = {
  onNext: (values: string[]) => void;
  initialValues?: string[];
};

export default function LinkedInGoalsStep({ onNext, initialValues = [] }: LinkedInGoalsStepProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialValues);

  const toggleGoal = (goal: string) => {
    const newGoals = selectedGoals.includes(goal) 
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
    setSelectedGoals(newGoals);
    onNext(newGoals);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">What do you want to get out of posting on LinkedIn?</h2>
        <p className="text-muted-foreground">
          Select your primary goals. This helps us tailor content strategies to your objectives.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {goals.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`px-4 py-2 text-center rounded-lg border transition-colors whitespace-nowrap ${
                selectedGoals.includes(goal)
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
