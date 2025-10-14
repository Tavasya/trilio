import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import trilioLogo from '@/lib/logo/trilio-logo.png';
import Footer from '@/components/Footer';
import FileUpload from '@/components/rate-linkedin/FileUpload';
import RatingDisplay from '@/components/rate-linkedin/RatingDisplay';
import { linkedInRatingService } from '@/features/linkedin-rating/linkedinRatingService';
import type { RatingResult } from '@/features/linkedin-rating/linkedinRatingTypes';

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={trilioLogo} alt="Trilio" className="h-8 w-auto" />
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-primary text-sm font-medium">
                Home
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Upload className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Rate My LinkedIn Profile
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Upload your LinkedIn profile PDF and get instant AI-powered feedback.
            </p>
            <p className="text-gray-500">
              Discover your strengths, weaknesses, and actionable tips to stand out.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {!ratingResult ? (
            <>
              {/* Upload Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
                <FileUpload
                  onFileSelect={handleFileUpload}
                  isUploading={isUploading}
                  error={error}
                />

                {isUploading && (
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <p className="text-gray-600">Analyzing your profile with AI...</p>
                  </div>
                )}
              </div>

              {/* How It Works */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <span className="text-primary font-bold text-lg">1</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Download Your Profile</h3>
                    <p className="text-sm text-gray-600">
                      On LinkedIn, go to "More" → "Save to PDF" to download your profile
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <span className="text-primary font-bold text-lg">2</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Upload PDF</h3>
                    <p className="text-sm text-gray-600">
                      Drag and drop or click to upload your LinkedIn profile PDF
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <span className="text-primary font-bold text-lg">3</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Get Instant Feedback</h3>
                    <p className="text-sm text-gray-600">
                      Receive detailed AI analysis with actionable tips to improve
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What You'll Get</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <p className="text-gray-700">
                      <strong>Overall Profile Score</strong> - See how your profile rates on a 0-100 scale
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <p className="text-gray-700">
                      <strong>Detailed Category Analysis</strong> - Headline, summary, experience, skills, and more
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <p className="text-gray-700">
                      <strong>Strengths & Weaknesses</strong> - Understand what's working and what needs improvement
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <p className="text-gray-700">
                      <strong>Actionable Tips</strong> - Specific recommendations to boost your profile
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Rating Results */
            <RatingDisplay result={ratingResult} onReset={handleReset} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
