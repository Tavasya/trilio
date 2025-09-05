import { useState } from "react";
import { Button } from "@/components/ui/button";

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

export default function DescribeYourselfStep({ onNext, initialValues = [] }: DescribeYourselfStepProps) {
  const [selectedDescriptions, setSelectedDescriptions] = useState<string[]>(initialValues);

  // Update parent when selection changes
  const handleSelectionChange = (values: string[]) => {
    onNext(values);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">How would you describe yourself?</h2>
        <p className="text-muted-foreground">
          This helps us understand your professional identity and tailor content suggestions.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {descriptions.map((description) => (
            <button
              key={description}
              onClick={() => {
                const newSelections = selectedDescriptions.includes(description)
                  ? selectedDescriptions.filter(d => d !== description)
                  : [...selectedDescriptions, description];
                setSelectedDescriptions(newSelections);
                handleSelectionChange(newSelections);
              }}
              className={`px-4 py-2 text-center rounded-lg border transition-colors whitespace-nowrap ${
                selectedDescriptions.includes(description)
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
}
