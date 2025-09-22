import IdentitySection from '../../components/dashboard/IdentitySection';
import TopicsSection from '../../components/dashboard/TopicsSection';
import ViralPostsSection from '../../components/dashboard/ViralPostsSection';
import WritingStylesSection from '../../components/dashboard/WritingStylesSection';
import CharacterCountSection from '../../components/dashboard/CharacterCountSection';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/react-router';
import { toast } from 'sonner';
import { postService } from '@/features/post/postService';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setContent,
  setIdentity,
  setWritingStyle,
  setPostLength,
  setTrendingPosts,
  selectDashboardState
} from '../../features/dashboard/dashboardSlice';


const Dashboard = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const dashboardState = useAppSelector(selectDashboardState);

  const handleGeneratePost = async () => {
    // Only validate that content topic is filled
    const state = dashboardState;
    if (!state.content.trim()) {
      toast.error('Please enter content topics', { position: 'top-right' });
      return;
    }

    const token = await getToken();
    if (!token) {
      toast.error('Authentication required', { position: 'top-right' });
      return;
    }

    // Prepare draft data
    const draftData = {
      content: dashboardState.content,
      visibility: 'PUBLIC' as const,
      identity: dashboardState.identity,
      content_topics: dashboardState.contentTopics,
      writing_style: dashboardState.writingStyle,
      post_length: dashboardState.postLength,
      trending_posts: dashboardState.trendingPosts
    };

    try {
      // Wait for the save to complete before navigating
      const response = await postService.saveDraft(draftData, token);

      if (response.post_id) {
        // Navigate directly with the post ID
        navigate(`/generate?postId=${response.post_id}`);
      } else {
        throw new Error('No post ID returned');
      }
    } catch (error) {
      console.error('Failed to create draft:', error);
      toast.error('Failed to create draft. Please try again.', { position: 'top-right' });
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
          <IdentitySection
            value={dashboardState.identity}
            onChange={(selected) => dispatch(setIdentity(selected))}
          />
          <TopicsSection
            topics={dashboardState.content}
            setTopics={(content) => dispatch(setContent(content))}
          />
          <ViralPostsSection
            topics={dashboardState.content}
            onSelectionChange={(posts) => dispatch(setTrendingPosts(posts))}
          />
          <WritingStylesSection
            value={dashboardState.writingStyle}
            onChange={(styles) => dispatch(setWritingStyle(styles))}
          />
          <CharacterCountSection
            value={dashboardState.postLength}
            onChange={(length) => dispatch(setPostLength(length))}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleGeneratePost}
              className="px-6 py-2.5 text-sm font-medium bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              Generate Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;