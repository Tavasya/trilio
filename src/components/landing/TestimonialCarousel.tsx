import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import sarahJohnson from '@/lib/pfps/sarah_johnson.jpeg';
import michaelChen from '@/lib/pfps/michael-chen.jpeg';
import emmaDavis from '@/lib/pfps/emma_davis.jpeg';
import davidKim from '@/lib/pfps/david_kim.jpeg';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  timeAgo: string;
  message: string;
  likes: number;
  comments: number;
  shares: number;
  reposts: number;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "VP of Engineering → Founder",
    company: "TechStart Inc.",
    avatar: sarahJohnson,
    timeAgo: "2h",
    message: "Just hit 100K followers using Trilio's AI strategies! The platform analyzed successful creators in my niche and gave me a personalized content roadmap. My engagement rate went from 2% to 8% in just 3 months. 🚀",
    likes: 1243,
    comments: 89,
    shares: 45,
    reposts: 23
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    title: "Data Scientist → AI Consultant",
    company: "DataWise Consulting",
    avatar: michaelChen,
    timeAgo: "5h",
    message: "Trilio completely transformed my LinkedIn presence. It identified patterns from 50+ successful data science influencers and created a content strategy that actually works. Went from 5K to 85K followers in 6 months!",
    likes: 892,
    comments: 67,
    shares: 34,
    reposts: 19
  },
  {
    id: "3",
    name: "Emily Thompson",
    title: "Product Manager → CPO",
    company: "ProductLab",
    avatar: emmaDavis,
    timeAgo: "1d",
    message: "The AI-powered content suggestions are incredible. Trilio analyzed my target audience and showed me exactly what type of content resonates. My posts now consistently get 10x more engagement than before.",
    likes: 2156,
    comments: 124,
    shares: 78,
    reposts: 41
  },
  {
    id: "4",
    name: "James Wilson",
    title: "Developer → Tech Lead",
    company: "Microsoft",
    avatar: davidKim,
    timeAgo: "3d",
    message: "From 0 to 200K followers in 8 months! Trilio's creator analysis feature helped me understand what made top tech influencers successful. Now I'm getting speaking invitations and job offers weekly.",
    likes: 3421,
    comments: 198,
    shares: 112,
    reposts: 67
  }
];

export default function TestimonialCarousel() {
  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div 
      className="w-full overflow-hidden relative"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
      }}
    >
      <div className="relative h-[200px]">
        <div className="flex animate-scroll">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className="flex-shrink-0 w-[450px] px-3">
              <div className="bg-white rounded-lg shadow-md p-3 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-2 mb-2">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-xs text-gray-900">{testimonial.name}</h3>
                        <p className="text-[10px] text-gray-600">{testimonial.title}</p>
                        <p className="text-[10px] text-gray-500">{testimonial.company}</p>
                      </div>
                      <span className="text-[10px] text-gray-500">{testimonial.timeAgo}</span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1 mb-2">
                  <p className="text-[11px] text-gray-800 leading-snug line-clamp-2">{testimonial.message}</p>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between py-1 border-t border-gray-100 mb-1">
                  <div className="flex items-center gap-2 text-[10px] text-gray-600">
                    <span className="flex items-center gap-0.5">
                      <span className="text-blue-600 text-xs">👍</span> {testimonial.likes.toLocaleString()}
                    </span>
                    <span>{testimonial.comments} comments</span>
                    <span>{testimonial.reposts} reposts</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-around">
                  <button className="flex items-center gap-1 px-1.5 py-0.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    <Heart className="w-3 h-3" />
                    <span className="text-[10px]">Like</span>
                  </button>
                  <button className="flex items-center gap-1 px-1.5 py-0.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    <MessageCircle className="w-3 h-3" />
                    <span className="text-[10px]">Comment</span>
                  </button>
                  <button className="flex items-center gap-1 px-1.5 py-0.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    <Share2 className="w-3 h-3" />
                    <span className="text-[10px]">Repost</span>
                  </button>
                  <button className="flex items-center gap-1 px-1.5 py-0.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    <Send className="w-3 h-3" />
                    <span className="text-[10px]">Send</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}