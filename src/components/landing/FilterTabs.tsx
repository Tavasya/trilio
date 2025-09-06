import { ChevronRight } from "lucide-react";

const filters = [
  "Sales",
  "Meetings", 
  "Most popular",
  "Productivity",
  "Support"
];

export default function FilterTabs() {
  return (
    <div className="flex items-center justify-center gap-2 px-6 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {filter}
        </button>
      ))}
      <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
        See all
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}