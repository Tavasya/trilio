import { Pencil, CheckCircle2, TrendingUp, RotateCcw, Star, Briefcase, Award, Target, Eye } from 'lucide-react';
import CircularProgress from './CircularProgress';
import type { RatingResult } from '@/features/linkedin-rating/linkedinRatingTypes';

interface RatingDisplayProps {
  result: RatingResult;
  onReset: () => void;
}

export default function RatingDisplay({ result, onReset }: RatingDisplayProps) {
  const categories = [
    { name: 'Strategic Fit', data: result.strategic_fit, icon: Target },
    { name: 'Professional Positioning', data: result.professional_positioning, icon: Star },
    { name: 'Experience Presentation', data: result.experience_presentation, icon: Briefcase },
    { name: 'Credibility Signals', data: result.credibility_signals, icon: Award },
    { name: 'Discoverability', data: result.discoverability, icon: Eye },
  ];

  return (
    <>
      {/* Full Width - Overall Score Banner */}
      <div className="lg:col-span-3">
        <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-lg border border-purple-200 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <CircularProgress value={result.overall_score} size={120} strokeWidth={10} />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{result.profile_name}</h2>
                <p className="text-base text-gray-600">
                  Overall Profile Score: <span className="font-semibold text-purple-600">{result.overall_score}/100</span>
                </p>
              </div>
            </div>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Analyze Another
            </button>
          </div>
        </div>
      </div>

      {/* Profile Classification */}
      <div className="lg:col-span-3">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Classification</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="bg-white rounded-lg p-5 border border-purple-100">
              <p className="text-sm text-purple-600 mb-2">Industry</p>
              <p className="text-base font-semibold text-gray-900">{result.profile_classification.industry}</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-purple-100">
              <p className="text-sm text-purple-600 mb-2">Career Stage</p>
              <p className="text-base font-semibold text-gray-900">{result.profile_classification.career_stage}</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-purple-100">
              <p className="text-sm text-purple-600 mb-2">Profile Strategy</p>
              <p className="text-base font-semibold text-gray-900">{result.profile_classification.profile_strategy}</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-purple-100">
              <p className="text-sm text-purple-600 mb-2">Content Style</p>
              <p className="text-base font-semibold text-gray-900">{result.profile_classification.content_style}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout - Profile Content vs Feedback */}
      <div className="lg:col-span-3 grid lg:grid-cols-2 gap-6">
        {/* LEFT: LinkedIn Profile Preview */}
        <div className="space-y-5">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Profile Header */}
            <div className="px-8 py-6">
              <h3 className="text-2xl font-semibold text-black">{result.profile_name}</h3>
              <p className="text-base text-gray-600 mt-2">LinkedIn Member</p>
            </div>

            {/* Profile Sections */}
            <div className="border-t border-gray-200">
              {/* Headline Section */}
              <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-black">Headline</h4>
                  </div>
                </div>
                <p className="text-base text-black leading-relaxed">
                  {result.profile_data?.headline || 'No headline available'}
                </p>
              </div>

              {/* Summary Section */}
              <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-black">About</h4>
                  </div>
                </div>
                <p className="text-base text-black leading-relaxed">
                  {result.profile_data?.summary || 'No summary available'}
                </p>
              </div>

              {/* Experience Section */}
              <div className="p-8 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-black">Experience</h4>
                  </div>
                </div>
                {result.profile_data?.experience && result.profile_data.experience.length > 0 ? (
                  <div className="space-y-4">
                    {result.profile_data.experience.map((exp, idx) => (
                      <div key={idx}>
                        <p className="text-base font-semibold text-black">{exp.title}</p>
                        {exp.company && <p className="text-sm text-gray-600 mt-1">{exp.company}</p>}
                        {exp.duration && <p className="text-sm text-gray-500">{exp.duration}</p>}
                        {exp.description && (
                          <p className="text-sm text-black mt-2 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-black leading-relaxed">No experience listed</p>
                )}
              </div>

              {/* Skills Section */}
              <div className="p-8 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-black">Skills & Endorsements</h4>
                  </div>
                </div>
                {result.profile_data?.skills && result.profile_data.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.profile_data.skills.slice(0, 9).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-black text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {result.profile_data.skills.length > 9 && (
                      <span className="px-3 py-1.5 text-gray-500 text-sm">
                        +{result.profile_data.skills.length - 9} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-base text-black leading-relaxed">No skills listed</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: AI Feedback & Improvements */}
        <div className="space-y-5">
          {/* Detailed Feedback for Each Section */}
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      category.data.score >= 8 ? 'bg-green-100' :
                      category.data.score >= 6 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        category.data.score >= 8 ? 'text-green-600' :
                        category.data.score >= 6 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">Score: {category.data.score}/10</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      category.data.score >= 8 ? 'bg-green-500' :
                      category.data.score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(category.data.score / 10) * 100}%` }}
                  />
                </div>

                {/* Feedback */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {category.data.feedback}
                </p>
              </div>
            );
          })}

          {/* Quick Wins */}
          {result.actionable_tips && result.actionable_tips.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h4 className="text-base font-semibold text-gray-900">Quick Wins</h4>
              </div>
              <div className="space-y-3">
                {result.actionable_tips.slice(0, 3).map((tip, idx) => (
                  <div key={idx} className="flex gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-xs">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="lg:col-span-3">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-xl font-semibold mb-3">Ready to create engaging LinkedIn content?</h3>
          <p className="text-base text-purple-100 mb-6">Use Trilio to write posts that showcase your expertise</p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 text-base font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Try Trilio Free
          </a>
        </div>
      </div>
    </>
  );
}
