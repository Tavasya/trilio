import { useState } from 'react';
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

export default function WritingStylesSection() {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreviewStyleClick = (styleId: string) => {
    // Toggle selection directly from preview
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleSaveStyles = (styles: string[]) => {
    setSelectedStyles(styles);
    // TODO: Save to backend/localStorage
    console.log('Selected styles:', styles);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Writing Styles
            </h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Clickable Style Preview Badges - Direct Selection */}
        <div className="flex flex-wrap gap-2">
          {previewStyles.map((style) => {
            const isSelected = selectedStyles.includes(style.id);
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

        {/* Show selected count if any */}
        {selectedStyles.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-600">
              {selectedStyles.length} style{selectedStyles.length !== 1 ? 's' : ''} selected
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
        initialSelections={selectedStyles}
      />
    </>
  );
}