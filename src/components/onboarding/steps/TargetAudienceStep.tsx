import { memo } from 'react';

const audienceTypes = [
  "Industry Peers",
  "Potential Clients", 
  "Potential Employers",
  "Mentors & Advisors",
  "Mentees & Students",
  "Investors & Partners",
  "Customers & Users",
  "Thought Leaders"
];

type TargetAudienceStepProps = {
  onNext: (values: string[]) => void;
  initialValues?: string[];
};

const TargetAudienceStep = memo(function TargetAudienceStep({ 
  onNext, 
  initialValues = [] 
}: TargetAudienceStepProps) {
  const toggleAudience = (audience: string) => {
    const newAudiences = initialValues.includes(audience) 
      ? initialValues.filter(a => a !== audience)
      : [...initialValues, audience];
    onNext(newAudiences);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Who are you targeting?</h2>
        <p className="text-muted-foreground">
          Select your target audiences. This helps us create content that resonates with the right people.
        </p>
      </div>

      <div className="space-y-4">
        <div 
          className="flex flex-wrap gap-3 justify-center"
          role="group"
          aria-label="Select your target audiences"
        >
          {audienceTypes.map((audience) => (
            <button
              key={audience}
              type="button"
              role="checkbox"
              aria-checked={initialValues.includes(audience)}
              aria-label={`Select ${audience}`}
              onClick={() => toggleAudience(audience)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleAudience(audience);
                }
              }}
              className={`px-4 py-2 text-center rounded-lg border transition-colors whitespace-nowrap ${
                initialValues.includes(audience)
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {audience}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
});

export default TargetAudienceStep;