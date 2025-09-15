import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import WritingStylesModal from '../writing-styles/WritingStylesModal';

// Main preview styles to show (5 main categories)
const previewStyles = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'storytelling', label: 'Storytelling' },
  { id: 'educational', label: 'Educational' },
  { id: 'inspirational', label: 'Inspirational' },
];

interface WritingStylesSectionProps {
  value?: string;
  onChange?: (selected: string) => void;
}

export default function WritingStylesSection({ value = '', onChange }: WritingStylesSectionProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>(value);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setSelectedStyle(value);
  }, [value]);

  const handlePreviewStyleClick = (styleId: string) => {
    // Single selection - deselect if clicking the same style, otherwise select new style
    const newSelection = selectedStyle === styleId ? '' : styleId;
    setSelectedStyle(newSelection);
    onChange?.(newSelection);
  };

  const handleSaveStyles = (styles: string[]) => {
    // For modal, we still receive array but only use first selection
    const firstStyle = styles[0] || '';
    setSelectedStyle(firstStyle);
    onChange?.(firstStyle);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Writing Styles <span className="text-red-500">*</span>
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Clickable Style Preview Badges - Single Selection */}
        <div className="flex flex-wrap gap-2">
          {previewStyles.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => handlePreviewStyleClick(style.id)}
                className={`px-3 py-1.5 rounded-lg border-2 font-medium text-sm transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {style.label}
              </button>
            );
          })}
        </div>

        {/* Show selected style if any */}
        {selectedStyle && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-600">
              Selected: {previewStyles.find(s => s.id === selectedStyle)?.label}
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-2 text-primary hover:text-primary/80 font-medium"
              >
                View all →
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Writing Styles Modal */}
      <WritingStylesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStyles}
        initialSelections={selectedStyle ? [selectedStyle] : []}
      />
    </>
  );
}