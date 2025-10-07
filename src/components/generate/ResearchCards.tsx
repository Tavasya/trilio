import { ThumbsUp, MessageCircle, Repeat2, MoreHorizontal } from 'lucide-react';
import ThumbIcon from '@/lib/icons/thumb.svg?react';
import HeartIcon from '@/lib/icons/heart.svg?react';
import ClapIcon from '@/lib/icons/clap.svg?react';

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
            <div
              key={index}
              className="min-w-[320px] max-w-[320px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
              {/* Post Header */}
              <div className="p-3 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold flex-shrink-0">
                      {card.author_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {card.author_name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {card.time_posted} • 🌐
                      </p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-3 pb-2">
                <p className="text-xs text-gray-900 line-clamp-3 whitespace-pre-wrap">
                  {card.hook || card.content}
                </p>
              </div>

              {/* Engagement Stats */}
              <div className="px-3 py-1.5 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    <ThumbIcon className="w-3.5 h-3.5" />
                    <HeartIcon className="w-3.5 h-3.5" />
                    <ClapIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="ml-1 text-xs">{card.likes}</span>
                </div>
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >
                  View on LinkedIn
                </a>
              </div>

              {/* Action Buttons */}
              <div className="px-2 py-1 flex items-center justify-between border-t border-gray-200">
                <button className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs font-medium">Like</span>
                </button>
                <button className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Comment</span>
                </button>
                <button className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                  <Repeat2 className="w-4 h-4" />
                  <span className="text-xs font-medium">Repost</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle scroll indicators */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}