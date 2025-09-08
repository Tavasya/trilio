import { memo } from 'react';
import { Linkedin } from 'lucide-react';

const ConnectLinkedInStep = memo(function ConnectLinkedInStep() {

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Connect Your LinkedIn</h2>
        <p className="text-muted-foreground">
          Connect your LinkedIn account to unlock AI-powered content creation and analytics
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Linkedin className="w-10 h-10 text-blue-600" />
          </div>
          
          <button className="px-8 py-3 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors font-medium flex items-center gap-2">
            <Linkedin className="w-5 h-5" />
            Connect LinkedIn Account
          </button>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">Or enter your LinkedIn profile URL</p>
            <div className="max-w-md mx-auto">
              <input
                type="url"
                placeholder="https://www.linkedin.com/in/yourprofile"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="font-medium mb-2">Why connect LinkedIn?</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Analyze your profile performance</li>
            <li>• Generate content tailored to your audience</li>
            <li>• Schedule posts directly from the app</li>
            <li>• Track engagement metrics in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

export default ConnectLinkedInStep;