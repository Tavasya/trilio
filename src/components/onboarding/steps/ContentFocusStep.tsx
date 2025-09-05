import { useState } from "react";
import { Button } from "@/components/ui/button";

const contentAreas = [
  { id: "content-planning", label: "Content Planning", description: "Help me plan what to post and when" },
  { id: "content-generation", label: "Content Generation", description: "Help me create engaging posts and captions" },
  { id: "posting", label: "Posting & Scheduling", description: "Help me post at optimal times" },
  { id: "follow-up", label: "Follow-up & Engagement", description: "Help me engage with my audience" }
];

type ContentFocusStepProps = {
  onNext: (values: string[]) => void;
  initialValues?: string[];
};

export default function ContentFocusStep({ onNext, initialValues = [] }: ContentFocusStepProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(initialValues);

  const toggleArea = (areaId: string) => {
    const newAreas = selectedAreas.includes(areaId) 
      ? selectedAreas.filter(id => id !== areaId)
      : [...selectedAreas, areaId];
    setSelectedAreas(newAreas);
    onNext(newAreas);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">What do you need help with most?</h2>
        <p className="text-muted-foreground">
          Select all areas where you'd like support. This helps us prioritize features for you.
        </p>
      </div>

      <div className="space-y-3 flex flex-col items-center">
        {contentAreas.map((area) => (
          <button
            key={area.id}
            onClick={() => toggleArea(area.id)}
            className={`w-full max-w-md p-4 text-left rounded-lg border transition-colors ${
              selectedAreas.includes(area.id)
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="font-medium">{area.label}</div>
            <div className="text-sm text-muted-foreground">{area.description}</div>
          </button>
        ))}
      </div>

    </div>
  );
}
