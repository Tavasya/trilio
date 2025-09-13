import React, { useState, useMemo } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Button } from '../ui/button';

// Predefined writing styles with descriptions
const predefinedStyles = [
  // Professional Styles
  {
    id: 'professional',
    label: 'Professional',
    category: 'Formal',
    description: 'Polished, authoritative, and business-appropriate',
    example: 'We are pleased to announce our Q3 results, demonstrating substantial growth...'
  },
  {
    id: 'executive',
    label: 'Executive',
    category: 'Formal',
    description: 'C-suite level communication, strategic and high-level',
    example: 'Our strategic initiatives have positioned us for sustainable competitive advantage...'
  },
  {
    id: 'corporate',
    label: 'Corporate',
    category: 'Formal',
    description: 'Traditional business communication style',
    example: 'The company continues to deliver value to stakeholders through innovative solutions...'
  },
  {
    id: 'academic',
    label: 'Academic',
    category: 'Formal',
    description: 'Research-focused, citations, and evidence-based',
    example: 'Recent studies indicate a correlation between employee engagement and productivity...'
  },

  // Casual Styles
  {
    id: 'casual',
    label: 'Casual',
    category: 'Informal',
    description: 'Friendly, approachable, conversational tone',
    example: 'Hey everyone! Just wanted to share some exciting news about our latest project...'
  },
  {
    id: 'conversational',
    label: 'Conversational',
    category: 'Informal',
    description: 'Like talking to a friend or colleague',
    example: 'You know that feeling when everything just clicks? That happened to us yesterday...'
  },
  {
    id: 'friendly',
    label: 'Friendly',
    category: 'Informal',
    description: 'Warm, welcoming, and personable',
    example: 'Hope you\'re having a great week! I wanted to share something that made me smile...'
  },
  {
    id: 'humorous',
    label: 'Humorous',
    category: 'Informal',
    description: 'Light-hearted with appropriate humor',
    example: 'Plot twist: Our coffee machine broke, but productivity somehow went up 200%...'
  },

  // Storytelling Styles
  {
    id: 'storytelling',
    label: 'Storytelling',
    category: 'Narrative',
    description: 'Narrative-driven, engaging stories',
    example: 'It was 3 AM when the idea hit me. I couldn\'t sleep, thinking about the problem...'
  },
  {
    id: 'narrative',
    label: 'Narrative',
    category: 'Narrative',
    description: 'Beginning, middle, and end structure',
    example: 'Last year, we faced a challenge that seemed impossible. Here\'s how we overcame it...'
  },
  {
    id: 'anecdotal',
    label: 'Anecdotal',
    category: 'Narrative',
    description: 'Personal stories and experiences',
    example: 'A client once told me something that changed my entire perspective on leadership...'
  },
  {
    id: 'case-study',
    label: 'Case Study',
    category: 'Narrative',
    description: 'Problem-solution-result format',
    example: 'Challenge: 40% customer churn. Solution: Personalized onboarding. Result: 15% churn...'
  },

  // Educational Styles
  {
    id: 'educational',
    label: 'Educational',
    category: 'Teaching',
    description: 'Informative, clear explanations',
    example: 'Today, let\'s explore three key principles of effective team management...'
  },
  {
    id: 'tutorial',
    label: 'Tutorial',
    category: 'Teaching',
    description: 'Step-by-step instructions',
    example: 'Step 1: Identify your target audience. Step 2: Define clear objectives...'
  },
  {
    id: 'explanatory',
    label: 'Explanatory',
    category: 'Teaching',
    description: 'Breaking down complex topics',
    example: 'AI might seem complex, but at its core, it\'s about pattern recognition...'
  },
  {
    id: 'how-to',
    label: 'How-To',
    category: 'Teaching',
    description: 'Practical guides and instructions',
    example: 'How to increase your LinkedIn engagement in 5 simple steps...'
  },

  // Inspirational Styles
  {
    id: 'inspirational',
    label: 'Inspirational',
    category: 'Motivational',
    description: 'Uplifting and motivating content',
    example: 'Every setback is a setup for a comeback. Your journey is uniquely yours...'
  },
  {
    id: 'motivational',
    label: 'Motivational',
    category: 'Motivational',
    description: 'Encouraging action and change',
    example: 'Don\'t wait for the perfect moment. Start where you are, use what you have...'
  },
  {
    id: 'thought-leadership',
    label: 'Thought Leadership',
    category: 'Motivational',
    description: 'Visionary insights and future-thinking',
    example: 'The future of work isn\'t about where we work, but how we create value...'
  },
  {
    id: 'empowering',
    label: 'Empowering',
    category: 'Motivational',
    description: 'Building confidence and capability',
    example: 'You have everything you need to succeed. Trust your instincts and take the leap...'
  },

  // Analytical Styles
  {
    id: 'analytical',
    label: 'Analytical',
    category: 'Data-Driven',
    description: 'Data-focused, logical reasoning',
    example: 'Analysis of Q3 data reveals three key trends: 1) 45% increase in engagement...'
  },
  {
    id: 'technical',
    label: 'Technical',
    category: 'Data-Driven',
    description: 'Industry-specific jargon and details',
    example: 'Implementing microservices architecture reduced latency by 60ms...'
  },
  {
    id: 'research-based',
    label: 'Research-Based',
    category: 'Data-Driven',
    description: 'Evidence and study-backed content',
    example: 'According to McKinsey\'s latest report, 70% of companies are investing in AI...'
  },
  {
    id: 'statistical',
    label: 'Statistical',
    category: 'Data-Driven',
    description: 'Numbers and metrics focused',
    example: '87% of high-performers share this trait. Here\'s what the data tells us...'
  },

  // Creative Styles
  {
    id: 'creative',
    label: 'Creative',
    category: 'Artistic',
    description: 'Unique, imaginative expression',
    example: 'Innovation isn\'t just thinking outside the box—it\'s realizing there is no box...'
  },
  {
    id: 'poetic',
    label: 'Poetic',
    category: 'Artistic',
    description: 'Metaphorical and lyrical',
    example: 'Success is a symphony, each failure a note that makes the melody complete...'
  },
  {
    id: 'philosophical',
    label: 'Philosophical',
    category: 'Artistic',
    description: 'Deep thinking and questioning',
    example: 'What defines success? Is it the destination, or the wisdom gained along the way?'
  },
];

interface WritingStylesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedStyles: string[]) => void;
  initialSelections?: string[];
}

export default function WritingStylesModal({
  isOpen,
  onClose,
  onSave,
  initialSelections = [],
}: WritingStylesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialSelections);

  // Update selected styles when modal opens with new initial selections
  React.useEffect(() => {
    if (isOpen) {
      setSelectedStyles(initialSelections);
    }
  }, [isOpen, initialSelections]);

  // Filter styles based on search
  const filteredStyles = useMemo(() => {
    if (!searchQuery) return predefinedStyles;

    const query = searchQuery.toLowerCase();
    return predefinedStyles.filter(
      style =>
        style.label.toLowerCase().includes(query) ||
        style.category.toLowerCase().includes(query) ||
        style.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group styles by category
  const groupedStyles = useMemo(() => {
    const groups: Record<string, typeof predefinedStyles> = {};
    filteredStyles.forEach(style => {
      if (!groups[style.category]) {
        groups[style.category] = [];
      }
      groups[style.category].push(style);
    });
    return groups;
  }, [filteredStyles]);

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleSave = () => {
    onSave(selectedStyles);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Select Writing Styles</h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose the tones that match your content strategy
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search writing styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Predefined Styles by Category */}
          {Object.entries(groupedStyles).map(([category, styles]) => (
            <div key={category} className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {styles.map(style => {
                  const isSelected = selectedStyles.includes(style.id);

                  return (
                    <button
                      key={style.id}
                      onClick={() => toggleStyle(style.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`font-semibold ${
                            isSelected ? 'text-primary' : 'text-gray-900'
                          }`}>
                            {style.label}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {style.description}
                          </p>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-primary flex-shrink-0 ml-2" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* No results */}
          {Object.keys(groupedStyles).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No writing styles found matching "{searchQuery}"</p>
              <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedStyles.length > 0 ? (
                <span>
                  {selectedStyles.length} style{selectedStyles.length !== 1 ? 's' : ''} selected
                </span>
              ) : (
                <span>Select at least one writing style</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={selectedStyles.length === 0}
                className={selectedStyles.length === 0 ? 'opacity-50' : ''}
              >
                Save Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}