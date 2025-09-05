import { memo } from 'react';

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

const LinkedInGoalsStep = memo(function LinkedInGoalsStep({ 
  onNext, 
  initialValues = [] 
}: LinkedInGoalsStepProps) {
  const toggleGoal = (goal: string) => {
    const newGoals = initialValues.includes(goal) 
      ? initialValues.filter(g => g !== goal)
      : [...initialValues, goal];
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
        <div 
          className="flex flex-wrap gap-3 justify-center"
          role="group"
          aria-label="Select your LinkedIn goals"
        >
          {goals.map((goal) => (
            <button
              key={goal}
              type="button"
              role="checkbox"
              aria-checked={initialValues.includes(goal)}
              aria-label={`Select ${goal}`}
              onClick={() => toggleGoal(goal)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleGoal(goal);
                }
              }}
              className={`px-4 py-2 text-center rounded-lg border transition-colors whitespace-nowrap ${
                initialValues.includes(goal)
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
});

export default LinkedInGoalsStep;