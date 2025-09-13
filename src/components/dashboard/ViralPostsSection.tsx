import { ChevronRight, TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';

interface ViralPost {
  id: string;
  title?: string;
  content?: string;
}

interface ViralPostsSectionProps {
  posts?: ViralPost[];
}

const mockPosts = [
  { 
    id: '1', 
    title: 'The Future of AI', 
    content: 'How artificial intelligence is reshaping industries...', 
    likes: '12.5K', 
    comments: '892',
    views: '125K'
  },
  { 
    id: '2', 
    title: 'Remote Work Revolution', 
    content: 'Why hybrid models are becoming the new standard...', 
    likes: '8.3K', 
    comments: '456',
    views: '89K'
  },
  { 
    id: '3', 
    title: 'Sustainable Business', 
    content: 'Building eco-friendly practices that drive profit...', 
    likes: '15.7K', 
    comments: '1.2K',
    views: '203K'
  },
  { 
    id: '4', 
    title: 'Leadership Lessons', 
    content: 'What I learned from scaling a startup to IPO...', 
    likes: '23.4K', 
    comments: '2.1K',
    views: '450K'
  },
];

export default function ViralPostsSection({ posts = mockPosts }: ViralPostsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Trending in Your Topics
          </h2>
          <p className="text-sm text-gray-500 mt-1">Get inspired by top-performing content</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post: any) => (
          <div
            key={post.id}
            className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer"
          >
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Viral
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2 pr-12 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {post.content}
            </p>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.comments}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}