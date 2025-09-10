import IdentitySection from '../../components/dashboard/IdentitySection';
import TopicsSection from '../../components/dashboard/TopicsSection';
import ViralPostsSection from '../../components/dashboard/ViralPostsSection';
import WritingStylesSection from '../../components/dashboard/WritingStylesSection';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const handleGeneratePost = () => {
    navigate('/generate');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Section Breakdown
        </h2>
        
        <IdentitySection />
        <TopicsSection />
        <ViralPostsSection />
        <WritingStylesSection />
        
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleGeneratePost}
            className="px-8 py-3 text-lg font-medium"
          >
            Generate your first post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;