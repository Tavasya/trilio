import { PenTool, Hash, TrendingUp, Lightbulb } from 'lucide-react';

interface TopicsSectionProps {
  topics: string;
  setTopics: (topics: string) => void;
}

const topicSuggestions = [
  { icon: TrendingUp, label: 'Industry Trends', color: 'text-blue-500' },
  { icon: Lightbulb, label: 'Innovation', color: 'text-yellow-500' },
  { icon: Hash, label: 'Tech', color: 'text-purple-500' },
];

export default function TopicsSection({ topics, setTopics }: TopicsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Content Topics
          </h2>
          <p className="text-sm text-gray-500 mt-1">What subjects would you like to explore?</p>
        </div>
      </div>
      
      <textarea
        value={topics}
        onChange={(e) => setTopics(e.target.value)}
        placeholder="E.g., AI in healthcare, sustainable business practices, remote team management..."
        className="w-full min-h-[140px] p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400"
      />
    </div>
  );
}