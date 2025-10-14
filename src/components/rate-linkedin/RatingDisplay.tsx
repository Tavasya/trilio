import { CheckCircle, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import type { RatingResult } from '@/features/linkedin-rating/linkedinRatingTypes';

interface RatingDisplayProps {
  result: RatingResult;
  onReset: () => void;
}

export default function RatingDisplay({ result, onReset }: RatingDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const categories = [
    { name: 'Profile Completeness', data: result.profile_completeness },
    { name: 'Headline Quality', data: result.headline_quality },
    { name: 'Summary Quality', data: result.summary_quality },
    { name: 'Experience Quality', data: result.experience_quality },
    { name: 'Skills Relevance', data: result.skills_relevance },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 border-l-4 border-primary">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Overall Profile Score</p>
            <h2 className="text-5xl font-bold text-gray-900">{result.overall_score}</h2>
            <p className="text-gray-600 mt-1">out of 100</p>
          </div>
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
        </div>
        <p className="text-sm text-gray-700">
          Profile for: <span className="font-semibold">{result.profile_name}</span>
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Analysis</h3>
        <div className="space-y-4">
          {categories.map((category, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{category.name}</span>
                <span className={`font-bold text-lg ${getScoreColor(category.data.score)}`}>
                  {category.data.score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    category.data.score >= 80
                      ? 'bg-green-500'
                      : category.data.score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${category.data.score}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{category.data.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      {result.strengths && result.strengths.length > 0 && (
        <div className={`rounded-xl border p-6 ${getScoreBgColor(80)}`}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Your Strengths</h3>
          </div>
          <ul className="space-y-2">
            {result.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {result.improvements && result.improvements.length > 0 && (
        <div className={`rounded-xl border p-6 ${getScoreBgColor(40)}`}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-900">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {result.improvements.map((improvement, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">→</span>
                <span className="text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actionable Tips */}
      {result.actionable_tips && result.actionable_tips.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-900">Actionable Tips</h3>
          </div>
          <ol className="space-y-3">
            {result.actionable_tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Rate Another Profile
        </button>
        <a
          href={result.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
        >
          View Original PDF
        </a>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-xl border-l-4 border-primary">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Want to Level Up Your LinkedIn Game?
        </h3>
        <p className="text-gray-700 mb-6">
          Now that you know how your profile rates, let Trilio help you create engaging LinkedIn content
          that showcases your expertise and grows your professional network.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
        >
          Try Trilio Free
        </a>
      </div>
    </div>
  );
}
