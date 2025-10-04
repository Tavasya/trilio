import { useState } from 'react';
import { X, Briefcase, TrendingUp, MessageCircle, BarChart3, Lightbulb, Target } from 'lucide-react';

interface HooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (icp: string, hookType: string, title: string, gradient: string) => void;
}

type ICP = 'job-seekers' | 'engagement' | null;
type HookType = 'question' | 'story' | 'controversial' | 'data-driven' | 'personal' | 'how-to' | null;

const hookCategories = {
  'job-seekers': [
    {
      id: 'question',
      title: 'Question Hook',
      description: 'Start with a compelling question that makes recruiters want to learn more about your expertise',
      gradient: 'from-blue-400 to-blue-600',
      usedBy: ['LinkedIn Coaches', 'Career Experts']
    },
    {
      id: 'personal',
      title: 'Personal Experience',
      description: 'Share a relatable story from your career journey that demonstrates your skills and growth',
      gradient: 'from-purple-400 to-purple-600',
      usedBy: ['Career Coaches', 'Job Seekers']
    },
    {
      id: 'data-driven',
      title: 'Data-Driven Hook',
      description: 'Use statistics or numbers to showcase your impact and achievements in previous roles',
      gradient: 'from-green-400 to-green-600',
      usedBy: ['Data Analysts', 'Product Managers']
    },
    {
      id: 'how-to',
      title: 'How-To Hook',
      description: 'Provide valuable tips or advice that demonstrates your expertise in your field',
      gradient: 'from-orange-400 to-orange-600',
      usedBy: ['Industry Experts', 'Thought Leaders']
    }
  ],
  'engagement': [
    {
      id: 'controversial',
      title: 'Controversial Take',
      description: 'Share a bold opinion that sparks conversation and gets people engaged in the comments',
      gradient: 'from-red-400 to-red-600',
      usedBy: ['Influencers', 'Thought Leaders']
    },
    {
      id: 'story',
      title: 'Story Hook',
      description: 'Tell a compelling narrative that draws readers in and keeps them engaged till the end',
      gradient: 'from-indigo-400 to-indigo-600',
      usedBy: ['Content Creators', 'Storytellers']
    },
    {
      id: 'question',
      title: 'Question Hook',
      description: 'Pose an intriguing question that encourages your audience to share their thoughts',
      gradient: 'from-blue-400 to-blue-600',
      usedBy: ['Community Builders', 'Engagement Specialists']
    },
    {
      id: 'data-driven',
      title: 'Data-Driven Hook',
      description: 'Lead with surprising statistics that challenge assumptions and drive discussion',
      gradient: 'from-green-400 to-green-600',
      usedBy: ['Analysts', 'Researchers']
    }
  ]
};

export default function HooksModal({ isOpen, onClose, onApply }: HooksModalProps) {
  const [selectedICP, setSelectedICP] = useState<ICP>(null);
  const [selectedHook, setSelectedHook] = useState<HookType>(null);
  const [step, setStep] = useState<'icp' | 'hook'>('icp');

  if (!isOpen) return null;

  const handleICPSelect = (icp: ICP) => {
    setSelectedICP(icp);
    setStep('hook');
  };

  const handleHookSelect = (hook: HookType) => {
    setSelectedHook(hook);
  };

  const handleApply = () => {
    if (selectedICP && selectedHook) {
      const hook = currentHooks.find(h => h.id === selectedHook);
      if (hook) {
        onApply(selectedICP, selectedHook, hook.title, hook.gradient);
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setSelectedICP(null);
    setSelectedHook(null);
    setStep('icp');
    onClose();
  };

  const handleBack = () => {
    setSelectedHook(null);
    setStep('icp');
  };

  const currentHooks = selectedICP ? hookCategories[selectedICP] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-gray-200">
            <div className="flex-1 pr-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {step === 'icp' ? 'Choose Your Persona' : 'Choose a Hook Type'}
              </h2>
              <p className="text-gray-600 mt-1 text-sm font-light leading-relaxed">
                {step === 'icp'
                  ? 'Select your target audience to get tailored hook suggestions'
                  : 'Select one hook style for your content'
                }
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6">
            {step === 'icp' ? (
              /* ICP Selection */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleICPSelect('job-seekers')}
                  className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-all duration-200 hover:shadow-lg text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-blue-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Job Seekers</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Optimize your content to attract recruiters and land your dream job
                  </p>
                </button>

                <button
                  onClick={() => handleICPSelect('engagement')}
                  className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-all duration-200 hover:shadow-lg text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Engagement</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Create viral content that drives comments, shares, and connections
                  </p>
                </button>
              </div>
            ) : (
              /* Hook Categories */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentHooks.map((hook) => (
                  <button
                    key={hook.id}
                    onClick={() => handleHookSelect(hook.id as HookType)}
                    className={`relative bg-white border-2 rounded-xl p-5 text-left transition-all duration-200 h-full flex flex-col ${
                      selectedHook === hook.id
                        ? 'border-green-500 bg-green-50/50'
                        : 'border-gray-200 hover:border-green-500 hover:shadow-lg'
                    }`}
                  >
                    {/* Gradient Preview */}
                    <div className={`h-16 bg-gradient-to-r ${hook.gradient} rounded-lg mb-3 flex items-center justify-center flex-shrink-0`}>
                      {hook.id === 'question' && <MessageCircle className="w-5 h-5 text-white" />}
                      {hook.id === 'story' && <Lightbulb className="w-5 h-5 text-white" />}
                      {hook.id === 'controversial' && <Target className="w-5 h-5 text-white" />}
                      {hook.id === 'data-driven' && <BarChart3 className="w-5 h-5 text-white" />}
                      {hook.id === 'personal' && <Briefcase className="w-5 h-5 text-white" />}
                      {hook.id === 'how-to' && <Lightbulb className="w-5 h-5 text-white" />}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{hook.title}</h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed flex-grow">{hook.description}</p>

                    {/* Used By */}
                    <div className="mt-auto">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Used By</p>
                      <div className="flex flex-wrap gap-1.5">
                        {hook.usedBy.map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={step === 'icp' ? handleClose : handleBack}
              className="px-5 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              {step === 'icp' ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedHook}
              className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
