import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface WritingStyle {
  id: string;
  name: string;
}

interface WritingStylesSectionProps {
  styles?: WritingStyle[];
}

const defaultStyles: WritingStyle[] = [
  { id: '1', name: 'Professional' },
  { id: '2', name: 'Casual' },
  { id: '3', name: 'Storytelling' },
  { id: '4', name: 'Educational' },
  { id: '5', name: 'Inspirational' },
];

export default function WritingStylesSection({ styles = defaultStyles }: WritingStylesSectionProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Preferred Writing Styles
      </h2>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => toggleStyle(style.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-colors ${
                selectedStyles.includes(style.id)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}