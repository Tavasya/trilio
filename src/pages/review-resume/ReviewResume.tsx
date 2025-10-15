import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import FileUpload from '@/components/review-resume/FileUpload';
import ReviewDisplay from '@/components/review-resume/ReviewDisplay';
import { resumeReviewService } from '@/features/resume-review/resumeReviewService';
import type { ResumeReviewResult } from '@/features/resume-review/resumeReviewTypes';
import trilioLogo from '@/lib/logo/trilio-logo.png';

export default function ReviewResume() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isUploading, setIsUploading] = useState(false);
  const [reviewResult, setReviewResult] = useState<ResumeReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // SEO metadata
  useEffect(() => {
    document.title = 'Free Resume Review Tool | Get AI-Powered Feedback for Tech Roles | Trilio';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Upload your resume and get instant AI-powered feedback tailored for tech roles. Discover strengths, weaknesses, ATS compatibility, and actionable tips to land your dream job.');
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await resumeReviewService.reviewResume(file);
      setReviewResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setReviewResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Simple Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <Link to="/" className="inline-block transition-opacity hover:opacity-70">
            <img src={trilioLogo} alt="Trilio" className="h-8 w-auto" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {!reviewResult ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Tech Resume Review
              </h1>
              <p className="text-xl text-gray-600">
                Get AI-powered feedback on your resume for tech roles
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <FileUpload
                onFileSelect={handleFileUpload}
                isUploading={isUploading}
                error={error}
              />

              {isUploading && (
                <div className="mt-8 flex items-center justify-center gap-3 py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <p className="text-base text-gray-600">Analyzing your resume...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Review Results */
          <div className="grid lg:grid-cols-3 gap-6">
            <ReviewDisplay result={reviewResult} onReset={handleReset} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
