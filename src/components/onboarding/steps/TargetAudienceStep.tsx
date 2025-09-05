import { useState } from "react";
import { Button } from "@/components/ui/button";

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

export default function TargetAudienceStep({ onNext, initialValues = [] }: TargetAudienceStepProps) {
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>(initialValues);

  const toggleAudience = (audience: string) => {
    const newAudiences = selectedAudiences.includes(audience) 
      ? selectedAudiences.filter(a => a !== audience)
      : [...selectedAudiences, audience];
    setSelectedAudiences(newAudiences);
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
        <div className="flex flex-wrap gap-3 justify-center">
          {audienceTypes.map((audience) => (
            <button
              key={audience}
              onClick={() => toggleAudience(audience)}
              className={`px-4 py-2 text-center rounded-lg border transition-colors whitespace-nowrap ${
                selectedAudiences.includes(audience)
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
}
