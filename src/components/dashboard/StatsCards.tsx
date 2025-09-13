
interface StatsCardsProps {
  totalPosts: number;
  researchItems: number;
}

export default function StatsCards({ totalPosts, researchItems }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-sm text-gray-600 mb-1">Total Posts</div>
        <div className="text-3xl font-bold text-gray-900">{totalPosts}</div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-sm text-gray-600 mb-1">Research Items</div>
        <div className="text-3xl font-bold text-gray-900">{researchItems}</div>
      </div>
    </div>
  );
}