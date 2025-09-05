import { memo } from 'react';

const descriptions = [
  "Thought Leader",
  "Industry Expert", 
  "Professional",
  "Entrepreneur",
  "Student",
  "Creative Professional",
  "Consultant",
  "Researcher",
  "Manager",
  "Developer",
  "Designer",
  "Analyst"
];

type DescribeYourselfStepProps = {
  onNext: (values: string[]) => void;
  initialValues?: string[];
};

const DescribeYourselfStep = memo(function DescribeYourselfStep({ 
  onNext, 
  initialValues = [] 
}: DescribeYourselfStepProps) {
  const handleSelectionChange = (description: string) => {
    const newSelections = initialValues.includes(description)
      ? initialValues.filter(d => d !== description)
      : [...initialValues, description];
    onNext(newSelections);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">How would you describe yourself?</h2>
        <p className="text-muted-foreground">
          This helps us understand your professional identity and tailor content suggestions.
        </p>
      </div>

      <div 
        className="space-y-4"
        role="group"
        aria-label="Select your professional descriptions"
      >
        <div className="flex flex-wrap gap-3 justify-center">
          {descriptions.map((description) => (
            <button
              key={description}
              type="button"
              role="checkbox"
              aria-checked={initialValues.includes(description)}
              aria-label={`Select ${description}`}
              onClick={() => handleSelectionChange(description)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectionChange(description);
                }
              }}
              className={`px-4 py-2 text-center rounded-lg border transition-colors whitespace-nowrap
                ${initialValues.includes(description)
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {description}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default DescribeYourselfStep;