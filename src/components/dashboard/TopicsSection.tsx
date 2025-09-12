interface TopicsSectionProps {
  topics: string;
  setTopics: (topics: string) => void;
}

export default function TopicsSection({ topics, setTopics }: TopicsSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        What topics do you want to write about
      </h2>
      <textarea
        value={topics}
        onChange={(e) => setTopics(e.target.value)}
        placeholder="Enter your topics here..."
        className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}