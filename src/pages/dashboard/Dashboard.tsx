import { useState } from 'react';
import IdentitySection from '../../components/dashboard/IdentitySection';
import TopicsSection from '../../components/dashboard/TopicsSection';
import ViralPostsSection from '../../components/dashboard/ViralPostsSection';
import WritingStylesSection from '../../components/dashboard/WritingStylesSection';
import CharacterCountSection from '../../components/dashboard/CharacterCountSection';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../features/post/postService';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [topics, setTopics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGeneratePost = async () => {
    if (!topics.trim()) {
      toast.error('Please enter a topic first', { position: 'top-right' });
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication required', { position: 'top-right' });
        return;
      }

      // Save as draft and get post ID
      const response = await postService.saveDraft(
        { 
          content: topics,
          visibility: 'PUBLIC'
        },
        token
      );

      // Navigate to generate page with post ID
      navigate(`/generate?postId=${response.post_id}`);
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft', { position: 'top-right' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Content Creation Studio
          </h1>
          <p className="text-sm text-gray-600">Build your LinkedIn presence with AI-powered content</p>
        </div>
        
        <div className="space-y-4">
          <IdentitySection />
          <TopicsSection topics={topics} setTopics={setTopics} />
          <ViralPostsSection />
          <WritingStylesSection />
          <CharacterCountSection />

          <div className="flex justify-end">
            <Button
              onClick={handleGeneratePost}
              className="px-6 py-2.5 text-sm font-medium bg-primary hover:bg-primary/90 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Generate Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;