import { useState } from 'react';
import { RefreshCw, MoreHorizontal, ThumbsUp, MessageCircle, Share2, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import ThumbIcon from '@/lib/icons/thumb.svg?react';
import HeartIcon from '@/lib/icons/heart.svg?react';
import ClapIcon from '@/lib/icons/clap.svg?react';

interface CarouselCard {
  title: string;
  content: string;
}

interface CarouselSectionProps {
  cards: CarouselCard[];
  userName: string;
  userAvatar: string;
  onEdit?: (index: number) => void;
  onRegenerate?: (index: number) => void;
}

export default function CarouselSection({
  cards,
  userName,
  userAvatar,
  onEdit,
  onRegenerate
}: CarouselSectionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-8 text-center">
        Choose a variation to continue
      </h2>

      {/* Desktop Carousel - 3D overlap effect */}
      <div className="hidden lg:block relative w-full max-w-4xl mx-auto min-h-[600px]">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex items-start justify-center">
          {cards.map((card, index) => {
            const position = (index - currentCardIndex + cards.length) % cards.length;

            // Only show 3 cards: left (2), center (0), right (1)
            if (position > 2) return null;

            const isActive = position === 0;
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
                className={`absolute top-0 left-1/2 w-[550px] h-full transition-all duration-500 ease-out ${!isActive ? 'pointer-events-none' : ''}`}
                style={{
                  zIndex,
                  transform: `translate(calc(-50% + ${translateX}px), 0) scale(${scale})`,
                  opacity,
                  filter
                }}
              >
              <div className="bg-white rounded-lg border border-gray-200 relative h-full flex flex-col">
                {/* Top Right Buttons - Only show on active card */}
                {isActive && (
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button
                      onClick={() => onRegenerate?.(index)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onEdit?.(index)}
                      className="px-3 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Edit
                    </button>
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
                    {card.content}
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
      <div className="lg:hidden relative w-full">
        <div className="h-[600px] relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          <div className="px-12 h-full flex items-start">
            <div className="bg-white rounded-lg border border-gray-200 relative h-full w-full flex flex-col">
            {/* Top Right Buttons */}
            <div className="absolute top-3 right-3 flex gap-2 z-10">
              <button
                onClick={() => onRegenerate?.(currentCardIndex)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onEdit?.(currentCardIndex)}
                className="px-3 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Edit
              </button>
            </div>

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
                {cards[currentCardIndex].content}
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
    </div>
  );
}
