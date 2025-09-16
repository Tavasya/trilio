import { useState, useRef, useEffect } from 'react';
type PostLength = 'short' | 'medium' | 'long';

interface LengthOption {
  value: PostLength;
  label: string;
  description: string;
  characters: string;
}

const lengthOptions: LengthOption[] = [
  {
    value: 'short',
    label: 'Short',
    description: 'Quick read',
    characters: '200 chars'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Standard post',
    characters: '500 chars'
  },
  {
    value: 'long',
    label: 'Long',
    description: 'Detailed content',
    characters: '1000 chars'
  }
];


interface CharacterCountSectionProps {
  value?: PostLength;
  onChange?: (length: PostLength) => void;
}

export default function CharacterCountSection({ value = 'medium', onChange }: CharacterCountSectionProps) {
  const [selectedLength, setSelectedLength] = useState<PostLength>(value);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Update local state when prop changes
  useEffect(() => {
    setSelectedLength(value);
  }, [value]);

  const getSliderPosition = () => {
    switch (selectedLength) {
      case 'short': return 0;
      case 'medium': return 50;
      case 'long': return 100;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-bold text-gray-900">
          Post Length
        </h2>
      </div>

      {/* Slider Container */}
      <div className="relative px-3 max-w-md">
        {/* Track */}
        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;

            const newLength = percentage <= 33 ? 'short' : percentage >= 67 ? 'long' : 'medium';
            setSelectedLength(newLength);
            onChange?.(newLength);
          }}
        >
          {/* Active Track */}
          <div
            className="absolute h-2 bg-primary rounded-full transition-all duration-300 pointer-events-none"
            style={{
              width: `${getSliderPosition()}%`
            }}
          />

          {/* Slider Thumb */}
          <div
            className="absolute w-4 h-4 bg-primary rounded-full shadow-lg -top-1 transition-all duration-300 cursor-grab active:cursor-grabbing"
            style={{
              left: `calc(${getSliderPosition()}% - 8px)`
            }}
            onMouseDown={(e) => {
              e.stopPropagation();

              const handleMouseMove = (e: MouseEvent) => {
                if (!sliderRef.current) return;
                const rect = sliderRef.current.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                const percentage = (x / rect.width) * 100;

                const newLength = percentage <= 33 ? 'short' : percentage >= 67 ? 'long' : 'medium';
                setSelectedLength(newLength);
                onChange?.(newLength);
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />

          {/* Dots for visual reference */}
          {lengthOptions.map((option, index) => (
            <div
              key={option.value}
              className={`absolute w-2 h-2 rounded-full top-0 pointer-events-none transition-all duration-200 ${
                selectedLength === option.value
                  ? 'bg-white'
                  : 'bg-gray-300'
              }`}
              style={{
                left: index === 0 ? '-4px' : index === 1 ? 'calc(50% - 4px)' : 'calc(100% - 4px)'
              }}
            />
          ))}
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3">
          {lengthOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSelectedLength(option.value);
                onChange?.(option.value);
              }}
              className="text-center transition-all duration-200"
            >
              <div className={`font-medium text-xs ${
                selectedLength === option.value ? 'text-primary' : 'text-gray-700'
              }`}>
                {option.label}
              </div>
              <div className={`text-xs mt-0.5 ${
                selectedLength === option.value ? 'text-primary/80' : 'text-gray-500'
              }`}>
                {option.characters}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}