import { useState, useEffect, useRef } from 'react';
import { RefreshCw, MoreHorizontal, ThumbsUp, MessageCircle, Share2, Send, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ThumbIcon from '@/lib/icons/thumb.svg?react';
import HeartIcon from '@/lib/icons/heart.svg?react';
import ClapIcon from '@/lib/icons/clap.svg?react';

import type { IdeaVariation } from '@/features/post/postTypes';

interface CarouselSectionProps {
  cards: IdeaVariation[];
  userName: string;
  userAvatar: string;
  isGenerating?: boolean;
  streamingContents?: Record<number, string>;
  regeneratingIndex?: number | null;
  onEdit?: (variation: IdeaVariation) => void;
  onRegenerate?: (index: number, previousContent: string) => void;
}

export default function CarouselSection({
  cards,
  userName,
  userAvatar,
  isGenerating = false,
  streamingContents = {},
  regeneratingIndex = null,
  onEdit,
  onRegenerate
}: CarouselSectionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const handlePrevious = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  useEffect(() => {
    // Only recalculate when generation completes, not during streaming
    if (isGenerating || regeneratingIndex !== null) return;

    setMaxHeight(0);

    const timer = setTimeout(() => {
      const heights = measureRefs.current
        .filter(ref => ref !== null)
        .map(ref => ref.offsetHeight);

      if (heights.length > 0) {
        setMaxHeight(Math.max(...heights));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [cards, isGenerating, regeneratingIndex]);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8 relative">
        <div className="w-20"></div>
        <h2 className="text-xl font-semibold text-gray-900 flex-1 text-center">
          Choose a variation to continue
        </h2>
        <button
          onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline"
        >
          {viewMode === 'carousel' ? 'Show All' : 'Show Carousel'}
        </button>
      </div>

      {viewMode === 'carousel' ? (
        <>
      {/* Desktop Carousel - 3D overlap effect */}
      <div className="hidden lg:block relative w-full max-w-4xl mx-auto" style={{ minHeight: maxHeight > 0 ? maxHeight : 600 }}>
        {/* Navigation Arrows - Only show after generation */}
        {!isGenerating && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        <div className="flex items-start justify-center h-full">
          {cards.map((card, index) => {
            const position = (index - currentCardIndex + cards.length) % cards.length;

            // Only show 3 cards: left (2), center (0), right (1)
            if (position > 2) return null;

            const isActive = position === 0;
            const isStreaming = streamingContents[index] !== undefined;
            const displayContent = isStreaming ? streamingContents[index] : card.content;
            const isRegenerating = regeneratingIndex === index;

            let translateX = 0;
            let scale = 0.85;
            let opacity = 0.5;
            let filter = 'grayscale(50%)';
            let zIndex = 10;

            if (position === 0) {
              // Center card
              translateX = 0;
              scale = 1;
              opacity = 1;
              filter = 'none';
              zIndex = 30;
            } else if (position === 1) {
              // Right card
              translateX = 100;
              zIndex = 20;
            } else if (position === 2) {
              // Left card
              translateX = -100;
              zIndex = 20;
            }

            return (
              <div
                key={index}
                onClick={() => !isActive && setCurrentCardIndex(index)}
                className={`absolute top-0 left-1/2 w-[550px] h-full transition-all duration-500 ease-out ${!isActive ? 'cursor-pointer' : ''}`}
                style={{
                  zIndex,
                  transform: `translate(calc(-50% + ${translateX}px), 0) scale(${scale})`,
                  opacity,
                  filter
                }}
              >
              <div
                ref={(el) => (measureRefs.current[index] = el)}
                className="bg-white rounded-lg border border-gray-200 relative flex flex-col"
                style={{ height: maxHeight > 0 ? maxHeight : 'auto' }}
              >
                {/* Top Right Buttons - Only show on active card */}
                {isActive && !isGenerating && card.content && (
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    {isRegenerating ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                        <span className="text-sm text-gray-600">Regenerating...</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onRegenerate?.(index, card.content)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => onEdit?.(card)}
                          className="px-3 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Post Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 items-center">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        {userAvatar ? (
                          <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-gray-600 font-semibold text-lg">
                            {userName.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      {/* User Info */}
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900">{userName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Just now • 🌐</p>
                      </div>
                    </div>
                    {/* More Options */}
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3 flex-grow">
                  <div className="text-gray-900 whitespace-pre-wrap text-sm">
                    {displayContent}
                    {(isStreaming || !displayContent) && <span className="animate-pulse ml-0.5">▊</span>}
                  </div>
                </div>

                {/* Bottom Section - Engagement + Actions */}
                <div className="mt-auto">
                  {/* Engagement Stats */}
                  <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <ThumbIcon className="w-4 h-4" />
                        <HeartIcon className="w-4 h-4" />
                        <ClapIcon className="w-4 h-4" />
                      </div>
                      <span className="ml-1">127</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>23 comments</span>
                      <span>•</span>
                      <span>8 reposts</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-2 py-1 flex items-center justify-around border-t border-gray-200">
                    <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-sm font-medium">Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Repost</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                      <Send className="w-5 h-5" />
                      <span className="text-sm font-medium">Send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Mobile Carousel - Simple left/right navigation */}
      <div className="lg:hidden relative w-full" style={{ minHeight: maxHeight > 0 ? maxHeight : 600 }}>
        {/* Navigation Arrows - Only show after generation */}
        {!isGenerating && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        <div className="px-12 flex items-start h-full">
          <div className="bg-white rounded-lg border border-gray-200 relative h-full w-full flex flex-col">
            {/* Top Right Buttons */}
            {!isGenerating && cards[currentCardIndex]?.content && (
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                {regeneratingIndex === currentCardIndex ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                    <span className="text-sm text-gray-600">Regenerating...</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onRegenerate?.(currentCardIndex, cards[currentCardIndex].content)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onEdit?.(cards[currentCardIndex])}
                      className="px-3 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Post Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-gray-600 font-semibold text-lg">
                        {userName.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  {/* User Info */}
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900">{userName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Just now • 🌐</p>
                  </div>
                </div>
                {/* More Options */}
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3 flex-grow">
              <div className="text-gray-900 whitespace-pre-wrap text-sm">
                {streamingContents[currentCardIndex] ?? cards[currentCardIndex]?.content}
                {(streamingContents[currentCardIndex] !== undefined || !cards[currentCardIndex]?.content) && <span className="animate-pulse ml-0.5">▊</span>}
              </div>
            </div>

            {/* Bottom Section - Engagement + Actions */}
            <div className="mt-auto">
              {/* Engagement Stats */}
              <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    <ThumbIcon className="w-4 h-4" />
                    <HeartIcon className="w-4 h-4" />
                    <ClapIcon className="w-4 h-4" />
                  </div>
                  <span className="ml-1">127</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>23 comments</span>
                  <span>•</span>
                  <span>8 reposts</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-2 py-1 flex items-center justify-around border-t border-gray-200">
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Like</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Comment</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Repost</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                  <Send className="w-5 h-5" />
                  <span className="text-sm font-medium">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mt-4">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCardIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentCardIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      </>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {cards.map((card, index) => {
            const isStreaming = streamingContents[index] !== undefined;
            const displayContent = isStreaming ? streamingContents[index] : card.content;
            const isRegenerating = regeneratingIndex === index;
            const isLastAndOdd = index === cards.length - 1 && cards.length % 2 !== 0;

            return (
              <div key={index} className={`bg-white rounded-lg border border-gray-200 flex flex-col relative ${isLastAndOdd ? 'lg:col-span-2 lg:max-w-[calc(50%-12px)] lg:mx-auto' : ''}`}>
                {/* Top Right Buttons */}
                {!isGenerating && card.content && (
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    {isRegenerating ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                        <span className="text-sm text-gray-600">Regenerating...</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onRegenerate?.(index, card.content)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => onEdit?.(card)}
                          className="px-3 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Post Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        {userAvatar ? (
                          <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-gray-600 font-semibold text-lg">
                            {userName.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900">{userName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Just now • 🌐</p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3 flex-grow">
                  <div className="text-gray-900 whitespace-pre-wrap text-sm">
                    {displayContent}
                    {(isStreaming || !displayContent) && <span className="animate-pulse ml-0.5">▊</span>}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto">
                  <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <ThumbIcon className="w-4 h-4" />
                        <HeartIcon className="w-4 h-4" />
                        <ClapIcon className="w-4 h-4" />
                      </div>
                      <span className="ml-1">127</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>23 comments</span>
                      <span>•</span>
                      <span>8 reposts</span>
                    </div>
                  </div>

                  <div className="px-2 py-1 flex items-center justify-around border-t border-gray-200">
                    <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors text-gray-600">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-sm font-medium">Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Repost</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-gray-600 transition-colors">
                      <Send className="w-5 h-5" />
                      <span className="text-sm font-medium">Send</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
