import { useState } from 'react';
import { ChevronRight, Palette, Zap, BookOpen, Users, Award } from 'lucide-react';

interface WritingStyle {
  id: string;
  name: string;
}

interface WritingStylesSectionProps {
  styles?: WritingStyle[];
}

const defaultStyles = [
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Writing Styles
          </h2>
          <p className="text-sm text-gray-500 mt-1">Select your preferred content tone</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {styles.map((style: any) => {
          const isSelected = selectedStyles.includes(style.id);
          return (
            <button
              key={style.id}
              onClick={() => toggleStyle(style.id)}
              className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {style.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}