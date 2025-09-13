import { useState } from 'react';
import IdentityModal from '@/components/identity/IdentityModal';
import { Button } from '@/components/ui/button';
import { User, ChevronRight } from 'lucide-react';

// Role data for display
const roleLabels: Record<string, string> = {
  // Entrepreneur
  'founder': 'Founder/Co-founder',
  'startup_leader': 'Startup Leader',
  'serial_entrepreneur': 'Serial Entrepreneur',
  'solopreneur': 'Solopreneur',
  'small_business_owner': 'Small Business Owner',
  // Professional
  'executive': 'C-Suite Executive',
  'manager': 'Manager/Director',
  'specialist': 'Industry Specialist',
  'consultant': 'Consultant',
  'freelancer': 'Freelancer',
  // Educator
  'professor': 'Professor/Academic',
  'teacher': 'Teacher/Instructor',
  'coach': 'Coach/Mentor',
  'trainer': 'Corporate Trainer',
  'course_creator': 'Course Creator',
  // Creator
  'content_creator': 'Content Creator',
  'writer': 'Writer/Author',
  'designer': 'Designer',
  'artist': 'Artist',
  'influencer': 'Influencer',
  // Leader
  'thought_leader': 'Thought Leader',
  'community_builder': 'Community Builder',
  'nonprofit_leader': 'Non-Profit Leader',
  'board_member': 'Board Member',
  'activist': 'Activist/Advocate',
};

export default function IdentityTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleSaveIdentity = (roles: string[]) => {
    setSelectedRoles(roles);
    console.log('Selected roles:', roles);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Identity Selection Test</h1>

        {/* Identity Section Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Your Professional Identity</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Define your roles to personalize your LinkedIn content strategy
              </p>

              {selectedRoles.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoles.map((roleId) => (
                      <span
                        key={roleId}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {roleLabels[roleId] || roleId}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No roles selected yet. Click the button to define your identity.
                </p>
              )}
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {selectedRoles.length > 0 ? 'Edit' : 'Define'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Additional Demo Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works:</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Click the "Define" button to open the identity selection modal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>Browse through 5 main categories: Entrepreneur, Professional, Educator, Creator, and Leader</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Click on any category to expand and see specific sub-roles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>Select multiple roles that best describe your professional identity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">5.</span>
              <span>Save your selections to personalize your content generation</span>
            </li>
          </ul>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Smart Categorization</h4>
            <p className="text-sm text-gray-600">
              Organized into 5 main categories with 25+ specific sub-roles to choose from
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-2">✨ Multiple Selection</h4>
            <p className="text-sm text-gray-600">
              Select as many roles as apply to you for a comprehensive professional profile
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-2">📊 Visual Feedback</h4>
            <p className="text-sm text-gray-600">
              See selection counts per category and track your choices easily
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-2">🔄 Easy Editing</h4>
            <p className="text-sm text-gray-600">
              Update your identity anytime as your professional journey evolves
            </p>
          </div>
        </div>
      </div>

      {/* Identity Modal */}
      <IdentityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIdentity}
        initialSelections={selectedRoles}
      />
    </div>
  );
}