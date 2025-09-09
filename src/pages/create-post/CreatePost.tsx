import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { publishToLinkedIn } from '@/features/post/postSlice';
import { useAuth } from '@clerk/react-router';
import { useNavigate } from 'react-router';
import { Globe, Users } from 'lucide-react';

export default function CreatePost() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isLoading } = useAppSelector(state => state.post);
  
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'CONNECTIONS'>('PUBLIC');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const post = {
        content,
        ...(mediaUrl && { media_url: mediaUrl }),
        visibility,
      };

      await dispatch(publishToLinkedIn({ post, token })).unwrap();
      navigate('/posts');
    } catch (error) {
      console.error('Failed to publish:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create LinkedIn Post</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                Post Content
              </label>
              <textarea
                id="content"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="What do you want to share on LinkedIn?"
                required
              />
              <div className="mt-1 text-sm text-gray-500">
                {content.length} / 3000 characters
              </div>
            </div>

            <div>
              <label htmlFor="media_url" className="block text-sm font-medium mb-2">
                Article Link (Optional)
              </label>
              <input
                type="url"
                id="media_url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                placeholder="https://example.com/article"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Visibility
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setVisibility('PUBLIC')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    visibility === 'PUBLIC'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setVisibility('CONNECTIONS')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    visibility === 'CONNECTIONS'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Connections Only
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className={`px-6 py-2 bg-blue-500 text-white rounded-lg transition-colors ${
                  isLoading || !content.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Publishing...' : 'Publish to LinkedIn'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/posts')}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}