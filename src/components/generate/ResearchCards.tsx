import { ExternalLink } from 'lucide-react';

interface ResearchCard {
  author_name: string;
  author_title: string;
  content: string;
  likes: number;
  time_posted: string;
  url: string;
  hook: string;
  engagement_score?: number;
  hook_type?: string;
}

interface ResearchCardsProps {
  cards: ResearchCard[];
  query: string;
  mode: string;
  onCardClick?: (card: ResearchCard) => void;
}

export default function ResearchCards({ cards }: ResearchCardsProps) {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-4">
      {/* Minimalist Header */}
      <div className="mb-2 px-1">
        <p className="text-[11px] text-gray-400 font-medium">SOURCES</p>
      </div>

      {/* Cards Container - Clean horizontal scroll */}
      <div className="relative">
        {/* Scrollable Cards */}
        <div
          id="research-cards-scroll"
          className="flex gap-2 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cards.map((card, index) => (
            <a
              key={index}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[280px] max-w-[280px] p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer block"
            >
              {/* Clean header with author and engagement */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900 truncate">
                    {card.author_name}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {card.author_title}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <span>{card.likes}</span>
                  <span>•</span>
                  <span>{card.time_posted}</span>
                </div>
              </div>

              {/* Hook or first line - main focus */}
              <div className="text-xs text-gray-700 line-clamp-2 mb-2 leading-relaxed">
                {card.hook || card.content}
              </div>

              {/* Subtle content preview */}
              {card.hook && card.content && (
                <div className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                  {card.content}
                </div>
              )}

              {/* Minimal link indicator */}
              <div className="mt-2 flex items-center gap-1">
                <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                <span className="text-[10px] text-gray-400">LinkedIn</span>
              </div>
            </a>
          ))}
        </div>

        {/* Subtle scroll indicators */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}