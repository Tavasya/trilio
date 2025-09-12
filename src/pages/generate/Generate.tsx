import { useState } from 'react';
import ChatInterface from '../../components/generate/ChatInterface';
import LinkedInPreview from '../../components/generate/LinkedInPreview';

export default function Generate() {
  // Sample posts for demonstration - in real app, these would come from AI generation
  const [generatedPosts] = useState([
    { 
      id: '1', 
      content: "🚀 Excited to share that our team just launched a new feature that will revolutionize how we approach project management!\n\nAfter months of user research and development, we've created something truly special. Here are the key highlights:\n\n✅ Real-time collaboration\n✅ AI-powered insights\n✅ Seamless integration\n\nWhat challenges are you facing in project management? Let's discuss in the comments!\n\n#ProjectManagement #Innovation #TechLeadership" 
    },
    { 
      id: '2', 
      content: "💡 3 lessons I learned from leading a cross-functional team:\n\n1. Communication is everything - Over-communicate rather than under-communicate\n\n2. Trust your team - Micromanagement kills creativity\n\n3. Celebrate small wins - Recognition fuels motivation\n\nWhat's the most valuable leadership lesson you've learned?\n\n#Leadership #TeamWork #Management" 
    },
    { 
      id: '3', 
      content: "🎯 Just completed an amazing workshop on AI in product development!\n\nKey takeaways:\n• AI is not replacing humans, it's augmenting our capabilities\n• The future belongs to those who can effectively collaborate with AI\n• Continuous learning is no longer optional\n\nInvesting in yourself is the best ROI you can get.\n\n#AI #ProductDevelopment #ContinuousLearning #TechTrends" 
    }
  ]);

  return (
    <div className="h-full bg-gray-50 flex overflow-hidden">
      {/* Chat Interface - 3/5 width */}
      <div className="w-3/5 p-4 h-full overflow-hidden">
        <ChatInterface />
      </div>

      {/* LinkedIn Preview - 2/5 width */}
      <div className="w-2/5 p-4 h-full overflow-auto">
        <LinkedInPreview posts={generatedPosts} />
      </div>
    </div>
  );
}