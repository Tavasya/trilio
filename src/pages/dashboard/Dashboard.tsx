import { useState } from 'react';
import IdentitySection from '../../components/dashboard/IdentitySection';
import TopicsSection from '../../components/dashboard/TopicsSection';
import ViralPostsSection from '../../components/dashboard/ViralPostsSection';
import WritingStylesSection from '../../components/dashboard/WritingStylesSection';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../features/post/postService';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';

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
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Section Breakdown
        </h2>
        
        <IdentitySection />
        <TopicsSection topics={topics} setTopics={setTopics} />
        <ViralPostsSection />
        <WritingStylesSection />
        
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleGeneratePost}
            className="px-8 py-3 text-lg font-medium"
            disabled={isLoading}
          >
            {isLoading ? 'Saving draft...' : 'Generate your first post'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;