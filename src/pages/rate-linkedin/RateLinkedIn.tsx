import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import FileUpload from '@/components/rate-linkedin/FileUpload';
import RatingDisplay from '@/components/rate-linkedin/RatingDisplay';
import { linkedInRatingService } from '@/features/linkedin-rating/linkedinRatingService';
import type { RatingResult } from '@/features/linkedin-rating/linkedinRatingTypes';
import trilioLogo from '@/lib/logo/trilio-logo.png';

export default function RateLinkedIn() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isUploading, setIsUploading] = useState(false);
  const [ratingResult, setRatingResult] = useState<RatingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // SEO metadata
  useEffect(() => {
    document.title = 'Free LinkedIn Profile Rating Tool | Get AI-Powered Feedback | Trilio';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Upload your LinkedIn profile PDF and get instant AI-powered feedback. Discover your profile strengths, weaknesses, and actionable tips to improve your professional presence.');
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await linkedInRatingService.rateProfile(file);
      setRatingResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze profile. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setRatingResult(null);
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
        {!ratingResult ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900">
                Rate My LinkedIn
              </h1>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
              <FileUpload
                onFileSelect={handleFileUpload}
                isUploading={isUploading}
                error={error}
              />

              {isUploading && (
                <div className="mt-8 flex items-center justify-center gap-3 py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <p className="text-base text-gray-600">Analyzing your profile...</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">How to get your LinkedIn PDF:</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Visit Your Profile</h4>
                    <p className="text-sm text-gray-600">Go to your LinkedIn profile and click "More"</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Save as PDF</h4>
                    <p className="text-sm text-gray-600">Select "Save to PDF" from the dropdown menu</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Upload Here</h4>
                    <p className="text-sm text-gray-600">Drop your PDF file in the box above</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Rating Results */
          <div className="grid lg:grid-cols-3 gap-6">
            <RatingDisplay result={ratingResult} onReset={handleReset} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
