import { memo } from 'react';

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

const ContentFocusStep = memo(function ContentFocusStep({ 
  onNext, 
  initialValues = [] 
}: ContentFocusStepProps) {
  const toggleArea = (areaId: string) => {
    const newAreas = initialValues.includes(areaId) 
      ? initialValues.filter(id => id !== areaId)
      : [...initialValues, areaId];
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

      <div 
        className="space-y-3 flex flex-col items-center"
        role="group"
        aria-label="Select areas where you need help"
      >
        {contentAreas.map((area) => (
          <button
            key={area.id}
            type="button"
            role="checkbox"
            aria-checked={initialValues.includes(area.id)}
            aria-label={`${area.label}: ${area.description}`}
            onClick={() => toggleArea(area.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleArea(area.id);
              }
            }}
            className={`w-full max-w-md p-4 text-left rounded-lg border transition-colors ${
              initialValues.includes(area.id)
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
});

export default ContentFocusStep;