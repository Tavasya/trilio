import { memo } from 'react';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const frequencies = [
  { value: "rarely", label: "Rarely", description: "I rarely post" },
  { value: "monthly", label: "Monthly", description: "Once a month" },
  { value: "biweekly", label: "Bi-weekly", description: "Every other week" },
  { value: "weekly-single", label: "Weekly", description: "Once per week" },
  { value: "weekly", label: "2-3x/week", description: "Multiple times a week" },
  { value: "daily", label: "Daily", description: "Every day" }
];

type PostingFrequencyStepProps = {
  onNext: (value: string) => void;
  initialValue?: string;
};

const PostingFrequencyStep = memo(function PostingFrequencyStep({ 
  onNext, 
  initialValue = "" 
}: PostingFrequencyStepProps) {
  const selectedFrequency = initialValue || "weekly-single";
  const currentIndex = frequencies.findIndex(f => f.value === selectedFrequency);

  const handleSliderChange = (value: number | number[]) => {
    const val = Array.isArray(value) ? value[0] : value;
    const frequency = frequencies[val];
    onNext(frequency.value);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">How often do you usually post?</h2>
        <p className="text-muted-foreground">
          Understanding your posting habits helps us create a content schedule that works for you.
        </p>
      </div>

      <div className="space-y-6">
        <div 
          className="px-4"
          role="group"
          aria-label="Select your posting frequency"
        >
          <label htmlFor="frequency-slider" className="sr-only">
            Posting frequency slider
          </label>
          <Slider
            id="frequency-slider"
            min={0}
            max={frequencies.length - 1}
            value={currentIndex}
            onChange={handleSliderChange}
            step={1}
            marks={{
              0: "Rarely",
              1: "",
              2: "",
              3: "",
              4: "",
              5: "Daily"
            }}
            dots={true}
            trackStyle={{ backgroundColor: "#8b5cf6", height: 4 }}
            handleStyle={{
              borderColor: "#8b5cf6",
              backgroundColor: "#8b5cf6",
              width: 20,
              height: 20,
              marginTop: -8,
            }}
            railStyle={{ backgroundColor: "#e5e7eb", height: 4 }}
            dotStyle={{ 
              backgroundColor: "#d1d5db", 
              border: "2px solid #e5e7eb",
              width: 8,
              height: 8,
              marginTop: -2,
            }}
            activeDotStyle={{
              backgroundColor: "#8b5cf6",
              border: "2px solid #8b5cf6",
              width: 8,
              height: 8,
              marginTop: -2,
            }}
            ariaLabelForHandle={`Posting frequency: ${frequencies[currentIndex]?.label}`}
            ariaValueTextFormatterForHandle={() => frequencies[currentIndex]?.description || ''}
          />
        </div>

        <div className="text-center space-y-1">
          <div 
            className="text-2xl font-semibold text-primary"
            aria-live="polite"
            aria-atomic="true"
          >
            {frequencies[currentIndex]?.label}
          </div>
          <div className="text-muted-foreground">
            {frequencies[currentIndex]?.description}
          </div>
        </div>
      </div>
    </div>
  );
});

export default PostingFrequencyStep;