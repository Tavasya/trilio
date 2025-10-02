interface ModeSliderProps {
  mode: 'topic' | 'draft';
  onModeChange: (mode: 'topic' | 'draft') => void;
}

export default function ModeSlider({ mode, onModeChange }: ModeSliderProps) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
      <button
        onClick={() => onModeChange('topic')}
        className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          mode === 'topic'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Topic
      </button>
      <button
        onClick={() => onModeChange('draft')}
        className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          mode === 'draft'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Draft
      </button>
    </div>
  );
}
