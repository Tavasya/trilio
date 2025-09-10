import { ChevronRight } from 'lucide-react';

interface ViralPost {
  id: string;
  title?: string;
  content?: string;
}

interface ViralPostsSectionProps {
  posts?: ViralPost[];
}

export default function ViralPostsSection({ posts = [] }: ViralPostsSectionProps) {
  const placeholderPosts = posts.length > 0 ? posts : Array(4).fill(null);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Viral posts on this topics
      </h2>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {placeholderPosts.map((post, index) => (
            <div
              key={post?.id || index}
              className="flex-shrink-0 w-64 h-32 bg-gray-100 rounded-lg border border-gray-200"
            >
              {post ? (
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">Post placeholder</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-gray-600">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}