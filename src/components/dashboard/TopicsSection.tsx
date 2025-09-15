interface TopicsSectionProps {
  topics: string;
  setTopics: (topics: string) => void;
}

export default function TopicsSection({ topics, setTopics }: TopicsSectionProps) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Content Topics <span className="text-red-500">*</span>
          </h2>
        </div>
      </div>
      
      <textarea
        value={topics}
        onChange={(e) => setTopics(e.target.value)}
        placeholder="E.g., AI in healthcare, sustainable business practices, remote team management..."
        className="w-full min-h-[100px] p-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 text-sm"
      />
    </div>
  );
}